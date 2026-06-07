"""
models.py — Café Fausse SQLAlchemy database models
Defines the Customer and Reservation tables exactly as specified in FR-17.
"""

from datetime import datetime, timezone, UTC
from extensions import db


class Customer(db.Model):
    """
    Stores customer information captured during a reservation or newsletter
    signup.

    Columns (FR-17):
        customer_id       — Auto-incremented primary key
        name              — Full name of the customer
        email             — Unique email address
        phone             — Optional phone number
        newsletter_signup — True if the customer opted into the newsletter
        created_at        — Timestamp of first record creation
    """

    __tablename__ = "customers"

    customer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(254), nullable=False, unique=True, index=True)
    phone = db.Column(db.String(30), nullable=True)
    newsletter_signup = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(UTC), nullable=False)

    # One customer can have many reservations
    reservations = db.relationship(
        "Reservation", back_populates="customer", lazy="dynamic"
    )

    def to_dict(self) -> dict:
        """Serialize the model instance to a plain dictionary."""
        return {
            "customer_id": self.customer_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "newsletter_signup": self.newsletter_signup,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self) -> str:
        return f"<Customer id={self.customer_id} email={self.email!r}>"


class Reservation(db.Model):
    """
    Stores a single table booking.

    Columns (FR-17):
        reservation_id — Auto-incremented primary key
        customer_id    — Foreign key → customers.customer_id
        time_slot      — Datetime of the reserved slot
        table_number   — Assigned table (1-30)
        num_guests     — Party size
        created_at     — Booking timestamp
    """

    __tablename__ = "reservations"

    reservation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(
        db.Integer,
        db.ForeignKey("customers.customer_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    time_slot = db.Column(db.DateTime, nullable=False, index=True)
    table_number = db.Column(db.Integer, nullable=False)
    num_guests = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(UTC), nullable=False)

    # Unique constraint: one table cannot be double-booked for the same slot
    __table_args__ = (
        db.UniqueConstraint("time_slot", "table_number", name="uq_slot_table"),
    )

    # Back-reference to the customer
    customer = db.relationship("Customer", back_populates="reservations")

    def to_dict(self) -> dict:
        """Serialize the model instance to a plain dictionary."""
        return {
            "reservation_id": self.reservation_id,
            "customer_id": self.customer_id,
            "time_slot": self.time_slot.isoformat(),
            "table_number": self.table_number,
            "num_guests": self.num_guests,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self) -> str:
        return (
            f"<Reservation id={self.reservation_id} "
            f"slot={self.time_slot} table={self.table_number}>"
        )
