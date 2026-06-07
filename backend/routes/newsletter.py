"""
routes/newsletter.py — Café Fausse Newsletter Signup API
=========================================================
Implements FR-15 and FR-16.

Endpoints
---------
POST /api/newsletter   — Subscribe an email address to the newsletter
"""

import re

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from extensions import db
from models import Customer

newsletter_bp = Blueprint("newsletter", __name__, url_prefix="/api/newsletter")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@newsletter_bp.route("", methods=["POST"])
def subscribe():
    """
    Subscribe a visitor to the Café Fausse newsletter.

    Request body (JSON):
        email  str  — Valid email address  (required)
        name   str  — Subscriber name      (optional)

    Responses:
        200 — Already subscribed   { message }
        201 — Successfully stored  { message }
        400 — Validation error     { errors: [...] }
        500 — Unexpected error
    """
    data: dict = request.get_json(silent=True) or {}

    # ── Input validation (FR-15) ─────────────────────────────────────────────
    errors: list[str] = []
    email = data.get("email", "").strip().lower()

    if not email:
        errors.append("Email address is required.")
    elif not EMAIL_RE.match(email):
        errors.append("Please enter a valid email address.")

    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    # ── Persist to database (FR-16) ───────────────────────────────────────────
    existing_customer = Customer.query.filter_by(email=email).first()

    if existing_customer:
        if existing_customer.newsletter_signup:
            # Already opted in — idempotent response
            return jsonify(
                {
                    "success": True,
                    "message": "You are already subscribed to our newsletter. Thank you!",
                    "already_subscribed": True,
                }
            )
        # Opt them in
        existing_customer.newsletter_signup = True
        db.session.commit()
        return jsonify(
            {
                "success": True,
                "message": (
                    "You've been added to our newsletter. "
                    "Welcome back to the Café Fausse family!"
                ),
                "already_subscribed": False,
            }
        )

    # New subscriber — create a minimal customer record
    name = data.get("name", "").strip() or "Newsletter Subscriber"
    new_subscriber = Customer(
        name=name,
        email=email,
        newsletter_signup=True,
    )
    db.session.add(new_subscriber)

    try:
        db.session.commit()
    except IntegrityError:
        # Race condition on unique email constraint
        db.session.rollback()
        return jsonify(
            {
                "success": True,
                "message": "You are already subscribed. Thank you!",
                "already_subscribed": True,
            }
        )

    return (
        jsonify(
            {
                "success": True,
                "message": (
                    "Thank you for subscribing! "
                    "You'll receive updates about our latest menus, "
                    "events, and exclusive offers at Café Fausse."
                ),
                "already_subscribed": False,
            }
        ),
        201,
    )
