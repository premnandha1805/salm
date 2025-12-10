from datetime import date

def classify_reason(reason: str) -> str:
    """
    Very simple rule-based classifier.
    Looks for keywords and returns one of:
    MEDICAL / PERSONAL / ACADEMIC / OTHER
    """
    text = (reason or "").lower()

    medical_keywords = [
        "fever", "doctor", "sick", "ill", "illness", "hospital",
        "headache", "cold", "covid", "infection"
    ]

    personal_keywords = [
        "marriage", "function", "festival", "personal", "family",
        "ceremony", "travel", "out of station", "hometown"
    ]

    academic_keywords = [
        "seminar", "project", "internship", "exam", "examination",
        "lab", "viva", "workshop", "presentation",
        "hackathon", "hackthon", "coding contest", "coding competition",
        "technical fest", "tech fest"
    ]

    if any(k in text for k in medical_keywords):
        return "MEDICAL"

    if any(k in text for k in personal_keywords):
        return "PERSONAL"

    if any(k in text for k in academic_keywords):
        return "ACADEMIC"

    return "OTHER"

def date_range_days(start: date, end: date) -> int:
    """Return number of days between two dates (inclusive)."""
    return (end - start).days + 1
