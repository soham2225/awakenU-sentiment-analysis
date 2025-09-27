from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

# Allow your React dev server (adjust origin in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or "*" for wide dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility to load latest enriched feedback
def load_enriched():
    path = "data/analyzed/feedback_enriched.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Enriched feedback not found")
    return pd.read_csv(path)

@app.get("/api/feedback")
def get_feedback(limit: int = 100):
    df = load_enriched()
    return df.head(limit).to_dict(orient="records")

@app.get("/api/summary")
def get_summary():
    df = load_enriched()
    # example KPIs
    total = len(df)
    sentiment_counts = df["sentiment"].value_counts().to_dict()
    urgency_counts = df["urgency"].value_counts().to_dict()
    return {
        "total_feedback": total,
        "sentiment_distribution": sentiment_counts,
        "urgency_distribution": urgency_counts,
    }

@app.get("/api/alerts")
def get_alerts():
    path = "data/analyzed/alerts.csv"
    if not os.path.exists(path):
        return []
    alerts_df = pd.read_csv(path)
    return alerts_df.to_dict(orient="records")
