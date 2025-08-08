# scripts/test_email_clean_and_store.py

import pandas as pd
from src.preprocessing.email_cleaner import clean_email_body

# Simulated raw email data (normally fetched via IMAP)
sample_emails = [
    {
        "sender": "client1@example.com",
        "subject": "Issue with Login",
        "body": """
        <html>
        <body>
            Hello Team,<br><br>
            I’m unable to log into my dashboard since yesterday.<br>
            Please look into this urgently.<br><br>
            Thanks,<br>
            John Doe
        </body>
        </html>

        On Mon, Jul 28, someone@example.com wrote:
        > Can you please explain the issue...
        """
    },
    {
        "sender": "client2@example.com",
        "subject": "Feedback on Service",
        "body": """
        Hi,<br><br>
        Just wanted to say the service was great! Appreciate the support.<br><br>
        Regards,<br>
        Jane

        Sent from my iPhone
        """
    }
]

# Clean emails and prepare data
cleaned_data = []

for email in sample_emails:
    cleaned_body = clean_email_body(email["body"])
    cleaned_data.append({
        "sender": email["sender"],
        "subject": email["subject"],
        "cleaned_body": cleaned_body
    })

# Convert to DataFrame and save as CSV
df = pd.DataFrame(cleaned_data)
df.to_csv("outputs/cleaned_emails.csv", index=False)

print("✅ Cleaned emails saved to 'outputs/cleaned_emails.csv'")
