import pandas as pd
import re
import os

def clean_text(text):
    text = re.sub(r"http\S+", "", text)  # Remove URLs
    text = re.sub(r"@\w+", "", text)     # Remove mentions
    text = re.sub(r"#\w+", "", text)     # Remove hashtags
    text = re.sub(r"\s+", " ", text)     # Normalize spaces
    return text.strip()

if __name__ == "__main__":
    raw_file = "data/raw/twitter_raw.csv"
    clean_file = "data/analyzed/twitter_clean.csv"
    
    if not os.path.exists(raw_file):
        raise FileNotFoundError(f"{raw_file} not found. Run twitter_ingestion.py first.")
    
    df = pd.read_csv(raw_file)
    df["clean_text"] = df["text"].astype(str).apply(clean_text)
    
    # Keep author_id + username for analysis
    columns_to_keep = ["id", "author_id", "username", "created_at", "text", "clean_text", "edit_history_tweet_ids"]
    df = df[[c for c in columns_to_keep if c in df.columns]]
    
    os.makedirs("data/analyzed", exist_ok=True)
    df.to_csv(clean_file, index=False)
    
    print(f"[INFO] Cleaned data saved to {clean_file}")
