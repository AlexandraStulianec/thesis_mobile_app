import pytest
import json
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import app

def test_get_units_success(client, mocker):
    mock_data = {"unit_1_functions": {
        "title": "some title", 
        "equation": "\\[\\lim_{{x \\to a}} f(x) = L\\]",
        "example": "\\[ \\lim_{{x \\to 2}} (3x + 1) = 6 + 1 = 7\\]"}
    }
    mocker.patch("app.load_json_files", return_value=mock_data)
    
    response = client.post("/get_units", json={"unit_id": "unit_1_functions"})
    data = response.get_json()
    
    assert response.status_code == 200
    assert data["message"] == "Theory retrieved successuflly"
    assert "data" in data

def test_get_units_invalid(client, mocker):
    mock_data = {"unit_1_functions": {
        "title": "some title", 
        "equation": "\\[\\lim_{{x \\to a}} f(x) = L\\]",
        "example": "\\[ \\lim_{{x \\to 2}} (3x + 1) = 6 + 1 = 7\\]"}
    }
    mocker.patch("app.load_json_files", return_value=mock_data)
    
    response = client.post("/get_units", json={"unit_id": "unit_4_functions"})
    data = response.get_json()
    
    assert response.status_code == 404
    assert data["error"] == "Theory content not found"

def test_get_units_no_data(client, mocker):
    mock_data = {"unit_1_functions": {
        "title": "some title", 
        "equation": "\\[\\lim_{{x \\to a}} f(x) = L\\]",
        "example": "\\[ \\lim_{{x \\to 2}} (3x + 1) = 6 + 1 = 7\\]"}
    }
    mocker.patch("app.load_json_files", return_value=mock_data)
    
    response = client.post("/get_units", json={})
    data = response.get_json()
    
    assert response.status_code == 400
    assert data["error"] == "Missing file in request"

def test_signin_success(client, mock_supabase):
    test_email = "new@example.com"
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []

    mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [{
        "user_id": 1,
        "email": test_email,
        "name": "New User",
        "xp": 0,
        "hearts": 5
    }]

    response = client.post("/signin", json={
        "name": "New User",
        "email": test_email,
        "password": "securepassword123"
    })

    assert response.status_code == 201
    assert response.get_json()["message"] == "User registered successfully"

def test_signin_missing_fields(client):
    response = client.post("/signin", json={
        "name": "New User",
        "password": "securepassword123"
    })
    assert response.status_code == 400
    assert response.get_json()["error"] == "All fields are required"

def test_login_success(client, mock_supabase):
    hashed_pw = generate_password_hash("validpassword")
    mock_user = {
        "user_id": 1,
        "email": "test@example.com",
        "password": hashed_pw,
        "name": "Test User",
        "xp": 100,
        "hearts": 5,
        "current_lesson": 2,
        "current_unit": 1,
        "completed_lessons": ["lesson_1_1"]
    }

    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = mock_user

    response = client.post("/login", json={
        "email": "test@example.com",
        "password": "validpassword"
    })

    assert response.status_code == 200
    data = response.get_json()
    assert data["user"]["email"] == "test@example.com"
    assert "token" in data

def test_login_invalid_password(client, mock_supabase):
    mock_user = {
        "user_id": 1,
        "email": "test@example.com",
        "password": generate_password_hash("correctpassword"),  # Correct password is "correctpassword"
        "name": "Test User",
        "xp": 100,
        "hearts": 5,
    }

    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = mock_user

    response = client.post("/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"  # Wrong password
    })

    assert response.status_code == 401
    assert response.get_json()["error"] == "Invalid credentials"

def test_login_missing_field(client, mock_supabase):
    mock_user = {
        "user_id": 1,
        "email": "test@example.com",
        "password": generate_password_hash("correctpassword"),  # Correct password is "correctpassword"
        "name": "Test User",
        "xp": 100,
        "hearts": 5,
    }

    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = mock_user

    response = client.post("/login", json={
        "email": "test@example.com",
    })

    assert response.status_code == 400
    assert response.get_json()["error"] == "Email and password required"

def test_get_user_stats(client, valid_token, mock_supabase):
    mock_user = [{
        "user_id": 1,
        "name": "Test User",
        "email": "test@example.com",
        "xp": 100,
        "hearts": 5,
        "current_lesson": 2,
        "current_unit": 1,
        "completed_lessons": ["lesson_1_1"]
    }]

    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = mock_user

    headers = {"Authorization": f"Bearer {valid_token}"}
    response = client.get("/user_stats", headers=headers)

    assert response.status_code == 200
    data = response.get_json()
    assert data["name"] == "Test User"
    assert data["xp"] == 100

