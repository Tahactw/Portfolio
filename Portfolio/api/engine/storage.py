"""
Storage engine — reads/writes site.json.
In production on Vercel, the filesystem is read-only so we fall back to defaults.
For persistence, swap this for a database or KV store.
"""
import json
import os
import copy
from api.models.defaults import DEFAULTS

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
DATA_FILE = os.path.join(DATA_DIR, "site.json")

_cache = None


def load_site_data() -> dict:
    """Load site data from file, falling back to defaults."""
    global _cache
    if _cache is not None:
        return copy.deepcopy(_cache)

    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                _cache = json.load(f)
                return copy.deepcopy(_cache)
        except (json.JSONDecodeError, IOError):
            pass

    _cache = copy.deepcopy(DEFAULTS)
    # Try to write defaults to file
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(_cache, f, indent=2)
    except IOError:
        pass  # Read-only filesystem (Vercel)

    return copy.deepcopy(_cache)


def save_site_data(data: dict) -> bool:
    """Save site data to file."""
    global _cache
    _cache = copy.deepcopy(data)
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except IOError:
        return False


def reset_cache():
    """Clear cached data to force reload."""
    global _cache
    _cache = None
