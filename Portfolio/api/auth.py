"""
Simple token-based authentication for the admin API.
Uses ADMIN_TOKEN environment variable.
"""
import os
import hashlib
import hmac
from functools import wraps
from flask import request, jsonify

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "dev-token-change-me")


def require_auth(f):
    """Decorator that checks for a valid Bearer token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing authorization header"}), 401

        token = auth_header[7:]
        if not hmac.compare_digest(token, ADMIN_TOKEN):
            return jsonify({"error": "Invalid token"}), 403

        return f(*args, **kwargs)
    return decorated


def hash_token(token: str) -> str:
    """Hash a token for safe comparison."""
    return hashlib.sha256(token.encode()).hexdigest()
