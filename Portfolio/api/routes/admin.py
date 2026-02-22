"""
Admin API routes.
CRUD operations on site data, protected by auth token.
"""
from flask import Blueprint, jsonify, request
from api.auth import require_auth
from api.engine.storage import load_site_data, save_site_data
from api.engine.validator import validate_site_data

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/site", methods=["GET"])
@require_auth
def get_site():
    """Return current site data for editing."""
    data = load_site_data()
    return jsonify(data)


@admin_bp.route("/site", methods=["PUT"])
@require_auth
def update_site():
    """Replace entire site data."""
    new_data = request.get_json()
    if not new_data:
        return jsonify({"error": "Invalid JSON body"}), 400

    errors = validate_site_data(new_data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 422

    save_site_data(new_data)
    return jsonify({"status": "saved"})


@admin_bp.route("/site/<section>", methods=["PUT"])
@require_auth
def update_section(section):
    """Update a single section of site data."""
    data = load_site_data()
    new_section = request.get_json()

    if not new_section:
        return jsonify({"error": "Invalid JSON body"}), 400

    if section not in data and section not in ("meta", "hero", "about", "skills", "projects", "experience", "contact", "settings"):
        return jsonify({"error": f"Unknown section: {section}"}), 400

    data[section] = new_section
    errors = validate_site_data(data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 422

    save_site_data(data)
    return jsonify({"status": "saved", "section": section})


@admin_bp.route("/site/<section>/<int:index>", methods=["PUT"])
@require_auth
def update_item(section, index):
    """Update a single item within an array section (projects, skills, experience)."""
    data = load_site_data()
    if section not in data or not isinstance(data[section], list):
        return jsonify({"error": f"Section '{section}' is not an array"}), 400

    if index < 0 or index >= len(data[section]):
        return jsonify({"error": f"Index {index} out of range"}), 400

    item = request.get_json()
    if not item:
        return jsonify({"error": "Invalid JSON body"}), 400

    data[section][index] = item
    save_site_data(data)
    return jsonify({"status": "saved", "section": section, "index": index})


@admin_bp.route("/site/<section>/reorder", methods=["POST"])
@require_auth
def reorder_section(section):
    """Reorder items in an array section."""
    data = load_site_data()
    if section not in data or not isinstance(data[section], list):
        return jsonify({"error": f"Section '{section}' is not an array"}), 400

    order = request.get_json()
    if not isinstance(order, list):
        return jsonify({"error": "Body must be an array of indices"}), 400

    try:
        data[section] = [data[section][i] for i in order]
    except (IndexError, TypeError):
        return jsonify({"error": "Invalid index in order array"}), 400

    save_site_data(data)
    return jsonify({"status": "reordered", "section": section})
