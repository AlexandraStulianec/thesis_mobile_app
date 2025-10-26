import datetime
from flask import Flask, jsonify, request
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from fetch import load_json_files
from exercises import calculate_limit, generate_multiple_choice
from flask_cors import CORS
import json
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from ai import generate_explanation

load_dotenv() 

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

JWT_SECRET = os.getenv("JWT_SECRET")
TOKEN_EXPIRATION_HOURS=2

# Initialize Supabase client

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# JWT Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = supabase.table("user").select("*").eq("user_id", data['user_id']).execute().data
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Pass user data to protected route
        return f(current_user, *args, **kwargs)

    return decorated

# Endpoint: Get theory content for a specific unit
@app.route("/get_units", methods=["POST"])
def get_units():
    try:
        data = request.json
        # Validate request data
        if not data or "unit_id" not in data:
            return jsonify({"error": "Missing file in request"}), 400
        
        unit_id = data["unit_id"]
        # Load theory content from JSON files
        theory = load_json_files("unit_theory")

        # Check if unit exists
        if unit_id not in theory:
            return jsonify({"error": "Theory content not found"}), 404

        return jsonify({"message": "Theory retrieved successuflly", "data": theory[data["unit_id"]]}),200
    except Exception as e:
        return jsonify({"error": "Error loading theory content"}), 500
        
# Endpoint: Generate exercises for a unit/lesson
@app.route('/exercises', methods=['POST'])
def generate_exercises():
    try:
        data = request.json

        # Validate request
        if not data or "unit_id" not in data:
            return jsonify({"error": "Missing unit_id parameter"}), 400

        unit_id = data.get("unit_id", 1)  # Default to 1 if unit_id is missing
        lesson_id = data.get("lesson_id")  # lesson_id is optional

        unit_path = os.path.join("exercises", f"unit{unit_id}")

        if not os.path.exists(unit_path):
            return jsonify({"error": f"Unit {unit_id} not found"}), 400

        # If lesson_id is provided, return exercises for that lesson
        if lesson_id:
            file_path = os.path.join(unit_path, f"lesson_{lesson_id}.json")
            if not os.path.exists(file_path):
                return jsonify({"error": "Lesson file not found"}), 404

            with open(file_path, "r") as file:
                lesson_data = json.load(file)

            title = lesson_data.get("title")
            exercises = []
            for ex in lesson_data["exercises"]:
                latex_expr, correct_answer = calculate_limit(
                    ex["function_type"], ex["x_value"],
                    ex.get("degree", 2), ex.get("degree_den", 1)
                )

                question = "What is the limit of?"
                answer_type = "text"
                if ex["type"] == "multiple_choice":
                    choices = generate_multiple_choice(correct_answer)
                    answer_type = "multiple_choice"
                else:
                    choices = []

                # Prepare the exercise data
                exercise_data = {
                    "id": ex["id"],
                    "question": question,
                    "expression": latex_expr,
                    "answer_type": answer_type,
                    "correct_answer": correct_answer,
                    "choices": choices,
                    "x_value": ex["x_value"]
                }

                exercises.append(exercise_data)

            return jsonify({"unit": unit_id, "lesson": lesson_id, "title": title, "exercises": exercises})

        # If lesson_id is not provided, return a list of lessons in the unit
        else:
            lessons = []
            for lesson_file in os.listdir(unit_path):
                if lesson_file.endswith(".json"):
                    lesson_id = int(lesson_file.split("_")[1].split(".")[0])
                    with open(os.path.join(unit_path, lesson_file), "r") as file:
                        lesson_data = json.load(file)
                        lessons.append({
                            "lesson_id": lesson_id,
                            "title": lesson_data.get("title")
                        })

            return jsonify({"unit": unit_id, "lessons": lessons})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error generating exercises"}), 500

