import imaplib
import email
from email.header import decode_header
import getpass
import os
import sys
import pandas as pd
import argparse

# Add project root so imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from src.preprocessing.email_cleaner import clean_email_body

def connect_to_email(email_user, email_pass):
    try:
        imap = imaplib.IMAP4_SSL("imap.gmail.com")
        imap.login(email_user, email_pass)
        print("✅ Login successful.")
        return imap
    except imaplib.IMAP4.error:
        print("❌ Login failed. Check your email or app password.")
        return None

def fetch_emails(imap, max_count=50):
    imap.select("inbox")
    result, data = imap.search(None, "ALL")
    if result != "OK":
        print("❌ Failed to fetch emails.")
        return []

    email_ids = data[0].split()[-max_count:]
    emails = []

    for num in reversed(email_ids):
        result, msg_data = imap.fetch(num, "(RFC822)")
        if result != "OK":
            continue

        msg = email.message_from_bytes(msg_data[0][1])
        subject, encoding = decode_header(msg.get("Subject", ""))[0]
        if isinstance(subject, bytes):
            subject = subject.decode(encoding or "utf-8", errors="ignore")

        sender = msg.get("From", "")

        body = ""
        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                content_dispo = str(part.get("Content-Disposition", ""))

                if content_type == "text/plain" and "attachment" not in content_dispo:
                    body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                    break
                elif content_type == "text/html":
                    body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                    break
        else:
            body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")

        cleaned_body = clean_email_body(body)
        emails.append({
            "sender": sender,
            "subject": subject,
            "cleaned_body": cleaned_body
        })
        print(f"✅ Processed: {subject}")

    return emails

def merge_and_save(new_emails, path="outputs/cleaned_emails.csv"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    new_df = pd.DataFrame(new_emails)

    if os.path.exists(path):
        existing = pd.read_csv(path)
        combined = pd.concat([existing, new_df], ignore_index=True)
        before = len(combined)
        combined = combined.drop_duplicates(subset=["sender", "subject", "cleaned_body"])
        after = len(combined)
        added = after - len(existing)
        print(f"🗂 Existing: {len(existing)}, New unique added: {added}, Total: {after}")
    else:
        combined = new_df
        print(f"🗂 No existing file; saved {len(new_df)} entries.")

    combined.to_csv(path, index=False)
    print(f"\n📁 Saved cleaned emails to {path}")

def main():
    parser = argparse.ArgumentParser(description="Fetch & clean emails")
    parser.add_argument("--n", type=int, default=50, help="Number of recent emails to fetch")
    args = parser.parse_args()

    print("🔐 Enter Gmail credentials to fetch emails.")
    email_user = input("Enter your email: ")
    email_pass = getpass.getpass("Enter your app password: ")

    imap = connect_to_email(email_user, email_pass)
    if not imap:
        return

    emails = fetch_emails(imap, max_count=args.n)
    if emails:
        merge_and_save(emails)
    else:
        print("⚠️ No emails cleaned.")

    imap.logout()

if __name__ == "__main__":
    main()
