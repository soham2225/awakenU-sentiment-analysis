import os
import pandas as pd
from datetime import datetime, timedelta

ALERT_OUTPUT = "data/analyzed/alerts.csv"
FEEDBACK_PATH = "data/analyzed/feedback_enriched.csv"

# Thresholds / heuristics
NEGATIVE_CONFIDENCE_THRESHOLD = 0.7  # strong negative
SPIKE_WINDOW_HOURS = 24  # window to detect sudden complaint spike
SPIKE_MULTIPLIER = 2  # current complaints > multiplier * average

def load_feedback():
    if not os.path.exists(FEEDBACK_PATH):
        print(f"❌ Enriched feedback file not found: {FEEDBACK_PATH}")
        return pd.DataFrame()
    return pd.read_csv(FEEDBACK_PATH)

def detect_high_risk(df):
    alerts = []

    # Parse date column if possible
    if "date" in df.columns:
        try:
            df["parsed_date"] = pd.to_datetime(df["date"], errors="coerce")
        except:
            df["parsed_date"] = pd.NaT
    else:
        df["parsed_date"] = pd.NaT

    now = datetime.now()
    window_start = now - timedelta(hours=SPIKE_WINDOW_HOURS)

    # 1. High urgency complaint
    cond1 = (
        (df["feedback_type"] == "complaint") &
        (df["urgency"] == "high")
    )
    for _, row in df[cond1].iterrows():
        alerts.append({
            "alert_type": "high_urgency_complaint",
            "email_id": row.get("email_id", ""),
            "platform": row.get("platform", ""),
            "sender": row.get("sender", ""),
            "product": row.get("product", ""),
            "sentiment": row.get("sentiment", ""),
            "confidence": row.get("confidence", ""),
            "urgency": row.get("urgency", ""),
            "feedback_type": row.get("feedback_type", ""),
            "action": row.get("action_recommended", ""),
            "details": "High urgency complaint, escalate immediately.",
            "timestamp": now.isoformat()
        })

    # 2. Strong negative sentiment with high confidence (even if not flagged high urgency)
    cond2 = (
        (df["sentiment"].str.lower() == "negative") &
        (df["confidence"].astype(float) >= NEGATIVE_CONFIDENCE_THRESHOLD)
    )
    for _, row in df[cond2 & ~cond1].iterrows():
        alerts.append({
            "alert_type": "strong_negative",
            "email_id": row.get("email_id", ""),
            "platform": row.get("platform", ""),
            "sender": row.get("sender", ""),
            "product": row.get("product", ""),
            "sentiment": row.get("sentiment", ""),
            "confidence": row.get("confidence", ""),
            "urgency": row.get("urgency", ""),
            "feedback_type": row.get("feedback_type", ""),
            "action": row.get("action_recommended", ""),
            "details": "Negative sentiment with high confidence.",
            "timestamp": now.isoformat()
        })

    # 3. Spike in complaints for a product in the last window
    recent = df[df["parsed_date"] >= window_start]
    if not recent.empty:
        complaint_recent = recent[recent["feedback_type"] == "complaint"]
        if not complaint_recent.empty and "product" in complaint_recent.columns:
            # Count per product in last window
            recent_counts = complaint_recent["product"].value_counts()
            # Baseline: average complaints per product over full history (excluding last window)
            past = df[df["parsed_date"] < window_start]
            if not past.empty:
                past_complaints = past[past["feedback_type"] == "complaint"]
                baseline = past_complaints["product"].value_counts()
                for product, recent_count in recent_counts.items():
                    base = baseline.get(product, 0.1)  # avoid zero
                    if recent_count >= SPIKE_MULTIPLIER * base:
                        alerts.append({
                            "alert_type": "complaint_spike",
                            "product": product,
                            "recent_count": recent_count,
                            "baseline": base,
                            "details": f"Spike in complaints for {product}: {recent_count} vs baseline {base:.1f}",
                            "timestamp": now.isoformat()
                        })

    return pd.DataFrame(alerts)

def save_alerts(alerts_df):
    if alerts_df.empty:
        print("ℹ️ No alerts generated.")
        return
    os.makedirs(os.path.dirname(ALERT_OUTPUT), exist_ok=True)
    # Append if existing, dedupe
    if os.path.exists(ALERT_OUTPUT):
        existing = pd.read_csv(ALERT_OUTPUT)
        combined = pd.concat([existing, alerts_df], ignore_index=True)
        combined = combined.drop_duplicates(subset=["alert_type", "email_id", "product", "timestamp"])
        combined.to_csv(ALERT_OUTPUT, index=False)
    else:
        alerts_df.to_csv(ALERT_OUTPUT, index=False)
    print(f"🚨 Alerts saved to: {ALERT_OUTPUT}")

def main():
    df = load_feedback()
    if df.empty:
        return
    alerts_df = detect_high_risk(df)
    save_alerts(alerts_df)

if __name__ == "__main__":
    main()
