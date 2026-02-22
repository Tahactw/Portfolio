"""
Vercel serverless entry-point.
Maps every incoming request through Flask.
"""
from flask import Flask, send_from_directory, send_file
from api.routes.pages import pages_bp
from api.routes.admin import admin_bp
import os

app = Flask(__name__, static_folder=None)

# ── blueprints ──────────────────────────────────────────────
app.register_blueprint(pages_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api/admin")

# ── static file serving (Vercel handles this via vercel.json,
#    but this works for local dev) ───────────────────────────
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

@app.route("/")
def serve_index():
    return send_from_directory(os.path.join(ROOT, "public"), "index.html")

@app.route("/<path:filename>")
def serve_public(filename):
    public_dir = os.path.join(ROOT, "public")
    filepath = os.path.join(public_dir, filename)
    if os.path.isfile(filepath):
        return send_from_directory(public_dir, filename)
    # Try admin
    admin_dir = os.path.join(ROOT, "admin")
    filepath = os.path.join(admin_dir, filename)
    if os.path.isfile(filepath):
        return send_from_directory(admin_dir, filename)
    return "Not found", 404

@app.route("/admin")
@app.route("/admin/")
def serve_admin():
    return send_from_directory(os.path.join(ROOT, "admin"), "index.html")

@app.route("/admin/<path:filename>")
def serve_admin_static(filename):
    return send_from_directory(os.path.join(ROOT, "admin"), filename)

# Vercel expects `app` at module level
