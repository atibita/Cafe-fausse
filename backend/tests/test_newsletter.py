"""Tests for the newsletter sign-up API."""
import json

def subscribe(client, email, name="Test User"):
    return client.post(
        "/api/newsletter",
        data=json.dumps({"email": email, "name": name}),
        content_type="application/json",
    )

def test_new_subscription_returns_201(client):
    res = subscribe(client, "new@example.com")
    assert res.status_code == 201
    assert res.get_json()["success"] is True

def test_duplicate_subscription_returns_200(client):
    subscribe(client, "dup@example.com")
    res = subscribe(client, "dup@example.com")
    assert res.status_code == 200
    assert res.get_json()["already_subscribed"] is True

def test_empty_email_returns_400(client):
    res = subscribe(client, "")
    assert res.status_code == 400

def test_invalid_email_returns_400(client):
    res = subscribe(client, "not-valid")
    assert res.status_code == 400
    assert any("valid" in e.lower() for e in res.get_json()["errors"])