"""
Seed script — writes default data to data/site.json.
Run: python scripts/seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.engine.storage import load_site_data, save_site_data
from api.models.defaults import DEFAULTS

if __name__ == "__main__":
    save_site_data(DEFAULTS)
    print("✓ Seeded data/site.json with defaults")
