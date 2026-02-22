"""
Simple validator for site data.
Checks required fields and basic types.
"""

def validate_site_data(data: dict) -> list:
    """Validate site data structure. Returns a list of error strings."""
    errors = []

    if not isinstance(data, dict):
        return ["Root must be an object"]

    # Check required top-level sections
    required_sections = ["meta", "hero"]
    for section in required_sections:
        if section not in data:
            errors.append(f"Missing required section: {section}")

    # Validate meta
    if "meta" in data:
        meta = data["meta"]
        if not isinstance(meta, dict):
            errors.append("meta must be an object")
        else:
            if "title" not in meta:
                errors.append("meta.title is required")
            if "description" not in meta:
                errors.append("meta.description is required")

    # Validate hero
    if "hero" in data:
        hero = data["hero"]
        if not isinstance(hero, dict):
            errors.append("hero must be an object")
        else:
            for field in ["greeting", "name", "tagline"]:
                if field not in hero:
                    errors.append(f"hero.{field} is required")

    # Validate array sections
    for section in ["skills", "projects", "experience"]:
        if section in data and not isinstance(data[section], list):
            errors.append(f"{section} must be an array")

    # Validate projects have required fields
    if "projects" in data and isinstance(data["projects"], list):
        for i, project in enumerate(data["projects"]):
            if not isinstance(project, dict):
                errors.append(f"projects[{i}] must be an object")
            else:
                if "title" not in project:
                    errors.append(f"projects[{i}].title is required")
                if "description" not in project:
                    errors.append(f"projects[{i}].description is required")

    # Validate skills have required fields
    if "skills" in data and isinstance(data["skills"], list):
        for i, skill in enumerate(data["skills"]):
            if not isinstance(skill, dict):
                errors.append(f"skills[{i}] must be an object")
            else:
                if "category" not in skill:
                    errors.append(f"skills[{i}].category is required")
                if "items" not in skill:
                    errors.append(f"skills[{i}].items is required")

    # Validate experience
    if "experience" in data and isinstance(data["experience"], list):
        for i, exp in enumerate(data["experience"]):
            if not isinstance(exp, dict):
                errors.append(f"experience[{i}] must be an object")
            else:
                for field in ["role", "company", "period"]:
                    if field not in exp:
                        errors.append(f"experience[{i}].{field} is required")

    return errors
