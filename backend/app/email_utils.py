import smtplib
import ssl
from email.message import EmailMessage
import os

# TODO: In a real production app, use environment variables for secrets.
# For now, we use the provided credentials or defaults/placeholders.
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465  # SSL
SMTP_EMAIL = "premkollepara@gmail.com"   
# NOTE: The user provided a specific app password in their snippet. 
# We should use it or a placeholder if I don't have it. 
# Based on previous context, the user provided: "vnlc qwfz ezdd sgxd"
SMTP_PASSWORD = "vnlc qwfz ezdd sgxd"

FACULTY_EMAIL = "premkollepara@gmail.com"

def send_leave_notification(
    student_name: str,
    class_name: str | None,
    start_date: str,
    end_date: str,
    reason: str,
    auto_type: str,
):
    """
    Sends a simple email to faculty when a new leave is applied.
    This is called as a background task from FastAPI.
    """
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

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL
    msg["To"] = FACULTY_EMAIL
    msg.set_content(body)

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"Email sent successfully to {FACULTY_EMAIL}")
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_leave_status_notification(
    student_name: str,
    start_date: str,
    end_date: str,
    status: str,  # "APPROVED" or "REJECTED"
    reason: str | None = None,
):
    """
    Sends an email to the student (using the demo email address for now)
    notifying them of the leave status update (Approved/Rejected) and the optional reason.
    """
    # DEMO PURPOSE: Sending to the same configured email (FACULTY_EMAIL) as per user request
    # In a real app, this would be `student_email` passed as an argument.
    recipient_email = FACULTY_EMAIL

    action_text = "APPROVED" if status == "APPROVED" else "REJECTED"
    subject = f"Leave Request {action_text}: {start_date} to {end_date}"

    # Build the email body
    body = (
        f"Dear {student_name},\n\n"
        f"Your leave request from {start_date} to {end_date} has been {action_text}.\n\n"
    )

    if reason:
        body += f"Message from Faculty:\n{reason}\n\n"

    body += (
        f"You can view the details in your student portal.\n\n"
        f"Regards,\n"
        f"SRKR Leave Manager System"
    )

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL
    msg["To"] = recipient_email
    msg.set_content(body)

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"Status update email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send status email: {e}")