def test_get_user_stats_invalid_token(client):
    headers = {"Authorization": "Bearer invalid.token.here"}
    response = client.get("/user_stats", headers=headers)
    assert response.status_code == 401

def test_get_user_stats_jwt_token_expiration(client):
    expired_token = jwt.encode({
        'user_id': 1,
        'exp': datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=1)
    }, "SFIQKJcwEitTg17FKz953H4vE3YguBT3bPZXWqcil3k")

    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("/user_stats", headers=headers)
    
    assert response.status_code == 401
    assert response.get_json()["error"] == "Token has expired"

def test_update_user_stats(client, valid_token, mock_supabase):
    current_user = [{
        "user_id": 1,
        "name": "Test User",
        "xp": 100,
        "hearts": 5,
        "current_lesson": 2,
        "current_unit": 1,
        "completed_lessons": ["lesson_1_1"]
    }]

    updated_data = {
        "xp": 150,
        "completed_lessons": ["lesson_1_2"]
    }

    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = current_user
    mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [current_user[0] | updated_data]

    headers = {"Authorization": f"Bearer {valid_token}"}
    response = client.post("/user_update", json=updated_data, headers=headers)

    assert response.status_code == 200
    assert response.get_json()["message"] == "Stats updated successfully"

def test_update_user_stats_invalid_token(client):
    updated_data = {
        "xp": 150,
        "completed_lessons": ["lesson_1_2"]
    }

    headers = {"Authorization": "Bearer invalid.token.here"}
    response = client.post("/user_update", json=updated_data, headers=headers)

    assert response.status_code == 401
    assert response.get_json()["error"] == "Invalid token"


def test_update_user_stats_expired_token(client):
    expired_token = jwt.encode({
        'user_id': 1,
        'exp': datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=1)
    }, "SFIQKJcwEitTg17FKz953H4vE3YguBT3bPZXWqcil3k")  # Replace with your secret key if different

    updated_data = {
        "xp": 150,
        "completed_lessons": ["lesson_1_2"]
    }

    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.post("/user_update", json=updated_data, headers=headers)

    assert response.status_code == 401
    assert response.get_json()["error"] == "Token has expired"

def test_invalid_unit_id_exercises(client):
    response = client.post("/exercises", json={"unit_id": 9})  # Invalid unit_id
    assert response.status_code == 400
    assert response.get_json()["error"] == "Unit 9 not found"

def test_missing_parameters_exercises(client):
    response = client.post("/exercises", json={})
    assert response.status_code == 400
    assert response.get_json()["error"] == "Missing unit_id parameter"

def test_invalid_lesson_id_exercises(client):
    response = client.post("/exercises", json={"unit_id": 1, "lesson_id": 9})  # Invalid lesson_id
    assert response.status_code == 404
    assert response.get_json()["error"] == "Lesson file not found"
    
def test_exercises_generation(client, mocker):

    # Mock file operations
    mocker.patch("os.path.exists", return_value=True)
    mocker.patch("os.listdir", return_value=["lesson_1.json"])
    mocker.patch("builtins.open", mocker.mock_open(read_data=json.dumps({
        "title": "Test Lesson",
        "exercises": [{
            "id": 1,
            "function_type": "polynomial",
            "x_value": 2,
            "type": "multiple_choice"
        }]
    })))
    
    # Mock calculation functions
    mocker.patch("app.calculate_limit", return_value=("x^2", 4))
    mocker.patch("app.generate_multiple_choice", return_value=[1, 2, 3, 4])
    
    response = client.post("/exercises", json={"unit_id": 1, "lesson_id": 1})
    data = response.get_json()
    
    assert response.status_code == 200
    assert data["unit"] == 1
    assert len(data["exercises"]) > 0

def test_explain_mistake(client, mocker):
    mocker.patch("app.generate_explanation", return_value="Test explanation")
    
    data = {
        "question": "Limit question",
        "expression": "x^2",
        "user_answer": "4",
        "correct_answer": "4",
        "x_value": 2
    }
    
    response = client.post("/explain_mistake", json=data)
    assert response.status_code == 200
    assert "Test explanation" in response.json["explanation"]
