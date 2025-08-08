import os
import pandas as pd
import numpy as np
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from starlette.responses import JSONResponse

# Setup simple logging to stdout
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS (restrict in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_and_normalize_df(path: str) -> pd.DataFrame:
    if not os.path.exists(path):
        raise FileNotFoundError(f"File does not exist: {path}")
    df = pd.read_csv(path)

    # Normalize string casing where relevant
    if "sentiment" in df.columns:
        df["sentiment"] = df["sentiment"].astype(str).str.lower()
    if "urgency" in df.columns:
        df["urgency"] = df["urgency"].astype(str).str.lower()
    if "feedback_type" in df.columns:
        df["feedback_type"] = df["feedback_type"].astype(str).str.lower()
    if "platform" in df.columns:
        df["platform"] = df["platform"].astype(str).str.lower()

    # Replace infinities with NaN then nullify later
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    return df


def sanitize_value(v):
    # Recursively sanitize for JSON
    if isinstance(v, (np.generic,)):
        try:
            v = v.item()
        except Exception:
            v = None
    if isinstance(v, float):
        if np.isnan(v) or np.isinf(v):
            return None
        # Optionally limit precision
        return round(v, 3)
    if isinstance(v, (list, tuple)):
        return [sanitize_value(x) for x in v]
    if isinstance(v, dict):
        return {k: sanitize_value(val) for k, val in v.items()}
    return v


def sanitize_record(rec: dict) -> dict:
    return {k: sanitize_value(v) for k, v in rec.items()}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error in request %s %s", request.method, request.url)
    return JSONResponse({"detail": "Internal server error"}, status_code=500)


@app.get("/")
def root():
    return {"status": "Backend is running"}


@app.get("/api/summary")
def get_summary():
    # prefer enriched, fallback to basic
    path = "data/analyzed/feedback_enriched.csv" if os.path.exists("data/analyzed/feedback_enriched.csv") else "data/analyzed/feedback_results.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="No analyzed data found. Run sentiment + tagging pipeline first.")

    df = load_and_normalize_df(path)

    total = len(df)

    # Sentiment breakdown (ensure keys exist)
    sentiment_counts = {
        "positive": int(df[df["sentiment"] == "positive"].shape[0]),
        "negative": int(df[df["sentiment"] == "negative"].shape[0]),
        "neutral": int(df[df["sentiment"] == "neutral"].shape[0]) if "neutral" in df["sentiment"].unique() else 0,
    }

    urgency_counts = {}
    if "urgency" in df.columns:
        urgency_counts = {k: int(v) for k, v in df["urgency"].value_counts().items()}

    feedback_type_counts = {}
    if "feedback_type" in df.columns:
        feedback_type_counts = {k: int(v) for k, v in df["feedback_type"].value_counts().items()}

    platform_comparison = []
    if "platform" in df.columns:
        for p in sorted(df["platform"].dropna().unique()):
            sub = df[df["platform"] == p]
            platform_comparison.append({
                "name": p,
                "positive": int(sub[sub["sentiment"] == "positive"].shape[0]),
                "negative": int(sub[sub["sentiment"] == "negative"].shape[0]),
                "neutral": int(sub[sub["sentiment"] == "neutral"].shape[0]) if "neutral" in sub["sentiment"].unique() else 0,
            })

    trends = []
    if "date" in df.columns:
        # Coerce to datetime, format as "Aug 03" etc.
        df["date_parsed"] = pd.to_datetime(df["date"], errors="coerce")
        df["date_str"] = df["date_parsed"].dt.strftime("%b %d")
        grouped = df.groupby(["date_str", "sentiment"]).size().unstack(fill_value=0)
        # Sort by actual date if possible
        try:
            sorted_index = sorted(grouped.index, key=lambda x: pd.to_datetime(x, format="%b %d", errors="coerce") or x)
        except Exception:
            sorted_index = list(grouped.index)
        for date_label in sorted_index:
            row = grouped.loc[date_label]
            trends.append({
                "name": date_label,
                "positive": int(row.get("positive", 0)),
                "negative": int(row.get("negative", 0)),
                "neutral": int(row.get("neutral", 0)),
            })

    payload = {
        "total_feedback": total,
        "sentiment_counts": sentiment_counts,
        "urgency_counts": urgency_counts,
        "feedback_type_counts": feedback_type_counts,
        "platform_comparison": platform_comparison,
        "trends": trends,
    }

    return jsonable_encoder(payload)


@app.get("/api/feedback")
def get_feedback(limit: int = 200):
    path = "data/analyzed/feedback_enriched.csv" if os.path.exists("data/analyzed/feedback_enriched.csv") else "data/analyzed/feedback_results.csv"
    if not os.path.exists(path):
        return []

    df = load_and_normalize_df(path)
    # Nullify missing values
    df = df.where(pd.notnull(df), None)
    records = df.head(limit).to_dict(orient="records")

    sanitized = [sanitize_record(rec) for rec in records]
    return jsonable_encoder(sanitized)


@app.get("/api/alerts")
def get_alerts():
    path = "data/analyzed/feedback_enriched.csv" if os.path.exists("data/analyzed/feedback_enriched.csv") else "data/analyzed/feedback_results.csv"
    if not os.path.exists(path):
        return []

    df = load_and_normalize_df(path)
    if "urgency" not in df.columns or "sentiment" not in df.columns:
        return []

    alerts_df = df[
        (df["urgency"].str.lower() == "high") &
        (df["sentiment"].str.lower() == "negative")
    ]
    alerts_df = alerts_df.where(pd.notnull(alerts_df), None)
    records = alerts_df.to_dict(orient="records")
    sanitized = [sanitize_record(rec) for rec in records]
    return jsonable_encoder(sanitized)
