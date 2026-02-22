"""
Public-facing API routes.
Serves site data for the frontend renderer.
"""
from flask import Blueprint, jsonify
from api.engine.storage import load_site_data

pages_bp = Blueprint("pages", __name__)


@pages_bp.route("/site", methods=["GET"])
def get_site():
    """Return the full site configuration as JSON."""
    data = load_site_data()
    return jsonify(data)


@pages_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok"})
