"""Tests for the reservation API."""
import json
from datetime import datetime, timedelta

VALID_SLOT = (datetime.utcnow() + timedelta(days=1)).replace(
    hour=19, minute=0, second=0, microsecond=0
).isoformat()

VALID_PAYLOAD = {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "time_slot": VALID_SLOT,
    "num_guests": 2,
}

def post_reservation(client, payload):
    return client.post(
        "/api/reservations",
        data=json.dumps(payload),
        content_type="application/json",
    )

def test_create_reservation_success(client):
    """A valid reservation returns 201 and a confirmation message."""
    res = post_reservation(client, VALID_PAYLOAD)
    assert res.status_code == 201
    data = res.get_json()
    assert data["success"] is True
    assert "table_number" in data["reservation"]

def test_missing_name_returns_400(client):
    payload = {**VALID_PAYLOAD, "name": ""}
    res = post_reservation(client, payload)
    assert res.status_code == 400
    assert any("Name" in e for e in res.get_json()["errors"])

def test_invalid_email_returns_400(client):
    payload = {**VALID_PAYLOAD, "email": "not-an-email"}
    res = post_reservation(client, payload)
    assert res.status_code == 400

def test_past_timeslot_returns_400(client):
    payload = {**VALID_PAYLOAD, "time_slot": "2000-01-01T19:00:00"}
    res = post_reservation(client, payload)
    assert res.status_code == 400

def test_all_tables_booked_returns_409(client):
    """Booking 30 tables for one slot makes the 31st return 409."""
    for i in range(30):
        payload = {
            **VALID_PAYLOAD,
            "email": f"guest{i}@example.com",
            "name": f"Guest {i}",
        }
        res = post_reservation(client, payload)
        assert res.status_code == 201

    extra = {**VALID_PAYLOAD, "email": "extra@example.com", "name": "Extra"}
    res = post_reservation(client, extra)
    assert res.status_code == 409

def test_availability_endpoint(client):
    res = client.get(f"/api/reservations/availability?time_slot={VALID_SLOT}")
    assert res.status_code == 200
    data = res.get_json()
    assert data["total_tables"] == 30
    assert data["is_available"] is True