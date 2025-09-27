import os
import pandas as pd
import subprocess
from pathlib import Path

CLEANED_PATH = Path("outputs/cleaned_emails.csv")
TEMP_PATH = Path("outputs/cleaned_emails_temp.csv")
MERGED_PATH = CLEANED_PATH  # overwrite cleaned_emails.csv
ANALYSIS_CMD = ["python", "-m", "src.analysis.analyze_feedback"]

def merge_and_dedupe():
    if not CLEANED_PATH.exists():
        print(f"❌ {CLEANED_PATH} does not exist. Run fetch_and_clean_emails.py first.")
        return False

    # If there's no previous merged file, just copy temp to main (assume temp is new fetch)
    if not MERGED_PATH.exists():
        print("No existing cleaned file; using current cleaned_emails.csv as base.")
        base_df = pd.read_csv(CLEANED_PATH)
    else:
        base_df = pd.read_csv(MERGED_PATH)

    # Read current cleaned (fresh fetch) as new batch
    new_df = pd.read_csv(CLEANED_PATH)

    # Combine and dedupe based on sender+subject+cleaned_body (or email_id if present)
    if "email_id" in new_df.columns:
        combined = pd.concat([base_df, new_df], ignore_index=True)
        before = len(combined)
        combined = combined.drop_duplicates(subset=["email_id"])
        after = len(combined)
    else:
        combined = pd.concat([base_df, new_df], ignore_index=True)
        before = len(combined)
        combined = combined.drop_duplicates(subset=["sender", "subject", "cleaned_body"])
        after = len(combined)

    added = after - len(base_df) if MERGED_PATH.exists() else after
    print(f"🗂 Existing rows: {len(base_df)}")
    print(f"🆕 New unique added: {added}")
    print(f"🔁 Total after merge: {after}")

    # Save merged back
    combined.to_csv(MERGED_PATH, index=False)
    return True

def run_analysis():
    print("🚀 Running sentiment analysis...")
    result = subprocess.run(ANALYSIS_CMD, capture_output=False)
    if result.returncode != 0:
        print("❌ Sentiment analysis failed.")
    else:
        print("✅ Sentiment analysis completed.")

def main():
    # Assumes fetch_and_clean_emails.py has already updated outputs/cleaned_emails.csv
    ok = merge_and_dedupe()
    if not ok:
        return
    run_analysis()

if __name__ == "__main__":
    main()
