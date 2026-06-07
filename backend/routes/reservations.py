"""
routes/reservations.py — Café Fausse Reservation API
=====================================================
Implements FR-6 through FR-9 and FR-17 / FR-18.

Endpoints
---------
POST /api/reservations          — Create a new reservation
GET  /api/reservations/slots    — List available time slots for a given date
"""

import random
import re
from datetime import datetime, timezone, UTC

from flask import Blueprint, jsonify, request, current_app
from sqlalchemy.exc import IntegrityError

from extensions import db
from models import Customer, Reservation

reservations_bp = Blueprint("reservations", __name__, url_prefix="/api/reservations")

# ── Helpers ───────────────────────────────────────────────────────────────────

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_RE = re.compile(r"^[\d\s\(\)\-\+\.]{7,20}$")


def _validate_reservation_payload(data: dict) -> list[str]:
    """
    Validate the incoming JSON payload.
    Returns a list of human-readable error strings (empty = valid).
    """
    errors: list[str] = []

    # Required fields
    if not data.get("name", "").strip():
        errors.append("Name is required.")
    if not data.get("email", "").strip():
        errors.append("Email address is required.")
    elif not EMAIL_RE.match(data["email"].strip()):
        errors.append("Email address format is invalid.")
    if not data.get("time_slot"):
        errors.append("Time slot is required.")
    if not data.get("num_guests"):
        errors.append("Number of guests is required.")

    # Numeric checks
    try:
        guests = int(data.get("num_guests", 0))
        if guests < 1 or guests > 20:
            errors.append("Number of guests must be between 1 and 20.")
    except (TypeError, ValueError):
        errors.append("Number of guests must be a valid integer.")

    # Optional phone validation
    phone = data.get("phone", "").strip()
    if phone and not PHONE_RE.match(phone):
        errors.append("Phone number format is invalid.")

    # Time slot format + future date check
    if data.get("time_slot"):
        try:
            slot_dt = datetime.fromisoformat(data["time_slot"])
            current_utc_time = datetime.now(UTC)
            # if slot_dt < datetime.utcnow():
            if slot_dt < current_utc_time:
                errors.append("Reservation time must be in the future.")
        except ValueError:
            errors.append("Time slot must be a valid ISO 8601 datetime string.")

    return errors


def _get_available_table(time_slot: datetime, total_tables: int) -> int | None:
    """
    Return a random available table number for the given time slot.
    Returns None if all tables are booked (FR-8, FR-18).
    """
    booked_tables: list[int] = [
        row.table_number
        for row in Reservation.query.filter_by(time_slot=time_slot).all()
    ]
    all_tables = set(range(1, total_tables + 1))
    available = list(all_tables - set(booked_tables))

    if not available:
        return None  # Fully booked

    return random.choice(available)


# ── Routes ───────────────────────────────────────────────────────────────────


@reservations_bp.route("", methods=["POST"])
def create_reservation():
    """
    Create a new reservation.

    Request body (JSON):
        name        str  — Customer full name              (required)
        email       str  — Customer email                  (required)
        phone       str  — Customer phone                  (optional)
        time_slot   str  — ISO 8601 datetime string        (required)
        num_guests  int  — Party size                      (required)
        newsletter  bool — Opt-in for newsletter           (optional, default false)

    Responses:
        201 — Reservation confirmed  { reservation, customer }
        400 — Validation error       { errors: [...] }
        409 — No tables available    { message }
        500 — Unexpected server error
    """
    data: dict = request.get_json(silent=True) or {}

    # ── Validate input ────────────────────────────────────────────────────────
    errors = _validate_reservation_payload(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    #slot_dt = datetime.fromisoformat(data["time_slot"])
    slot_dt = datetime.fromisoformat(data["time_slot"]).astimezone(timezone.utc)
    total_tables: int = current_app.config["TOTAL_TABLES"]

    # ── Check table availability (FR-7, FR-8) ────────────────────────────────
    # table = _get_available_table(slot_dt.date(), total_tables)
    table = _get_available_table(slot_dt, total_tables)
    # print(table)
    if table is None:
        return (
            jsonify(
                {
                    "success": False,
                    "message": (
                        "We're sorry — all tables are fully booked for that time slot. "
                        "Please choose a different date or time."
                    ),
                }
            ),
            409,
        )

    # ── Upsert customer record (FR-18) ────────────────────────────────────────
    email = data["email"].strip().lower()
    customer = Customer.query.filter_by(email=email).first()

    if customer is None:
        customer = Customer(
            name=data["name"].strip(),
            email=email,
            phone=data.get("phone", "").strip() or None,
            newsletter_signup=bool(data.get("newsletter", False)),
        )
        db.session.add(customer)
    else:
        # Update mutable fields if customer already exists
        customer.name = data["name"].strip()
        if data.get("phone", "").strip():
            customer.phone = data["phone"].strip()
        if data.get("newsletter"):
            customer.newsletter_signup = True

    # ── Create reservation ────────────────────────────────────────────────────
    reservation = Reservation(
        customer=customer,
        time_slot=slot_dt,
        table_number=table,
        num_guests=int(data["num_guests"]),
    )
    db.session.add(reservation)

    try:
        db.session.commit()
    except IntegrityError:
        # Race condition: another request grabbed the same table — retry once
        db.session.rollback()
        table = _get_available_table(slot_dt, total_tables)
        if table is None:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": (
                            "All tables were just reserved. "
                            "Please select another time slot."
                        ),
                    }
                ),
                409,
            )
        reservation.table_number = table
        db.session.commit()

    local_dt = slot_dt.astimezone()
    # ── Success response (FR-9) ───────────────────────────────────────────────
    return (
        jsonify(
            {
                "success": True,
                "message": (
                    f"Your reservation has been confirmed! "
                    f"Table {table} is reserved for {int(data['num_guests'])} "
                    f"guest(s) on "
                    f"{local_dt.strftime('%B %d, %Y at %I:%M %p')} . "
                    f"We look forward to welcoming you to Café Fausse."
                ),
                "reservation": reservation.to_dict(),
                "customer": customer.to_dict(),
            }
        ),
        201,
    )


@reservations_bp.route("/availability", methods=["GET"])
def check_availability():
    """
    Check how many tables remain available for a given ISO datetime.

    Query params:
        time_slot  str — ISO 8601 datetime

    Response:
        200 — { available_tables: int, total_tables: int, is_available: bool }
        400 — { errors: [...] }
    """
    slot_str = request.args.get("time_slot", "")
    if not slot_str:
        return jsonify({"success": False, "errors": ["time_slot is required."]}), 400

    try:
        # slot_dt = datetime.fromisoformat(slot_str)
        slot_dt = datetime.fromisoformat(slot_str).astimezone(timezone.utc)
    except ValueError:
        return (
            jsonify({"success": False, "errors": ["Invalid datetime format."]}),
            400,
        )

    total_tables: int = current_app.config["TOTAL_TABLES"]
    booked_count: int = Reservation.query.filter_by(time_slot=slot_dt).count()
    available: int = total_tables - booked_count

    return jsonify(
        {
            "success": True,
            "available_tables": available,
            "total_tables": total_tables,
            "is_available": available > 0,
        }
    )
