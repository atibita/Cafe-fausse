"""
extensions.py — Shared Flask extension instances.

Instantiating extensions here (instead of inside app.py) prevents the
circular-import problem that arises when models import from app.py.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

# Shared SQLAlchemy instance — registered with the app in app.py via init_app()
db = SQLAlchemy(model_class=Base)
