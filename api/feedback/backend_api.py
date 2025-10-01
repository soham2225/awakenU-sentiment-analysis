import os
import io
import csv
import logging
import pandas as pd
import numpy as np
import stripe

from fastapi import FastAPI, HTTPException, Request, Query ,body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Paths --------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '..', '..', 'data', 'analyzed')
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', '..', 'frontend_react', 'workspace', 'dashboard', 'dist'))

FEEDBACK_FILE = (
    os.path.join(DATA_DIR, "feedback_enriched.csv")
    if os.path.exists(os.path.join(DATA_DIR, "feedback_enriched.csv"))
    else os.path.join(DATA_DIR, "feedback_results.csv")
)
ALERTS_FILE = os.path.join(DATA_DIR, "alerts.csv")

# -------------------- Stripe Payments --------------------
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "")
STRIPE_CURRENCY = os.getenv("STRIPE_CURRENCY", "usd")
STRIPE_AMOUNT_CENTS = int(os.getenv("STRIPE_AMOUNT_CENTS", "499"))
PUBLIC_DOMAIN = os.getenv("PUBLIC_DOMAIN", "http://127.0.0.1:8000")

# -------------------- Utility Functions --------------------
def load_and_normalize_df(path: str) -> pd.DataFrame:
    if not os.path.exists(path):
        raise FileNotFoundError(f"File does not exist: {path}")
    df = pd.read_csv(path)
    for col in ["sentiment", "urgency", "feedback_type", "platform"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.lower().replace("nan", None)
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    return df

def sanitize_value(v):
    if isinstance(v, (np.generic,)):
        try: v = v.item()
        except Exception: v = None
    if isinstance(v, float):
        if np.isnan(v) or np.isinf(v): return None
        return round(v, 3)
    if isinstance(v, (list, tuple)):
        return [sanitize_value(x) for x in v]
    if isinstance(v, dict):
        return {k: sanitize_value(val) for k, val in v.items()}
    return v

def sanitize_record(rec: dict) -> dict:
    return {k: sanitize_value(v) for k, v in rec.items()}

# -------------------- Global Error Handler --------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error in request %s %s", request.method, request.url)
    return JSONResponse({"detail": "Internal server error"}, status_code=500)

# -------------------- API Routes --------------------
@app.get("/health")
def health():
    return {"status": "Backend is running"}

@app.get("/api/summary")
def get_summary():
    if not os.path.exists(FEEDBACK_FILE):
        raise HTTPException(status_code=404, detail="No analyzed data found.")
    df = load_and_normalize_df(FEEDBACK_FILE)

    total = len(df)
    sentiment_counts = {
        "positive": int((df["sentiment"] == "positive").sum()),
        "negative": int((df["sentiment"] == "negative").sum()),
        "neutral": int((df["sentiment"] == "neutral").sum()) if "neutral" in df["sentiment"].unique() else 0,
    }
    urgency_counts = {k: int(v) for k, v in df["urgency"].value_counts().items()} if "urgency" in df.columns else {}
    feedback_type_counts = {k: int(v) for k, v in df["feedback_type"].value_counts().items()} if "feedback_type" in df.columns else {}

    platform_comparison = []
    if "platform" in df.columns:
        df["platform"] = df["platform"].fillna("unknown")
        for p in sorted(df["platform"].dropna().unique()):
            sub = df[df["platform"] == p]
            platform_comparison.append({
                "name": p,
                "positive": int((sub["sentiment"] == "positive").sum()),
                "negative": int((sub["sentiment"] == "negative").sum()),
                "neutral": int((sub["sentiment"] == "neutral").sum()) if "neutral" in sub["sentiment"].unique() else 0,
            })

    trends = []
    if "date" in df.columns:
        df["date_parsed"] = pd.to_datetime(df["date"], errors="coerce", dayfirst=False)
        df = df.dropna(subset=["date_parsed"])
        if not df.empty:
            df["date_str"] = df["date_parsed"].dt.strftime("%b %d %Y")
            grouped = df.groupby(["date_str", "sentiment"]).size().unstack(fill_value=0)
            sorted_index = sorted(grouped.index, key=lambda x: pd.to_datetime(x, format="%b %d %Y", errors="coerce"))
            for date_label in sorted_index:
                row = grouped.loc[date_label]
                trends.append({
                    "name": date_label,
                    "positive": int(row.get("positive", 0)),
                    "negative": int(row.get("negative", 0)),
                    "neutral": int(row.get("neutral", 0)),
                })

    return jsonable_encoder({
        "total_feedback": total,
        "sentiment_counts": sentiment_counts,
        "urgency_counts": urgency_counts,
        "feedback_type_counts": feedback_type_counts,
        "platform_comparison": platform_comparison,
        "trends": trends,
    })

@app.get("/api/feedback")
def get_feedback(limit: int = 200):
    if not os.path.exists(FEEDBACK_FILE): return []
    df = load_and_normalize_df(FEEDBACK_FILE)
    if "message" not in df.columns and "cleaned_body" in df.columns:
        df["message"] = df["cleaned_body"]
    df = df.where(pd.notnull(df), None)
    records = df.head(limit).to_dict(orient="records")
    return jsonable_encoder([sanitize_record(r) for r in records])

@app.get("/api/alerts")
def get_alerts(
    request: Request,
    urgency: str = Query("", alias="urgency"),
    feedback_type: str = Query("", alias="feedback_type")
):
    try:
        urgency_filter = urgency.strip().lower()
        type_filter = feedback_type.strip().lower()
        csv_path = os.path.join(DATA_DIR, "feedback_enriched.csv")
        if not os.path.exists(csv_path):
            raise HTTPException(status_code=404, detail="feedback_enriched.csv not found")

        df = pd.read_csv(csv_path)
        if "urgency" in df.columns:
            df["urgency"] = df["urgency"].astype(str).str.strip().str.lower()
        if "feedback_type" in df.columns:
            df["feedback_type"] = df["feedback_type"].astype(str).str.strip().str.lower()

        if urgency_filter and urgency_filter != "all urgencies":
            df = df[df["urgency"].str.contains(urgency_filter, na=False)]
        if type_filter and type_filter != "all feedback types":
            df = df[df["feedback_type"].str.contains(type_filter, na=False)]

        alerts_data = df.rename(columns={"cleaned_body": "details", "action_recommended": "action"}).to_dict(orient="records")
        return JSONResponse(content=jsonable_encoder([sanitize_record(r) for r in alerts_data]))
    except Exception as e:
        logger.exception("Error in get_alerts")
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- Stripe Checkout --------------------
@app.post("/api/checkout")
async def create_checkout_session(request: Request, body: dict = Body(...)):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe is not configured")

    try:
        plan = body.get("plan", "pro")
        amount_cents = body.get("amount_cents", 2999)
        currency = body.get("currency", "usd")

        plan_configs = {
            "basic": {"name": "Basic Export Plan", "description": "Export up to 1,000 records with basic analytics"},
            "pro": {"name": "Pro Export Plan", "description": "Export up to 10,000 records with advanced analytics and custom filters"},
            "enterprise": {"name": "Enterprise Export Plan", "description": "Unlimited exports with all formats, API access, and dedicated support"}
        }

        plan_config = plan_configs.get(plan, plan_configs["pro"])
        success_url = f"{PUBLIC_DOMAIN}/#/export-success?session_id={{CHECKOUT_SESSION_ID}}&plan={plan}"
        cancel_url = f"{PUBLIC_DOMAIN}/#/dashboard"

        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": currency,
                    "unit_amount": amount_cents,
                    "product_data": {"name": plan_config["name"], "description": plan_config["description"]},
                },
                "quantity": 1,
            }],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"plan": plan, "amount_cents": str(amount_cents), "currency": currency}
        )
        return {"url": session.url}
    except Exception as e:
        logger.exception("Error creating checkout session")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/export")
def export_csv(session_id: str):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id is required")

    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session")

    if session.get("payment_status") != "paid":
        raise HTTPException(status_code=402, detail="Payment required")

    if not os.path.exists(FEEDBACK_FILE):
        raise HTTPException(status_code=404, detail="No data to export")

    df = load_and_normalize_df(FEEDBACK_FILE)
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(df.columns.tolist())
    for _, row in df.iterrows():
        writer.writerow([row.get(col, None) for col in df.columns])
    buffer.seek(0)

    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=export.csv"},
    )

# -------------------- Serve Frontend --------------------
if os.path.isdir(FRONTEND_DIR) and os.path.isfile(os.path.join(FRONTEND_DIR, 'index.html')):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
    print(f"Serving frontend from: {FRONTEND_DIR}")
else:
    print(f"Frontend build not found at: {FRONTEND_DIR}")
