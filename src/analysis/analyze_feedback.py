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

    if not os.path.exists(email_path):
        print(f"❌ Email file not found at {email_path}")
        email_df = pd.DataFrame()
    else:
        email_df = pd.read_csv(email_path)

    if not os.path.exists(reddit_path):
        print(f"⚠️ Reddit file not found at {reddit_path}")
        reddit_df = pd.DataFrame()
    else:
        reddit_df = pd.read_csv(reddit_path)

    return email_df, reddit_df

def analyze_and_save():
    email_df, reddit_df = load_data()
    print("📦 Loaded Email rows:", len(email_df))
    print("📦 Loaded Reddit rows:", len(reddit_df))

    model = SentimentAnalyzer(model_type='bert')  # or 'lightweight'

    combined = []
    counter = 0  # for fallback id uniqueness

    for df, platform in [(email_df, 'email'), (reddit_df, 'reddit')]:
        if df.empty:
            print(f"⚠️ Skipping empty dataset for {platform}")
            continue

        # Normalize expected text column
        df['cleaned_body'] = df.get('cleaned_body', "").astype(str).fillna("")

        texts = df['cleaned_body'].tolist()

        # Truncation detection
        truncated_flags = []
        if model.model_type == 'bert':
            # Access tokenizer and max_length from the pipeline internals
            tokenizer = model.pipe.tokenizer
            maxlen = model.pipe.tokenizer.model_max_length if hasattr(model.pipe.tokenizer, "model_max_length") else 512
            for i, text in enumerate(texts):
                tokens = tokenizer.encode(text, add_special_tokens=True)
                if len(tokens) > maxlen:
                    print(f"⚠️ Text #{i} for platform {platform} exceeds {maxlen} tokens (actual {len(tokens)}); it will be truncated by pipeline.") 
                    truncated_flags.append(True)
                else:
                    truncated_flags.append(False)
        else:
            truncated_flags = [False] * len(texts)

        predictions = model.predict(texts)

        for i, row in df.iterrows():
            pred = predictions[i] if i < len(predictions) else {"sentiment": "", "confidence": 0.0}

            # Build/fallback email_id
            if 'email_id' in row and pd.notna(row.get('email_id', None)) and row.get('email_id'):
                email_id_val = row['email_id']
            else:
                base = f"{row.get('sender','')}-{row.get('subject','')}-{row.get('date', '')}-{counter}"
                email_id_val = hashlib.sha1(base.encode()).hexdigest()[:12]
                counter += 1

            confidence_raw = pred.get('confidence', 0.0) or 0.0
            try:
                confidence_val = round(float(confidence_raw), 3)
            except Exception:
                confidence_val = 0.0

            combined.append({
                'email_id': email_id_val,
                'platform': platform,
                'sender': row.get('sender', ''),
                'subject': row.get('subject', ''),
                'cleaned_body': row.get('cleaned_body', ''),
                'sentiment': pred.get('sentiment', '').lower(),
                'confidence': confidence_val,
                'date': row.get('date', str(datetime.now())),
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

    # Bar plot by sentiment and platform
    plt.figure(figsize=(10, 5))
    sns.countplot(data=df, x='sentiment', hue='platform')
    plt.title("Sentiment Distribution by Platform")
    plt.savefig("data/analyzed/sentiment_distribution.png")
    print("📊 Saved: data/analyzed/sentiment_distribution.png")
    plt.close()

    # Overall sentiment share pie chart
    plt.figure(figsize=(6, 4))
    df['sentiment'].value_counts().plot.pie(autopct='%1.1f%%', startangle=90)
    plt.title("Overall Sentiment Share")
    plt.ylabel('')
    plt.savefig("data/analyzed/overall_sentiment_pie.png")
    print("🥧 Saved: data/analyzed/overall_sentiment_pie.png")
    plt.close()

if __name__ == "__main__":
    analyze_and_save()
