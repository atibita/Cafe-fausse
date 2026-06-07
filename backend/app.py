"""
app.py — Café Fausse Flask Application Entry Point
====================================================
Uses the application-factory pattern so the app can be created with
different configurations (development, testing, production).

Usage:
    # Development
    flask --app app run --debug

    # Production (with gunicorn)
    gunicorn "app:create_app()" --bind 0.0.0.0:5000
"""

from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

from config import active_config
from extensions import db
from routes.reservations import reservations_bp
from routes.newsletter import newsletter_bp


def create_app(config_object=None):
    """
    Flask application factory.

    Args:
        config_object: Optional config class to override the default.
                       Useful for injecting TestingConfig in unit tests.

    Returns:
        A fully configured Flask application instance.
    """
    app = Flask(__name__)

    # ── Configuration ─────────────────────────────────────────────────────────
    app.config.from_object(config_object or active_config) 

    # ── Extensions ────────────────────────────────────────────────────────────
    db.init_app(app)

    # Enable Cross-Origin Resource Sharing for the React dev server and the
    # production frontend origin defined in CORS_ORIGINS.
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "*"
            }
        },
    )

    # ── Blueprints ────────────────────────────────────────────────────────────
    app.register_blueprint(reservations_bp)
    app.register_blueprint(newsletter_bp)

    # ── Database initialisation ───────────────────────────────────────────────
    with app.app_context():
        # print(app.config['SQLALCHEMY_DATABASE_URI'])
        db.create_all()           # Creates tables if they don't already exist

    # ── Health-check endpoint ─────────────────────────────────────────────────
    @app.route("/api/health", methods=["GET"])
    def health_check():
        """Simple liveness probe used by load-balancers and CI pipelines."""
        return jsonify({"status": "ok", "service": "Café Fausse API"}), 200

    # ── Global error handlers ─────────────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"success": False, "message": "Endpoint not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return (
            jsonify({"success": False, "message": "HTTP method not allowed."}),
            405,
        )

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()     # Roll back any open transaction
        return (
            jsonify(
                {
                    "success": False,
                    "message": "An unexpected server error occurred. Please try again.",
                }
            ),
            500,
        )

    return app


# ── Development entry point ───────────────────────────────────────────────────
if __name__ == "__main__":
    application = create_app()
    application.run(host="127.0.0.1", port=5000, debug=True)
