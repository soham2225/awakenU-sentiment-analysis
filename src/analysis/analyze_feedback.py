# src/analysis/analyze_feedback.py
import sys
import os
import pandas as pd
from datetime import datetime
from src.analysis.sentiment_model import SentimentAnalyzer
import matplotlib.pyplot as plt
import seaborn as sns
import hashlib

# Ensure project root in path if run as script
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

def load_data():
    email_path = 'outputs/cleaned_emails.csv'
    reddit_path = 'outputs/cleaned_reddit.csv'
    twitter_path = 'data/analyzed/twitter_clean.csv'

    def safe_load(path, name):
        if not os.path.exists(path):
            print(f"⚠️ {name} file not found at {path}")
            return pd.DataFrame()
        return pd.read_csv(path)

    return (
        safe_load(email_path, "Email"),
        safe_load(reddit_path, "Reddit"),
        safe_load(twitter_path, "Twitter"),
    )

def analyze_and_save():
    email_df, reddit_df, twitter_df = load_data()
    print("📦 Loaded Email rows:", len(email_df))
    print("📦 Loaded Reddit rows:", len(reddit_df))
    print("📦 Loaded Twitter rows:", len(twitter_df))

    model = SentimentAnalyzer(model_type='bert')  # or 'lightweight'

    combined = []
    counter = 0  # fallback id counter

    for df, platform in [(email_df, 'email'), (reddit_df, 'reddit'), (twitter_df, 'twitter')]:
        if df.empty:
            print(f"⚠️ Skipping empty dataset for {platform}")
            continue

        # Normalize text column
        if platform == "twitter":
            df['cleaned_body'] = df.get('clean_text', df.get('text', "")).astype(str).fillna("")
        else:
            df['cleaned_body'] = df.get('cleaned_body', "").astype(str).fillna("")

        texts = df['cleaned_body'].tolist()

        # Handle truncation detection (for BERT model)
        truncated_flags = []
        if model.model_type == 'bert':
            tokenizer = model.pipe.tokenizer
            maxlen = getattr(tokenizer, "model_max_length", 512)
            for i, text in enumerate(texts):
                tokens = tokenizer.encode(text, add_special_tokens=True)
                truncated_flags.append(len(tokens) > maxlen)
                if len(tokens) > maxlen:
                    print(f"⚠️ Text #{i} on {platform} exceeds {maxlen} tokens ({len(tokens)}) → will be truncated.")
        else:
            truncated_flags = [False] * len(texts)

        predictions = model.predict(texts)

        for i, row in df.iterrows():
            pred = predictions[i] if i < len(predictions) else {"sentiment": "", "confidence": 0.0}

            # Unique ID generation
            if platform == "twitter" and "id" in row:
                record_id = row["id"]
            elif platform == "email" and "email_id" in row and pd.notna(row["email_id"]):
                record_id = row["email_id"]
            else:
                base = f"{platform}-{row.to_dict()}-{counter}"
                record_id = hashlib.sha1(base.encode()).hexdigest()[:12]
                counter += 1

            confidence_raw = pred.get('confidence', 0.0) or 0.0
            try:
                confidence_val = round(float(confidence_raw), 3)
            except Exception:
                confidence_val = 0.0

            combined.append({
                'id': record_id,
                'platform': platform,
                'sender': row.get('sender', '') if platform == 'email' else '',
                'subject': row.get('subject', '') if platform == 'email' else '',
                'username': row.get('username', '') if platform == 'twitter' else '',
                'cleaned_body': row.get('cleaned_body', ''),
                'sentiment': pred.get('sentiment', '').lower(),
                'confidence': confidence_val,
                'date': row.get('date', row.get('created_at', str(datetime.now()))),
                'tag': row.get('tag', None),
                'was_truncated': truncated_flags[i] if i < len(truncated_flags) else False
            })

    if not combined:
        print("⚠️ No predictions to save.")
        return

    result_df = pd.DataFrame(combined)
    os.makedirs("data/analyzed", exist_ok=True)
    result_df.to_csv("data/analyzed/feedback_results.csv", index=False)
    print("✅ Sentiment analysis saved to: data/analyzed/feedback_results.csv")

    plot_sentiment_distribution(result_df)

def plot_sentiment_distribution(df):
    sns.set(style="whitegrid")

    # Bar plot
    plt.figure(figsize=(10, 5))
    sns.countplot(data=df, x='sentiment', hue='platform')
    plt.title("Sentiment Distribution by Platform")
    plt.savefig("data/analyzed/sentiment_distribution.png")
    print("📊 Saved: data/analyzed/sentiment_distribution.png")
    plt.close()

    # Pie chart
    plt.figure(figsize=(6, 4))
    df['sentiment'].value_counts().plot.pie(autopct='%1.1f%%', startangle=90)
    plt.title("Overall Sentiment Share")
    plt.ylabel('')
    plt.savefig("data/analyzed/overall_sentiment_pie.png")
    print("🥧 Saved: data/analyzed/overall_sentiment_pie.png")
    plt.close()

if __name__ == "__main__":
    analyze_and_save()
