# src/preprocessing/email_cleaner.py

import re
from bs4 import BeautifulSoup

SIGNATURE_PHRASES = [
    "thanks", "regards", "sincerely", "cheers", "best", "sent from my", "--"
]

REPLY_PATTERNS = [
    r"On.*wrote:",
    r"From:.*",
    r"Sent:.*",
    r"To:.*",
    r"Cc:.*",
    r"Subject:.*"
]

def strip_html(text):
    """Remove HTML tags using BeautifulSoup."""
    soup = BeautifulSoup(text, "html.parser")
    return soup.get_text()

def remove_quoted_replies(text):
    """Remove quoted replies (like 'On ... wrote:')"""
    for pattern in REPLY_PATTERNS:
        text = re.split(pattern, text, flags=re.IGNORECASE)[0]
    return text

def remove_signature(text):
    """Try to detect and remove signatures."""
    lines = text.split("\n")
    clean_lines = []
    for line in lines:
        if any(sig in line.lower() for sig in SIGNATURE_PHRASES):
            break
        clean_lines.append(line)
    return "\n".join(clean_lines)

def normalize_text(text):
    """Lowercase, remove URLs, punctuations, special chars, extra spaces."""
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", "", text)  # remove URLs
    text = re.sub(r"[^a-z0-9\s]", " ", text)  # remove special chars
    text = re.sub(r"\s+", " ", text)  # normalize whitespace
    return text.strip()

def clean_email_body(raw_body):
    """Full pipeline: clean and normalize email body."""
    text = strip_html(raw_body)
    text = remove_quoted_replies(text)
    text = remove_signature(text)
    text = normalize_text(text)
    return text
