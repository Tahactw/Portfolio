"""
Site data schema definition.
Defines the expected shape of site.json.
"""

SCHEMA = {
    "meta": {
        "type": "object",
        "required": ["title", "description"],
        "properties": {
            "title": {"type": "string"},
            "description": {"type": "string"},
            "favicon": {"type": "string"},
            "ogImage": {"type": "string"},
            "themeColor": {"type": "string"},
        }
    },
    "hero": {
        "type": "object",
        "required": ["greeting", "name", "tagline"],
        "properties": {
            "greeting": {"type": "string"},
            "name": {"type": "string"},
            "tagline": {"type": "string"},
            "cta": {
                "type": "object",
                "properties": {
                    "text": {"type": "string"},
                    "href": {"type": "string"},
                }
            }
        }
    },
    "about": {
        "type": "object",
        "required": ["heading", "paragraphs"],
        "properties": {
            "heading": {"type": "string"},
            "paragraphs": {"type": "array", "items": {"type": "string"}},
            "image": {"type": "string"},
        }
    },
    "skills": {
        "type": "array",
        "items": {
            "type": "object",
            "required": ["category", "items"],
            "properties": {
                "category": {"type": "string"},
                "icon": {"type": "string"},
                "items": {"type": "array", "items": {"type": "string"}},
            }
        }
    },
    "projects": {
        "type": "array",
        "items": {
            "type": "object",
            "required": ["title", "description"],
            "properties": {
                "title": {"type": "string"},
                "description": {"type": "string"},
                "image": {"type": "string"},
                "images": {"type": "array", "items": {"type": "string"}},
                "youtube": {"type": "string"},
                "modelUrl": {"type": "string"},
                "tags": {"type": "array", "items": {"type": "string"}},
                "link": {"type": "string"},
                "github": {"type": "string"},
                "featured": {"type": "boolean"},
            }
        }
    },
    "experience": {
        "type": "array",
        "items": {
            "type": "object",
            "required": ["role", "company", "period"],
            "properties": {
                "role": {"type": "string"},
                "company": {"type": "string"},
                "period": {"type": "string"},
                "description": {"type": "string"},
                "highlights": {"type": "array", "items": {"type": "string"}},
            }
        }
    },
    "contact": {
        "type": "object",
        "required": ["heading"],
        "properties": {
            "heading": {"type": "string"},
            "subtext": {"type": "string"},
            "email": {"type": "string"},
            "social": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "platform": {"type": "string"},
                        "url": {"type": "string"},
                        "icon": {"type": "string"},
                    }
                }
            }
        }
    },
    "settings": {
        "type": "object",
        "properties": {
            "particleCount": {"type": "number"},
            "cursorGlow": {"type": "boolean"},
            "smoothScroll": {"type": "boolean"},
            "animationSpeed": {"type": "number"},
            "theme": {"type": "string"},
        }
    }
}
