# src/analysis/tagging_engine.py
import os
import pandas as pd
import re
from datetime import datetime

# --- Configuration / heuristics ---

PRODUCT_KEYWORDS = {
    "product_x": ["product x", "x model", "x feature"],
    "product_y": ["product y", "y edition", "y update"],
    "checkout": ["checkout", "payment", "billing", "invoice", "refund"],
    "mobile_app": ["app", "mobile", "crash", "slow app", "lag"],
}

FEEDBACK_TYPE_KEYWORDS = {
    "complaint": [
        r"\b(issue|problem|not working|fail|error|wrong|broken|delayed|late|hate|bad|doesn't work|cannot|unable)\b"
    ],
    "suggestion": [
        r"\b(suggestion|would be great if|please add|could you|improve|feature request|should have|wish)\b"
    ],
    "praise": [
        r"\b(love|great|excellent|awesome|fantastic|thank you|amazing|happy|satisfied|good job)\b"
    ],
}

HIGH_URGENCY_WORDS = ["immediately", "urgent", "asap", "right now", "critical", "outage", "down"]
MEDIUM_URGENCY_WORDS = ["soon", "priority", "important", "attention", "warning"]
LOW_URGENCY_WORDS = ["whenever", "later", "no rush"]

def classify_feedback_type(text):
    text_lower = text.lower()
    for ftype, patterns in FEEDBACK_TYPE_KEYWORDS.items():
        for pat in patterns:
            if re.search(pat, text_lower):
                return ftype
    return "neutral"

def score_urgency(text, sentiment, confidence):
    text_lower = text.lower()
    score = 0
    if sentiment == "negative" and confidence >= 0.6:
        score += 2
    elif sentiment == "negative":
        score += 1

    for w in HIGH_URGENCY_WORDS:
        if w in text_lower:
            score += 3
    for w in MEDIUM_URGENCY_WORDS:
        if w in text_lower:
            score += 1
    for w in LOW_URGENCY_WORDS:
        if w in text_lower:
            score -= 1

    if score >= 3:
        return "high"
    elif score >= 1:
        return "medium"
    elif score <= 0:
        return "low"
    else:
        return "medium"

def associate_product(text):
    text_lower = text.lower()
    for product, keywords in PRODUCT_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                return product
    return "unknown"

def route_department(feedback_type, product, text):
    text_lower = text.lower()
    if product in ("checkout",) or re.search(r"\b(bill|payment|invoice|refund)\b", text_lower):
        return "finance"
    if feedback_type == "suggestion":
        return "product"
    if feedback_type == "complaint":
        if any(word in text_lower for word in ["crash", "error", "bug", "not working", "fail", "slow"]):
            return "engineering"
        return "support"
    if feedback_type == "praise":
        return "customer_success"
    return "general"

def recommend_action(feedback_type, urgency, department):
    if feedback_type == "complaint" and urgency == "high":
        return "escalate"
    if feedback_type == "complaint" and urgency in ("medium", "low"):
        return "acknowledge"
    if feedback_type == "suggestion":
        return "log for roadmap"
    if feedback_type == "praise":
        return "thank and share"
    return "review"

def enrich_feedback(input_path="data/analyzed/feedback_results.csv",
                    output_path="data/analyzed/feedback_enriched.csv"):
    if not os.path.exists(input_path):
        print(f"❌ Input file not found: {input_path}")
        return

    df = pd.read_csv(input_path)

    if "cleaned_body" not in df.columns:
        df["cleaned_body"] = ""

    # Normalize and lower-case relevant fields
    df["sentiment"] = df.get("sentiment", "").astype(str).str.lower()
    df["platform"] = df.get("platform", "").astype(str).str.lower()

    enriched_rows = []
    for _, row in df.iterrows():
        text = str(row.get("cleaned_body", "") or "")
        sentiment = str(row.get("sentiment", "")).lower()
        try:
            confidence = float(row.get("confidence", 0.0))
        except Exception:
            confidence = 0.0

        feedback_type = classify_feedback_type(text)
        urgency = score_urgency(text, sentiment, confidence)
        product = associate_product(text)
        department = route_department(feedback_type, product, text)
        action = recommend_action(feedback_type, urgency, department)

        enriched = row.to_dict()
        enriched.update({
            "feedback_type": feedback_type,
            "urgency": urgency,
            "product": product,
            "department": department,
            "action_recommended": action
        })
        enriched_rows.append(enriched)

    enriched_df = pd.DataFrame(enriched_rows)

    # Round confidence to avoid overly precise floats
    if "confidence" in enriched_df.columns:
        enriched_df["confidence"] = pd.to_numeric(enriched_df["confidence"], errors="coerce").round(3)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    enriched_df.to_csv(output_path, index=False)
    print(f"✅ Enriched feedback saved to: {output_path}")

if __name__ == "__main__":
    enrich_feedback()
