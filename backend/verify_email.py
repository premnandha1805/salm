import smtplib
import ssl
from email.message import EmailMessage

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SMTP_EMAIL = "premkollepara@gmail.com"
SMTP_PASSWORD = "vnlc qwfz ezdd sgxd"
FACULTY_EMAIL = "premkollepara@gmail.com"

def verify_email():
    msg = EmailMessage()
    msg["Subject"] = "Test Email from SALM Debugger"
    msg["From"] = SMTP_EMAIL
    msg["To"] = FACULTY_EMAIL
    msg.set_content("This is a test email to verify credentials.")

    context = ssl.create_default_context()
    try:
        print(f"Connecting to {SMTP_SERVER}...")
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            print("Logging in...")
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            print("Sending message...")
            server.send_message(msg)
        print("Email sent successfully!")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    verify_email()
