from dotenv import load_dotenv
from flask import Flask, request, jsonify
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from supabase import create_client, Client
import os
from datetime import datetime, timedelta
from auth import validate_email, validate_phone
from flask_cors import CORS

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_EXPIRY_HOURS = 24


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Flask + Supabase API is running 🚀"})

# Token verification middleware/decorator
def token_required(f):
    """Decorator to protect routes that require authentication"""
    from functools import wraps
    
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({
                    'error': 'Invalid token format',
                    'success': False
                }), 401
        
        if not token:
            return jsonify({
                'error': 'Access token is missing',
                'success': False
            }), 401
        
        try:
            # Decode token
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            current_doctor_id = payload['doctor_id']
            
            # Verify doctor still exists
            doctor_result = supabase.table('doctor_table').select('id, email_address, first_name, last_name').eq('id', current_doctor_id).execute()
            
            if not doctor_result.data:
                return jsonify({
                    'error': 'Invalid token - doctor not found',
                    'success': False
                }), 401
            
            # Add doctor info to request context
            request.current_doctor = doctor_result.data[0]
            
        except jwt.ExpiredSignatureError:
            return jsonify({
                'error': 'Token has expired',
                'success': False
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                'error': 'Invalid token',
                'success': False
            }), 401
        
        return f(*args, **kwargs)
    
    return decorated

@app.route('/doctor/<int:doctor_id>/patients', methods=['GET'])
@token_required
def get_doctor_patients(doctor_id):
    """
    Fetch all patients assigned to a specific doctor (by doctor_id).
    Requires Authorization header with Bearer token.

    Example request:
        GET /doctor/1/patients
        Headers: Authorization: Bearer <token>
    """
    try:
        # Ensure requesting doctor matches the token OR is allowed
        current_doctor = request.current_doctor
        if current_doctor['id'] != doctor_id:
            return jsonify({
                'error': 'Unauthorized: You can only access your own patients',
                'success': False
            }), 403

        # Fetch patients assigned to this doctor
        patients_result = supabase.table('patient_table').select('*').eq('primary_physician', doctor_id).execute()

        if not patients_result.data:
            return jsonify({
                'success': True,
                'message': 'No patients found for this doctor',
                'patients': []
            }), 200

        return jsonify({
            'success': True,
            'patients': patients_result.data
        }), 200

    except Exception as e:
        return jsonify({
            'error': f'Error fetching patients: {str(e)}',
            'success': False
        }), 500

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
            'password': password
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

@app.route('/signin/doctor', methods=['POST'])
def doctor_signin():
    """
    Doctor signin endpoint
    
    Expected JSON payload:
    {
        "email_address": "john.doe@email.com",
        "password": "securepassword123"
    }
    """
    try:
        # Check if Supabase credentials are configured
        if not SUPABASE_URL or not SUPABASE_KEY:
            return jsonify({
                'error': 'Server configuration error',
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
        
        # Find doctor by email
        doctor_result = supabase.table('doctor_table').select('*').eq('email_address', email_address).execute()
        
        if not doctor_result.data:
            return jsonify({
                'error': 'Invalid email or password',
                'success': False
            }), 401
        
        doctor = doctor_result.data[0]
        stored_password_hash = doctor['password']
        
        # Verify password
        if not (stored_password_hash == password):
            return jsonify({
                'error': 'Invalid email or password',
                'success': False
            }), 401
        
        # Generate JWT token
        token_payload = {
            'doctor_id': doctor['id'],
            'email': doctor['email_address'],
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS),
            'iat': datetime.utcnow(),
            'first_name' : doctor['first_name'],
            'last_name' : doctor['last_name'],
            'id_number' : doctor['id_number'],
            'phone' : doctor['phone_number'],
            'practice_number' : doctor['practice_number'],
            'specialty' : doctor['specialty'],
            'hospital' : doctor['hospital'],
            'password' : doctor['password']
        }
        
        access_token = jwt.encode(token_payload, JWT_SECRET, algorithm='HS256')
        
        # Prepare doctor data (exclude password)
        doctor_data = {k: v for k, v in doctor.items() if k != 'password'}
        
        # Update last login time (optional)
        try:
            supabase.table('doctor_table').update({
                'last_login': datetime.utcnow().isoformat()
            }).eq('id', doctor['id']).execute()
        except:
            # Don't fail signin if last_login update fails
            pass
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'access_token': access_token,
            'token_type': 'Bearer',
            'expires_in': JWT_EXPIRY_HOURS * 3600,  # seconds
            'doctor': doctor_data
        }), 200
    
    except Exception as e:
        # Handle specific errors
        error_message = str(e)
        
        if 'table' in error_message.lower() and 'does not exist' in error_message.lower():
            return jsonify({
                'error': 'Doctor table not found. Please check your database schema.',
                'success': False
            }), 500
        else:
            return jsonify({
                'error': f'Authentication error: {error_message}',
                'success': False
            }), 500



# Token refresh endpoint
@app.route('/auth/refresh', methods=['POST'])
@token_required
def refresh_token():
    """
    Refresh access token
    
    Headers required:
    Authorization: Bearer <access_token>
    """
    try:
        doctor = request.current_doctor
        
        # Generate new token
        token_payload = {
            'doctor_id': doctor['id'],
            'email': doctor['email_address'],
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS),
            'iat': datetime.utcnow()
        }
        
        new_access_token = jwt.encode(token_payload, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'success': True,
            'message': 'Token refreshed successfully',
            'access_token': new_access_token,
            'token_type': 'Bearer',
            'expires_in': JWT_EXPIRY_HOURS * 3600
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Token refresh error: {str(e)}',
            'success': False
        }), 500

# Logout endpoint (optional - mainly for client-side token cleanup)
@app.route('/auth/logout', methods=['POST'])
@token_required
def logout():
    """
    Logout endpoint - mainly for client-side cleanup
    Server-side logout would require token blacklisting (not implemented here)
    """
    return jsonify({
        'success': True,
        'message': 'Logged out successfully. Please remove the token from client storage.'
    }), 200

@app.route('/transcribe/audio', methods=['POST'])
def submit_audio_for_transcription():
    """
    Endpoint to submit audio for transcription
    This is a placeholder function, actual implementation will depend on the transcription service used.
    """
    return jsonify({
        'message': 'Audio submission endpoint is under construction.'
    }), 501

if __name__ == '__main__':
    app.run(debug=True)



# Example usage and testing:
"""
1. Install required packages:
   pip install flask werkzeug supabase PyJWT

2. Set environment variables:
   export SUPABASE_URL="https://your-project-ref.supabase.co"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   export JWT_SECRET="your-very-secure-secret-key"

3. Test signin:
   curl -X POST http://localhost:5000/signin/doctor \
     -H "Content-Type: application/json" \
     -d '{
       "email_address": "john.doe@email.com",
       "password": "securepassword123"
     }'

4. Expected success response:
   {
     "success": true,
     "message": "Login successful",
     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
     "token_type": "Bearer",
     "expires_in": 86400,
     "doctor": {
       "id": "doctor-uuid",
       "first_name": "John",
       "last_name": "Doe",
       "email_address": "john.doe@email.com",
       "created_at": "2025-08-16T10:30:00Z",
       ...
     }
   }

5. Test protected route:
   curl -X GET http://localhost:5000/doctor/profile \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."

6. Common error responses:
   - 401: Invalid credentials
   - 400: Missing/invalid data
   - 500: Server error
"""
