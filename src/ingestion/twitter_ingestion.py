import requests
import pandas as pd
import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()
BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
USERNAME = "sohamget22"

BASE_URL = "https://api.twitter.com/2"
collected_data = []  # store all tweets here

def auth_headers():
    return {"Authorization": f"Bearer {BEARER_TOKEN}"}

def safe_request(url, params=None):
    """Handles requests with automatic rate-limit retries but saves partial data first."""
    while True:
        r = requests.get(url, headers=auth_headers(), params=params)

        if r.status_code == 429:  # Rate limit hit
            reset_time = int(r.headers.get("x-rate-limit-reset", 60))
            wait_seconds = max(reset_time - int(time.time()), 60)
            print(f"[RATE LIMIT] Saving progress and sleeping for {wait_seconds} seconds...")
            save_to_csv()
            time.sleep(wait_seconds)
            continue

        r.raise_for_status()
        return r.json()

def get_user_id(username):
    url = f"{BASE_URL}/users/by/username/{username}"
    return safe_request(url)["data"]["id"]

def get_mentions(user_id):
    url = f"{BASE_URL}/users/{user_id}/mentions"
    params = {
        "max_results": 100,
        "tweet.fields": "created_at,author_id,text,edit_history_tweet_ids",
        "expansions": "author_id",
        "user.fields": "username"
    }
    resp = safe_request(url, params)
    return merge_tweets_with_users(resp)

def get_user_tweets(user_id):
    url = f"{BASE_URL}/users/{user_id}/tweets"
    params = {
        "max_results": 50,
        "tweet.fields": "created_at,author_id,text,edit_history_tweet_ids",
        "expansions": "author_id",
        "user.fields": "username"
    }
    resp = safe_request(url, params)
    return merge_tweets_with_users(resp)

def get_replies(tweet_id):
    query = f"conversation_id:{tweet_id}"
    url = f"{BASE_URL}/tweets/search/recent"
    params = {
        "query": query,
        "max_results": 100,
        "tweet.fields": "created_at,author_id,text,edit_history_tweet_ids",
        "expansions": "author_id",
        "user.fields": "username"
    }
    resp = safe_request(url, params)
    return merge_tweets_with_users(resp)

def merge_tweets_with_users(resp):
    """Merge tweet data with usernames from 'includes'."""
    tweets = resp.get("data", [])
    users = {u["id"]: u.get("username", "") for u in resp.get("includes", {}).get("users", [])}
    for t in tweets:
        t["username"] = users.get(t["author_id"], "")
    return tweets

def save_to_csv():
    """Saves collected data so far to CSV."""
    if collected_data:
        df = pd.DataFrame(collected_data).drop_duplicates(subset=["id"])
        os.makedirs("data/raw", exist_ok=True)
        df.to_csv("data/raw/twitter_raw.csv", index=False)
        print(f"[INFO] Progress saved: {len(df)} tweets in data/raw/twitter_raw.csv")

if __name__ == "__main__":
    print("[INFO] Starting Twitter ingestion...")
    collected_data.clear()

    user_id = get_user_id(USERNAME)
    print(f"[INFO] Found user_id: {user_id}")

    # 1. Mentions
    mentions = get_mentions(user_id)
    collected_data.extend(mentions)
    print(f"[INFO] Fetched {len(mentions)} mentions")

    # 2. Tweets
    tweets = get_user_tweets(user_id)
    collected_data.extend(tweets)
    print(f"[INFO] Fetched {len(tweets)} tweets")

    # 3. Replies for each tweet
    for t in tweets:
        print(f"[INFO] Fetching replies for tweet {t['id']}...")
        replies = get_replies(t["id"])
        collected_data.extend(replies)
        time.sleep(1)  # avoid hitting rate limit instantly

    save_to_csv()
    print("[INFO] Ingestion complete.")
