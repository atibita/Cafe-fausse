"""
config.py — Café Fausse Flask configuration
Loads settings from environment variables with safe fallback defaults.
"""

import os
import urllib.parse
from dotenv import load_dotenv

# Load variables from a .env file if present (local development)
load_dotenv()

#database_url = os.getenv("DATABASE_URL")
#api_key = os.getenv("SECRET_KEY")

#print(database_url)
#print(api_key)

class Config:
    """Base configuration shared by all environments."""

    # ── Flask ────────────────────────────────────────────────────────────────
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret-key")
    DEBUG: bool = False
    TESTING: bool = False

    # ── Database ─────────────────────────────────────────────────────────────
    # Full PostgreSQL connection string, e.g.:
    #   postgresql://user:password@localhost:5432/cafe_fausse
    user = "cafe_user"
    # Password containing an @ symbol
    # password = urllib.parse.quote_plus("Password") 
    # host = "127.0.0.1"
    # db = "cafe_fausse"

    # SQLALCHEMY_DATABASE_URI = (f"postgresql+psycopg2://{user}:{password}@{host}:5432/{db}")

    SQLALCHEMY_DATABASE_URI: str = os.getenv(
         "DATABASE_URL",
         "postgresql://user:Password@127.0.0.1:5432/cafe_fausse",
     )
    
    # print(SQLALCHEMY_DATABASE_URI)

    # Disable modification tracking overhead (recommended)
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # ── CORS ─────────────────────────────────────────────────────────────────
    # Comma-separated list of allowed frontend origins
    CORS_ORIGINS: list = os.getenv(
        "CORS_ORIGINS", "http://127.0.0.1:3000"
        
    ).split(",")

    # print(CORS_ORIGINS)

    # ── Restaurant constants ──────────────────────────────────────────────────
    TOTAL_TABLES: int = 30          # Total tables available per time slot


class DevelopmentConfig(Config):
    """Development-specific configuration."""
    DEBUG: bool = True


class ProductionConfig(Config):
    """Production-specific configuration."""
    DEBUG: bool = False


class TestingConfig(Config):
    """Testing configuration uses an in-memory SQLite DB."""
    TESTING: bool = True
    #SQLALCHEMY_DATABASE_URI: str = "sqlite:///:memory:"


# Map string names to config classes so the factory can select them
config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}

# Active configuration determined by FLASK_ENV env var (default: development)
active_config = config_map.get(
    os.getenv("FLASK_ENV", "development"), DevelopmentConfig
)
