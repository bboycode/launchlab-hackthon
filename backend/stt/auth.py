import re
from werkzeug.security import generate_password_hash

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number format (basic validation)"""
    if not phone:
        return True  # Phone is optional
    # Remove spaces, dashes, and parentheses
    cleaned_phone = re.sub(r'[\s\-\(\)]', '', phone)
    # Check if it contains only digits and optional + at the start
    return re.match(r'^\+?\d{10,15}$', cleaned_phone) is not None
