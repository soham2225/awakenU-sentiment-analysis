import os
import io
import csv
import logging
import pandas as pd
import numpy as np
import stripe
import razorpay

from fastapi import FastAPI, HTTPException, Request, Query
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

# -------------------- Stripe & Razorpay Setup --------------------
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

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
        try:
            v = v.item()
        except Exception:
            v = None
    if isinstance(v, float):
        if np.isnan(v) or np.isinf(v):
            return None
        return round(v, 3)
    if isinstance(v, (list, tuple)):
        return [sanitize_value(x) for x in v]
    if isinstance(v, dict):
        return {k: sanitize_value(val) for k, val in v.items()}
    return v

def sanitize_record(rec: dict) -> dict:
    return {k: sanitize_value(v) for k, v in rec.items()}

# -------------------- Health --------------------
@app.get("/health")
def health():
    return {"status": "Backend is running"}

# -------------------- Summary --------------------
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

# -------------------- Feedback --------------------
@app.get("/api/feedback")
def get_feedback(limit: int = 200):
    if not os.path.exists(FEEDBACK_FILE): return []
    df = load_and_normalize_df(FEEDBACK_FILE)
    if "message" not in df.columns and "cleaned_body" in df.columns:
        df["message"] = df["cleaned_body"]
    df = df.where(pd.notnull(df), None)
    records = df.head(limit).to_dict(orient="records")
    return jsonable_encoder([sanitize_record(r) for r in records])

# -------------------- Alerts --------------------
@app.get("/api/alerts")
def get_alerts(
    urgency: str = Query("", alias="urgency"),
    feedback_type: str = Query("", alias="feedback_type")
):
    try:
        df = load_and_normalize_df(FEEDBACK_FILE)
        if urgency and urgency != "all urgencies":
            df = df[df["urgency"].str.contains(urgency.lower(), na=False)]
        if feedback_type and feedback_type != "all feedback types":
            df = df[df["feedback_type"].str.contains(feedback_type.lower(), na=False)]
        alerts_data = df.rename(columns={"cleaned_body": "details", "action_recommended": "action"}).to_dict(orient="records")
        return JSONResponse(content=jsonable_encoder([sanitize_record(r) for r in alerts_data]))
    except Exception as e:
        logger.exception("Error in get_alerts")
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- Razorpay --------------------
@app.post("/api/payment_gateway/create-order")
async def create_razorpay_order(request: Request):
    try:
        body = await request.json()
        amount_rupees = body.get("amount", 299)
        selected_plan = body.get("selectedPlanId", "pro")

        amount_paise = int(amount_rupees * 100)
        plan_descriptions = {
            "basic": "Export up to 1,000 records",
            "pro": "Export up to 10,000 records",
            "enterprise": "Unlimited exports"
        }

        order = razorpay_client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "payment_capture": 1,
            "notes": {"plan": selected_plan, "description": plan_descriptions.get(selected_plan, "Pro Export Plan")}
        })
        return JSONResponse(order)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/payment_gateway/verify-payment")
async def verify_payment(request: Request):
    try:
        body = await request.json()
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": body["razorpay_order_id"],
            "razorpay_payment_id": body["razorpay_payment_id"],
            "razorpay_signature": body["razorpay_signature"],
        })
        return {"status": "success"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}

# -------------------- Reviews Insights --------------------
@app.get("/api/reviews/insights")
def get_product_insights():
    """Return customer stories and products needing attention from feedback data."""
    try:
        df = load_and_normalize_df(FEEDBACK_FILE)
        customer_stories, products_needing_attention = [], []

        if "product" in df.columns and "sentiment" in df.columns:
            for i, row in df.head(20).iterrows():
                sentiment_score = int(row.get("sentiment_score", np.random.uniform(60, 95)) * 100) if "sentiment_score" in row else np.random.randint(60, 95)
                sentiment_type = row.get("sentiment", "positive")
                customer_stories.append({
                    "id": int(i),
                    "name": row.get("username", f"User{i}"),
                    "initials": str(row.get("username", "U"))[0].upper(),
                    "product": row.get("product", "Unknown Product"),
                    "review": row.get("cleaned_body", "No review text available."),
                    "rating": int(row.get("rating", np.random.randint(3, 5))),
                    "sentiment": sentiment_score,
                    "sentimentType": sentiment_type
                })

        if "sentiment_score" in df.columns and "product" in df.columns:
            low_sent = df[df["sentiment_score"] < 0.5]
            for i, row in low_sent.iterrows():
                products_needing_attention.append({
                    "id": int(i),
                    "name": row.get("product", "Unknown Product"),
                    "issue": row.get("feedback_type", "Negative feedback trend"),
                    "priority": "HIGH" if row["sentiment_score"] < 0.25 else "MEDIUM",
                    "sentiment": int(row["sentiment_score"] * 100),
                    "reviews": np.random.randint(50, 500)
                })

        return {
            "customerStories": customer_stories,
            "productsNeedingAttention": products_needing_attention
        }
    except Exception as e:
        logger.exception("Error generating product insights")
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- Export --------------------
@app.get("/api/export")
def export_csv():
    if not os.path.exists(FEEDBACK_FILE):
        raise HTTPException(status_code=404, detail="No data to export")
    df = load_and_normalize_df(FEEDBACK_FILE)
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=export.csv"},
    )

# -------------------- Serve Frontend --------------------
if os.path.isdir(FRONTEND_DIR) and os.path.isfile(os.path.join(FRONTEND_DIR, 'index.html')):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
    print(f"✅ Serving frontend from: {FRONTEND_DIR}")
else:
    print(f"⚠️ Frontend build not found at: {FRONTEND_DIR}")