# Endpoint: User registration
@app.route('/signin', methods=["POST"])
def signin():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        # Validate input
        if not name or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        # Check if email is taken
        existing_user = supabase.table("user").select("user_id").eq("email", email).execute()
        if existing_user.data:
            return jsonify({"error": "Email already taken"}), 409
        
        hashed_pw = generate_password_hash(password)

        # Insert new user into 'user' table
        user_data = {
            "name": name,
            "email": email,
            "hearts": 5,
            "xp": 0,
            "current_lesson": 1,
            "current_unit": 1,
            "password": hashed_pw, 
            "completed_lessons": []
        }
        response = supabase.table("user").insert(user_data).execute()

        if not response.data:
            return jsonify({"error": "Failed to register user"}), 500

        # Generate JWT token
        user = response.data[0]
        token = jwt.encode({
            'user_id': user['user_id'],
            'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=TOKEN_EXPIRATION_HOURS)
        }, JWT_SECRET)

        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": user
        }), 201


    except Exception as e:
        return jsonify({"error": f"Signup failed: {str(e)}"}), 500


# Endpoint: User login
@app.route('/login', methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        # Get user from database
        user_query = supabase.table("user").select("*").eq("email", email).single().execute()
        user = user_query.data

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Verify password
        if not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate JWT token
        token = jwt.encode({
            'user_id': user['user_id'],
            'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=TOKEN_EXPIRATION_HOURS)
        }, JWT_SECRET)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "user_id": user['user_id'],
                "name": user['name'],
                "email": user['email'],
                "xp": user['xp'],
                "hearts": user['hearts'],
                "current_lesson": user['current_lesson'],
                "current_unit": user['current_unit'], 
                "completed_lessons": user['completed_lessons'] 
            }
        }),200

    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500
    

# Endpoint: User logout (token validation only)
@app.route('/logout', methods=["POST"])
@token_required
def logout(current_user):
    try:
        return jsonify({"message": "Logout successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint: Get current user stats
@app.route('/user_stats', methods=["GET"])
@token_required
def get_user_stats(current_user):
    # Return user data from the database
    return jsonify({
        "name": current_user[0]['name'],
        "xp": current_user[0]['xp'],
        "hearts": current_user[0]['hearts'],
        "current_lesson": current_user[0]['current_lesson'],
        "current_unit": current_user[0]['current_unit'],
        "completed_lessons": current_user[0]['completed_lessons'] 
    }), 200

# Endpoint: Update user stats
@app.route('/user_update', methods=["POST"])
@token_required
def update_user_stats(current_user):
    # Update user data in the database
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No update data provided"}), 400
        
        updates = {}

        # Prepare update fields
        if 'name' in data:
            updates['name']=data['name']
        if 'xp' in data:
            updates['xp'] = data['xp']
        if 'hearts' in data:
            updates['hearts'] = data['hearts']
        if 'current_lesson' in data:
            updates['current_lesson'] = data['current_lesson']
        if 'current_unit' in data:
            updates['current_unit'] = data['current_unit']
        if 'completed_lessons' in data:
            current_completed_lessons = current_user[0]['completed_lessons'] or []
            
            # Ensure it's a list and append new lessons
            if not isinstance(current_completed_lessons, list):
                current_completed_lessons = []
            
            updates['completed_lessons'] = list(set(current_completed_lessons + data['completed_lessons']))
            
        supabase.table("user").update(updates).eq("user_id", current_user[0]['user_id']).execute()
        
        return jsonify({"message": "Stats updated successfully"}),200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint: Generate AI explanation for incorrect answer
@app.route("/explain_mistake", methods=["POST"])
def explain_mistake():
    
    data = request.json
    print(data)
    
    question = data.get("question")
    expression = data.get("expression")
    user_answer = data.get("user_answer")
    correct_answer = data.get("correct_answer")
    x_value = data.get("x_value")

    # Validate required fields
    # if not question or not x_value or not expression or not user_answer or not correct_answer:
    #     return jsonify({"error": "Missing data"}), 400

    required_fields = [question, expression, user_answer, correct_answer, x_value]
    if any(v is None for v in required_fields):
        return jsonify({"error": "Missing data"}), 400

    explanation = generate_explanation(question, expression, user_answer, correct_answer, x_value)
    return jsonify({"explanation": explanation})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000,debug=True)
