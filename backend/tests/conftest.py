"""pytest fixtures for Café Fausse backend tests."""

import pytest
from pathlib import Path
import sys

# Calculate the parent directory's absolute path
parent_dir = str(Path(__file__).resolve().parent.parent)

# Add the parent directory to the system path if it isn't already there
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

# Now you can import app.py safely
from app import create_app

from config import TestingConfig
from extensions import db as _db

@pytest.fixture(scope="session")
def app():
    """Create application with in-memory SQLite for tests."""
    application = create_app(TestingConfig)
    with application.app_context():
        _db.create_all()
        yield application
        _db.drop_all()

@pytest.fixture
def client(app):
    """Flask test client."""
    return app.test_client()

@pytest.fixture(autouse=True)
def clean_db(app):
    """Roll back database changes after each test."""
    with app.app_context():
        yield
        _db.session.rollback()
        # Truncate all tables between tests
        for table in reversed(_db.metadata.sorted_tables):
            _db.session.execute(table.delete())
        _db.session.commit()