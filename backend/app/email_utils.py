import smtplib
import ssl
from email.message import EmailMessage
import os

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465  # SSL

# Read from env, fallback to provided defaults (for local dev convenience)
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "premkollepara@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "vnlcqwfzezddsgxd")
FACULTY_EMAIL = os.getenv("FACULTY_EMAIL", "premkollepara+faculty@gmail.com")

def _send_email(to_email: str, subject: str, body: str):
    """
    Generic email sender using Gmail SMTP.
    """
    print("DEBUG: _send_email called")
    print("DEBUG: to_email =", to_email)
    print("DEBUG: subject =", subject)
    print("DEBUG: SMTP_EMAIL =", repr(SMTP_EMAIL))

    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("DEBUG: SMTP not configured, skipping email.")
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email
    msg.set_content(body)

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            print("DEBUG: Connecting to SMTP server")
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            print("DEBUG: SMTP login success")
            server.send_message(msg)
        print(f"DEBUG: Email sent to {to_email} with subject: {subject}")
    except Exception as e:
        print("ERROR: Failed to send email:", repr(e))


def send_leave_notification(
    student_name: str,
    class_name: str | None,
    start_date: str,
    end_date: str,
    reason: str,
    auto_type: str,
):
    subject = f"New Leave Request from {student_name} ({class_name or 'Unknown Class'})"
    body = (
        f"Dear Faculty,\n\n"
        f"A new leave request has been submitted.\n\n"
        f"Student: {student_name}\n"
        f"Class: {class_name or 'N/A'}\n"
        f"Dates: {start_date} to {end_date}\n"
        f"AI Type: {auto_type}\n"
        f"Reason: {reason}\n\n"
        f"Please review this request in the Smart Academic Leave Manager portal.\n\n"
        f"Regards,\n"
        f"SRKR Leave Manager System"
    )
    _send_email(FACULTY_EMAIL, subject, body)


def send_leave_status_notification(
    student_name: str,
    recipient_email: str,
    start_date: str,
    end_date: str,
    status: str,  # "APPROVED" or "REJECTED"
    reason: str | None = None,
):
    action_text = "APPROVED" if status == "APPROVED" else "REJECTED"
    subject = f"Leave Request {action_text}: {start_date} to {end_date}"

    body = (
        f"Dear {student_name},\n\n"
        f"Your leave request from {start_date} to {end_date} has been {action_text}.\n\n"
    )

    if reason:
        body += f"Message from Faculty:\n{reason}\n\n"

    body += (
        "You can view the details in your student portal.\n\n"
        "Regards,\n"
        "SRKR Leave Manager System"
    )

    _send_email(recipient_email, subject, body)
