# src/ingestion/email_ingestion.py
import imaplib
import email
from email.header import decode_header

def connect_email(username, password, imap_server="imap.gmail.com"):
    mail = imaplib.IMAP4_SSL(imap_server)
    mail.login(username, password)
    mail.select("inbox")
    return mail

def fetch_emails(mail, n=10):
    status, messages = mail.search(None, "ALL")
    email_ids = messages[0].split()[-n:]
    emails = []

    for eid in email_ids:
        res, msg_data = mail.fetch(eid, "(RFC822)")
        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)

        subject, _ = decode_header(msg["Subject"])[0]
        if isinstance(subject, bytes):
            subject = subject.decode(errors="ignore")

        sender = msg.get("From")

        # Get email body
        body = ""
        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                if content_type == "text/plain":
                    body = part.get_payload(decode=True).decode(errors="ignore")
                    break
        else:
            body = msg.get_payload(decode=True).decode(errors="ignore")

        emails.append({
            "subject": subject,
            "from": sender,
            "body": body.strip()
        })
    return emails

def ingest_emails():
    # Use app password if Gmail 2FA is enabled
    username = input("Enter your email: ")
    password = input("Enter your app password: ")  # Secure if done via getpass
    mail = connect_email(username, password)
    emails = fetch_emails(mail, n=10)

    for i, email_data in enumerate(emails, 1):
        print(f"\nEmail {i}:")
        print("From:", email_data["from"])
        print("Subject:", email_data["subject"])
        print("Body Preview:", email_data["body"][:200])  # First 200 chars

if __name__ == "__main__":
    ingest_emails()
