"""Flask application entrypoint."""

from __future__ import annotations

from flask import Flask
from flask_cors import CORS

from routes.health import health_bp


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(health_bp)
    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
