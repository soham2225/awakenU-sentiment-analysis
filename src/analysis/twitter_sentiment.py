import re
import pandas as pd
from textblob import TextBlob

# ---------- Text Cleaning ----------
def clean_tweet(text: str) -> str:
    text = re.sub(r'http\S+', '', text)  # remove urls
    text = re.sub(r'@\w+', '', text)     # remove mentions
    text = re.sub(r'#', '', text)        # remove hashtag symbol
    text = re.sub(r'[^A-Za-z0-9\s]+', '', text)  # remove special chars
    return text.strip()

# ---------- Sentiment Analysis ----------
def get_sentiment(text: str) -> str:
    analysis = TextBlob(text)
    if analysis.sentiment.polarity > 0.1:
        return "Positive"
    elif analysis.sentiment.polarity < -0.1:
        return "Negative"
    else:
        return "Neutral"

# ---------- Main Function ----------
def analyze_tweets(input_file: str, output_file: str):
    print("[INFO] Loading tweets from:", input_file)
    df = pd.read_csv(input_file)

    # Use 'clean_text' if exists, else fallback to 'text'
    if 'clean_text' in df.columns:
        df['cleaned_tweet'] = df['clean_text'].astype(str)
    elif 'text' in df.columns:
        df['cleaned_tweet'] = df['text'].astype(str).apply(clean_tweet)
    else:
        raise ValueError("CSV must have a 'text' or 'clean_text' column")

    # Run sentiment analysis
    df['sentiment'] = df['cleaned_tweet'].apply(get_sentiment)

    # Save results
    df.to_csv(output_file, index=False)
    print(f"[INFO] Sentiment analysis complete. Results saved to {output_file}")


if __name__ == "__main__":
    input_csv = "data/analyzed/twitter_clean.csv"   # <-- matches your pipeline
    output_csv = "data/analyzed/twitter_sentiment.csv"
    analyze_tweets(input_csv, output_csv)
