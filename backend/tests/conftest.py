# tests/conftest.py
import pytest
from app import app as flask_app
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta, timezone
import jwt

@pytest.fixture
def app():
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def mock_supabase():
    with patch("app.supabase") as mock:
        yield mock

@pytest.fixture
def valid_token():
    payload = {
        "user_id": 1,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, "SFIQKJcwEitTg17FKz953H4vE3YguBT3bPZXWqcil3k", algorithm="HS256")
    return token
