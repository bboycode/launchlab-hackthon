from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash
from supabase import create_client, Client
import os
from datetime import datetime
from auth import validate_email, validate_phone

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print(SUPABASE_KEY)
print(SUPABASE_URL)


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Flask + Supabase API is running 🚀"})

@app.route('/signup/doctor', methods=['POST'])
def doctor_signup():
    """
    Doctor signup endpoint for Supabase
    
    Expected JSON payload:
    {
        "first_name": "John",
        "last_name": "Doe",
        "id_number": "1234567890123",
        "email_address": "john.doe@email.com",
        "phone_number": "+1234567890",
        "practice_number": "PR123456",
        "specialty": "Cardiology",
        "hospital": "General Hospital",
        "password": "securepassword123"
    }
    """
    try:
        # Check if Supabase credentials are configured
        if not SUPABASE_URL or not SUPABASE_KEY:
            return jsonify({
                'error': 'Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_KEY environment variables.',
                'success': False
            }), 500
        
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No data provided',
                'success': False
            }), 400
        
        # Extract required fields
        email_address = data.get('email_address')
        password = data.get('password')
        
        # Validate required fields
        if not email_address:
            return jsonify({
                'error': 'Email address is required',
                'success': False
            }), 400
            
        if not password:
            return jsonify({
                'error': 'Password is required',
                'success': False
            }), 400
        
        # Validate email format
        if not validate_email(email_address):
            return jsonify({
                'error': 'Invalid email format',
                'success': False
            }), 400
        
        # Validate phone number if provided
        phone_number = data.get('phone_number')
        if phone_number and not validate_phone(phone_number):
            return jsonify({
                'error': 'Invalid phone number format',
                'success': False
            }), 400
        
        # Validate password strength
        if len(password) < 8:
            return jsonify({
                'error': 'Password must be at least 8 characters long',
                'success': False
            }), 400
        
        # Extract optional fields
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        id_number = data.get('id_number')
        practice_number = data.get('practice_number')
        specialty = data.get('specialty')
        hospital = data.get('hospital')
        
        # Hash the password
        hashed_password = generate_password_hash(password)
        
        # Check if email already exists
        existing_doctor = supabase.table('doctor_table').select('id').eq('email_address', email_address).execute()
        
        if existing_doctor.data:
            return jsonify({
                'error': 'Email address already registered',
                'success': False
            }), 409
        
        # Prepare data for insertion
        doctor_data = {
            'first_name': first_name,
            'last_name': last_name,
            'id_number': id_number,
            'email_address': email_address,
            'phone_number': phone_number,
            'practice_number': practice_number,
            'specialty': specialty,
            'hospital': hospital,
            'password': hashed_password
        }
        
        # Remove None values to let Supabase handle defaults
        doctor_data = {k: v for k, v in doctor_data.items() if v is not None}
        
        # Insert new doctor into Supabase
        result = supabase.table('doctor_table').insert(doctor_data).execute()
        
        if result.data:
            # Get the inserted doctor data (without password)
            inserted_doctor = result.data[0]
            
            # Remove password from response
            response_data = {k: v for k, v in inserted_doctor.items() if k != 'password'}
            
            return jsonify({
                'success': True,
                'message': 'Doctor registered successfully',
                'doctor': response_data
            }), 200
        else:
            return jsonify({
                'error': 'Failed to create doctor record',
                'success': False
            }), 500
    
    except Exception as e:
        # Handle Supabase specific errors
        error_message = str(e)
        
        # Check for common Supabase errors
        if 'duplicate key value' in error_message.lower():
            return jsonify({
                'error': 'Email address already registered',
                'success': False
            }), 409
        elif 'table' in error_message.lower() and 'does not exist' in error_message.lower():
            return jsonify({
                'error': 'Doctor table not found. Please check your database schema.',
                'success': False
            }), 500
        else:
            return jsonify({
                'error': f'Database error: {error_message}',
                'success': False
            }), 500


if __name__ == "__main__":
    app.run(debug=True)
