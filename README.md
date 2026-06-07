# Café Fausse — Full-Stack Web Application

> An elegant fine-dining web application built with **React + Flask + PostgreSQL**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Requirements](#2-system-requirements)
3. [Project Structure](#3-project-structure)
4. [Local Development Setup](#4-local-development-setup)
   - 4.1 [Clone the Repository](#41-clone-the-repository)
   - 4.2 [PostgreSQL Database Setup](#42-postgresql-database-setup)
   - 4.3 [Backend Setup (Flask)](#43-backend-setup-flask)
   - 4.4 [Frontend Setup (React)](#44-frontend-setup-react)
   - 4.5 [Run Both Servers](#45-run-both-servers)
5. [Environment Variables Reference](#5-environment-variables-reference)
6. [API Endpoints Reference](#6-api-endpoints-reference)
7. [Testing](#7-testing)
   - 7.1 [Backend Tests (pytest)](#71-backend-tests-pytest)
   - 7.2 [Frontend Tests (React Testing Library)](#72-frontend-tests-react-testing-library)
   - 7.3 [Manual API Testing with curl](#73-manual-api-testing-with-curl)
8. [Production Deployment](#8-production-deployment)
   - 8.1 [Option A — Single Server (Nginx + Gunicorn)](#81-option-a--single-server-nginx--gunicorn)
   - 8.2 [Option B — Docker Compose](#82-option-b--docker-compose)
9. [Database Management](#9-database-management)
10. [Troubleshooting](#10-troubleshooting)
11. [Security Checklist](#11-security-checklist)

---

## 1. Project Overview

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, JSX, React Router v6, Axios |
| Backend   | Python 3.11+, Flask 3, Flask-SQLAlchemy, Flask-CORS |
| Database  | PostgreSQL 15+                      |
| Web Server (prod) | Nginx + Gunicorn             |

**Features implemented:**
- Five-page responsive React SPA (Home, Menu, Reservations, About Us, Gallery)
- Table reservation system with real-time availability checking (30 tables)
- Email newsletter sign-up with backend persistence
- Full client-side and server-side input validation
- PostgreSQL data models for Customers and Reservations

---

## 2. System Requirements

Ensure the following are installed on your machine before proceeding:

| Requirement   | Minimum Version | Check Command              |
|---------------|-----------------|----------------------------|
| Node.js       | 18.x            | `node --version`           |
| npm           | 9.x             | `npm --version`            |
| Python        | 3.11            | `python3 --version`        |
| pip           | 23.x            | `pip3 --version`           |
| PostgreSQL    | 15              | `psql --version`           |
| Git           | any             | `git --version`            |

> **macOS users:** Install PostgreSQL via Homebrew: `brew install postgresql@15`
> **Ubuntu/Debian users:** `sudo apt install postgresql postgresql-contrib`
> **Windows users:** Use the official PostgreSQL installer from postgresql.org, or use WSL2.

---

## 3. Project Structure

```
cafe-fausse/
├── backend/                     # Flask API
│   ├── app.py                   # Application factory & entry point
│   ├── config.py                # Configuration classes (dev/prod/test)
│   ├── extensions.py            # Shared Flask extension instances
│   ├── models.py                # SQLAlchemy models (Customer, Reservation)
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── reservations.py      # POST /api/reservations
│   │   └── newsletter.py        # POST /api/newsletter
│   ├── tests/
│   │   ├── conftest.py          # pytest fixtures
│   │   ├── test_reservations.py
│   │   └── test_newsletter.py
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variable template
│
├── frontend/                    # React application
│   ├── public/
│   │   └── index.html           # HTML shell with Google Fonts
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx / .css
│   │   │   └── Footer.jsx / .css
│   │   ├── pages/
│   │   │   ├── Home.jsx / .css
│   │   │   ├── Menu.jsx / .css
│   │   │   ├── Reservations.jsx / .css
│   │   │   ├── AboutUs.jsx / .css
│   │   │   └── Gallery.jsx / .css
│   │   ├── styles/
│   │   │   └── global.css       # Design tokens & base styles
│   │   ├── utils/
│   │   │   └── api.js           # Axios instance
│   │   ├── App.jsx              # Router setup
│   │   └── index.jsx            # ReactDOM entry
│   └── package.json
│
└── README.md
```

---

## 4. Local Development Setup

### 4.1 Clone the Repository

```bash
git clone https://github.com/your-org/cafe-fausse.git
cd cafe-fausse
```

---

### 4.2 PostgreSQL Database Setup

#### Step 1 — Start the PostgreSQL service

**macOS (Homebrew):**
```bash
brew services start postgresql@15
```

**Ubuntu / Debian:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql     # start on boot
```

**Windows (PowerShell as Administrator):**
```powershell
net start postgresql-x64-15
```

#### Step 2 — Create the database user and database

```bash
# Open the PostgreSQL interactive terminal as the superuser
sudo -u postgres psql          # Linux
psql postgres                  # macOS (Homebrew)
```

Inside `psql`, run:

```sql
-- Create a dedicated application user
CREATE USER cafe_user WITH PASSWORD 'cafe_password';

-- Create the application database
CREATE DATABASE cafe_fausse OWNER cafe_user;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE cafe_fausse TO cafe_user;

-- Exit psql
\q
```

#### Step 3 — Verify the connection

```bash
psql -U cafe_user -d cafe_fausse -h localhost -c "SELECT version();"
```

You should see the PostgreSQL version string. If prompted for a password, enter `cafe_password`.

> **Tip:** If you get a peer-authentication error on Linux, edit
> `/etc/postgresql/15/main/pg_hba.conf` and change the `local` line to use
> `md5` instead of `peer`, then restart PostgreSQL.

---

### 4.3 Backend Setup (Flask)

All commands run from the `backend/` directory.

```bash
cd backend
```

#### Step 1 — Create and activate a Python virtual environment

```bash
# Create the virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate          # macOS / Linux
venv\Scripts\activate             # Windows (cmd)
venv\Scripts\Activate.ps1         # Windows (PowerShell)
```

Your prompt should now show `(venv)`.

#### Step 2 — Install Python dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Step 3 — Configure environment variables

```bash
# Copy the template
cp .env.example .env

# Open and edit .env with your preferred editor
nano .env        # or: code .env  /  vim .env  /  notepad .env
```

Minimum required contents of `.env`:

```dotenv
FLASK_ENV=development
SECRET_KEY=replace-with-a-long-random-string-at-least-32-chars
DATABASE_URL=postgresql://cafe_user:cafe_password@localhost:5432/cafe_fausse
CORS_ORIGINS=http://localhost:3000
```

> **Generate a secure SECRET_KEY:**
> ```bash
> python3 -c "import secrets; print(secrets.token_hex(32))"
> ```

#### Step 4 — Initialise the database tables

Flask-SQLAlchemy's `db.create_all()` is called inside the app factory, so
starting the server is enough. You can also run it manually:

```bash
python3 - <<'EOF'
from app import create_app
from extensions import db
app = create_app()
with app.app_context():
    db.create_all()
    print("Tables created successfully.")
EOF
```

#### Step 5 — Start the Flask development server

```bash
# Option A — using the flask CLI (recommended for development)
flask --app app run --debug --port 5000

# Option B — run app.py directly
python3 app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

Verify the server is healthy:
```bash
curl http://localhost:5000/api/health
# → {"service":"Café Fausse API","status":"ok"}
```

---

### 4.4 Frontend Setup (React)

Open a **new terminal tab/window** and run from the `frontend/` directory.

```bash
cd frontend
```

#### Step 1 — Install Node dependencies

```bash
npm install
```

#### Step 2 — Configure the API proxy (development only)

The `"proxy": "http://localhost:5000"` line in `package.json` already forwards
all `/api/*` requests from the React dev server to Flask — no extra
configuration needed.

If your Flask server runs on a different port, update that line:
```json
"proxy": "http://localhost:YOUR_PORT"
```

#### Step 3 — Start the React development server

```bash
npm start
```

The browser will open automatically at **http://localhost:3000**.

---

### 4.5 Run Both Servers

You need **two terminal sessions** running simultaneously:

| Terminal | Directory  | Command                                    |
|----------|------------|--------------------------------------------|
| 1        | `backend/` | `flask --app app run --debug --port 5000`  |
| 2        | `frontend/`| `npm start`                                |

> **Tip (macOS/Linux):** Use a tool like `tmux` or `concurrently` to manage
> both in one window:
> ```bash
> # From project root — install concurrently once
> npm install -g concurrently
>
> concurrently \
>   "cd backend && flask --app app run --debug --port 5000" \
>   "cd frontend && npm start"
> ```

---

## 5. Environment Variables Reference

| Variable        | Required | Default                                      | Description                              |
|-----------------|----------|----------------------------------------------|------------------------------------------|
| `FLASK_ENV`     | No       | `development`                                | `development`, `production`, `testing`   |
| `SECRET_KEY`    | **Yes**  | `change-me-in-production`                    | Flask session signing key                |
| `DATABASE_URL`  | **Yes**  | `postgresql://cafe_user:cafe_password@localhost:5432/cafe_fausse` | Full PostgreSQL URL |
| `CORS_ORIGINS`  | No       | `http://localhost:3000`                      | Comma-separated allowed frontend origins |

For the **frontend**, create `frontend/.env` to override the API base URL for production:

```dotenv
# frontend/.env.production
REACT_APP_API_URL=https://api.yourdomain.com
```

---

## 6. API Endpoints Reference

Base URL (development): `http://localhost:5000`

### `GET /api/health`
Liveness probe.

```bash
curl http://localhost:5000/api/health
```
```json
{ "service": "Café Fausse API", "status": "ok" }
```

---

### `POST /api/reservations`
Create a table reservation.

**Request body:**
```json
{
  "name":       "Jane Smith",
  "email":      "jane@example.com",
  "phone":      "(202) 555-0000",
  "time_slot":  "2025-08-15T19:00:00",
  "num_guests": 2,
  "newsletter": true
}
```

**Responses:**

| Status | Meaning                          |
|--------|----------------------------------|
| `201`  | Reservation confirmed            |
| `400`  | Validation error                 |
| `409`  | Time slot fully booked           |
| `500`  | Server error                     |

---

### `GET /api/reservations/availability?time_slot=<ISO8601>`
Check how many tables remain for a slot.

```bash
curl "http://localhost:5000/api/reservations/availability?time_slot=2025-08-15T19:00:00"
```
```json
{
  "available_tables": 28,
  "is_available": true,
  "success": true,
  "total_tables": 30
}
```

---

### `POST /api/newsletter`
Subscribe to the newsletter.

**Request body:**
```json
{ "email": "jane@example.com", "name": "Jane Smith" }
```

**Responses:**

| Status | Meaning                 |
|--------|-------------------------|
| `201`  | Successfully subscribed |
| `200`  | Already subscribed      |
| `400`  | Invalid email format    |

---

## 7. Testing

### 7.1 Backend Tests (pytest)

#### Install test dependencies

```bash
cd backend
source venv/bin/activate
pip install pytest pytest-flask pytest-cov
```

#### Create the test suite

Create the file `backend/tests/conftest.py`:

```python
"""pytest fixtures for Café Fausse backend tests."""
import pytest
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
```

Create `backend/tests/test_reservations.py`:

```python
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
```

Create `backend/tests/test_newsletter.py`:

```python
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
```

#### Run the tests

```bash
cd backend
source venv/bin/activate

# Run all tests
pytest tests/ -v

# Run with coverage report
pytest tests/ -v --cov=. --cov-report=term-missing

# Run a specific test file
pytest tests/test_reservations.py -v

# Run a single test by name
pytest tests/test_reservations.py::test_create_reservation_success -v
```

Expected output example:
```
tests/test_reservations.py::test_create_reservation_success  PASSED
tests/test_reservations.py::test_missing_name_returns_400    PASSED
tests/test_reservations.py::test_invalid_email_returns_400   PASSED
tests/test_reservations.py::test_past_timeslot_returns_400   PASSED
tests/test_reservations.py::test_all_tables_booked_returns_409 PASSED
tests/test_reservations.py::test_availability_endpoint       PASSED
tests/test_newsletter.py::test_new_subscription_returns_201  PASSED
tests/test_newsletter.py::test_duplicate_subscription_returns_200 PASSED
tests/test_newsletter.py::test_empty_email_returns_400       PASSED
tests/test_newsletter.py::test_invalid_email_returns_400     PASSED
====== 10 passed in 1.42s ======
```

---

### 7.2 Frontend Tests (React Testing Library)

React Testing Library is included with `react-scripts`.

```bash
cd frontend

# Run all tests (interactive watch mode)
npm test

# Run once and exit (useful for CI)
CI=true npm test

# Run with coverage
CI=true npm test -- --coverage --watchAll=false
```

---

### 7.3 Manual API Testing with curl

Use these commands to manually test the running API:

```bash
# Health check
curl -s http://localhost:5000/api/health | python3 -m json.tool

# Create a reservation (replace time_slot with a future datetime)
curl -s -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "(202) 555-0001",
    "time_slot": "2025-08-20T19:00:00",
    "num_guests": 3,
    "newsletter": true
  }' | python3 -m json.tool

# Check availability for a slot
curl -s "http://localhost:5000/api/reservations/availability?time_slot=2025-08-20T19:00:00" \
  | python3 -m json.tool

# Newsletter sign-up
curl -s -X POST http://localhost:5000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}' \
  | python3 -m json.tool

# Test validation — missing name
curl -s -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "time_slot": "2025-08-20T19:00:00", "num_guests": 2}' \
  | python3 -m json.tool
```

---

## 8. Production Deployment

### 8.1 Option A — Single Server (Nginx + Gunicorn)

This is the recommended approach for a VPS (DigitalOcean, Linode, AWS EC2, etc.).

#### Prerequisites on the server

```bash
# Ubuntu 22.04 LTS example
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv \
                    nodejs npm postgresql \
                    nginx git
```

#### Step 1 — Clone and configure

```bash
cd /var/www
sudo git clone https://github.com/your-org/cafe-fausse.git
sudo chown -R $USER:$USER /var/www/cafe-fausse
cd /var/www/cafe-fausse
```

#### Step 2 — Backend production setup

```bash
cd /var/www/cafe-fausse/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create production .env
cat > .env <<EOF
FLASK_ENV=production
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
DATABASE_URL=postgresql://cafe_user:STRONG_PASSWORD@localhost:5432/cafe_fausse
CORS_ORIGINS=https://yourdomain.com
EOF
```

#### Step 3 — Build the React frontend

```bash
cd /var/www/cafe-fausse/frontend

# Set the production API URL
cat > .env.production <<EOF
REACT_APP_API_URL=https://yourdomain.com
EOF

npm install
npm run build       # outputs to frontend/build/
```

#### Step 4 — Create a systemd service for Gunicorn

```bash
sudo nano /etc/systemd/system/cafe-fausse.service
```

Paste:

```ini
[Unit]
Description=Café Fausse Flask API (Gunicorn)
After=network.target postgresql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/cafe-fausse/backend
EnvironmentFile=/var/www/cafe-fausse/backend/.env
ExecStart=/var/www/cafe-fausse/backend/venv/bin/gunicorn \
    "app:create_app()" \
    --workers 4 \
    --bind 127.0.0.1:5000 \
    --access-logfile /var/log/cafe-fausse/access.log \
    --error-logfile /var/log/cafe-fausse/error.log \
    --timeout 30
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# Create log directory
sudo mkdir -p /var/log/cafe-fausse
sudo chown www-data:www-data /var/log/cafe-fausse

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable cafe-fausse
sudo systemctl start cafe-fausse

# Verify it's running
sudo systemctl status cafe-fausse
```

#### Step 5 — Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/cafe-fausse
```

Paste:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Serve React build (static files)
    root /var/www/cafe-fausse/frontend/build;
    index index.html;

    # React Router — return index.html for all non-API, non-asset routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy /api/* to Gunicorn
    location /api/ {
        proxy_pass         http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_connect_timeout 10s;
        proxy_read_timeout    30s;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1024;

    # Cache static assets for 1 year
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/cafe-fausse /etc/nginx/sites-enabled/

# Test the Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### Step 6 — Add HTTPS with Let's Encrypt (Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot auto-renewal test
sudo certbot renew --dry-run
```

---

### 8.2 Option B — Docker Compose

For a fully containerised deployment.

#### Step 1 — Create `docker-compose.yml` in the project root

```yaml
version: "3.9"

services:
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB:       cafe_fausse
      POSTGRES_USER:     cafe_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cafe_user -d cafe_fausse"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      FLASK_ENV:      production
      SECRET_KEY:     ${SECRET_KEY}
      DATABASE_URL:   postgresql://cafe_user:${DB_PASSWORD}@db:5432/cafe_fausse
      CORS_ORIGINS:   http://localhost,https://yourdomain.com
    ports:
      - "5000:5000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        REACT_APP_API_URL: ""    # Empty = same origin via Nginx
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### Step 2 — Create `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "app:create_app()", \
     "--workers", "4", \
     "--bind", "0.0.0.0:5000", \
     "--timeout", "30"]
```

#### Step 3 — Create `frontend/Dockerfile`

```dockerfile
# ── Build stage ──────────────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# ── Production stage (Nginx) ─────────────────────────────────────
FROM nginx:1.25-alpine

# Copy React build output
COPY --from=build /app/build /usr/share/nginx/html

# Nginx config for React Router + API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Step 4 — Create `frontend/nginx.conf`

```nginx
server {
    listen 80;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

#### Step 5 — Create `.env` at project root (Docker secrets)

```bash
cat > .env <<EOF
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
DB_PASSWORD=choose-a-strong-password
EOF
```

#### Step 6 — Build and start all containers

```bash
# Build images and start in background
docker compose up --build -d

# View logs
docker compose logs -f

# Check service status
docker compose ps

# Stop all services
docker compose down

# Stop and remove volumes (resets the database)
docker compose down -v
```

---

## 9. Database Management

### Inspect data with psql

```bash
# Connect to the database
psql -U cafe_user -d cafe_fausse -h localhost

# Inside psql:
\dt                                  -- list all tables
SELECT * FROM customers LIMIT 10;
SELECT * FROM reservations LIMIT 10;

-- Count reservations per time slot
SELECT time_slot, COUNT(*) AS bookings
FROM reservations
GROUP BY time_slot
ORDER BY time_slot;

-- Find available tables for a specific slot
SELECT generate_series(1,30) AS table_no
EXCEPT
SELECT table_number FROM reservations
WHERE time_slot = '2025-08-20 19:00:00';

\q                                   -- exit
```

### Backup and restore

```bash
# Backup
pg_dump -U cafe_user -d cafe_fausse -F c -f cafe_fausse_backup.dump

# Restore
pg_restore -U cafe_user -d cafe_fausse -F c cafe_fausse_backup.dump

# Plain SQL dump
pg_dump -U cafe_user -d cafe_fausse > cafe_fausse_$(date +%Y%m%d).sql
```

---

## 10. Troubleshooting

### Flask server won't start

```bash
# Check Python version (must be 3.11+)
python3 --version

# Confirm virtual env is active
which python3       # should point to venv/bin/python3

# Check for import errors
python3 -c "from app import create_app; print('OK')"

# Check .env was loaded
python3 -c "from config import active_config; print(active_config.DATABASE_URL)"
```

### PostgreSQL connection refused

```bash
# Is PostgreSQL running?
sudo systemctl status postgresql       # Linux
brew services list | grep postgresql   # macOS

# Test connection directly
psql -U cafe_user -d cafe_fausse -h localhost -c "SELECT 1"

# Check PostgreSQL is listening on the right port
sudo ss -tlnp | grep 5432
```

### React app shows a blank page in production

```bash
# Verify the build was created
ls frontend/build/

# Check Nginx is serving the right root
sudo nginx -T | grep root

# Check browser console for 404 errors on /api/* (proxy misconfiguration)
curl -I http://yourdomain.com/api/health
```

### CORS errors in browser console

```bash
# The CORS_ORIGINS env var must exactly match the frontend origin
# (including protocol and port — no trailing slash)
# e.g.:  CORS_ORIGINS=https://yourdomain.com
# NOT:   CORS_ORIGINS=https://yourdomain.com/

# Restart Flask after changing .env
sudo systemctl restart cafe-fausse
```

### npm install fails (Node version mismatch)

```bash
# Check Node version
node --version     # must be 18+

# Switch using nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

---

## 11. Security Checklist

Before going live, confirm each item:

- [ ] `SECRET_KEY` is at least 32 random characters and **never** committed to git
- [ ] `DATABASE_URL` password is strong (20+ chars, mixed types)
- [ ] `.env` is listed in `.gitignore`
- [ ] `FLASK_ENV=production` (disables debug mode and detailed error pages)
- [ ] `CORS_ORIGINS` is set to your exact frontend origin, not `*`
- [ ] HTTPS is enabled via Certbot or your cloud provider's SSL termination
- [ ] PostgreSQL is not exposed to the public internet (firewall rule)
- [ ] Gunicorn runs as `www-data`, not `root`
- [ ] Nginx security headers are set (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)
- [ ] Regular database backups are scheduled (`cron` or cloud snapshot)
- [ ] `npm audit` shows no high/critical vulnerabilities in frontend deps

---

*Café Fausse — Founded 2010 · Washington, D.C.*
