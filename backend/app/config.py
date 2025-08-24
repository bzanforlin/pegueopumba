from pathlib import Path

from dotenv import dotenv_values

BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"

config = dotenv_values(env_path)

SUPABASE_URL = config.get("SUPABASE_URL")
SUPABASE_KEY = config.get("SUPABASE_KEY")

# WhatsApp Business API configuration
WHATSAPP_ACCESS_TOKEN = config.get("WHATSAPP_ACCESS_TOKEN")
WHATSAPP_PHONE_NUMBER_ID = config.get("WHATSAPP_PHONE_NUMBER_ID")
WHATSAPP_BUSINESS_ACCOUNT_ID = config.get("WHATSAPP_BUSINESS_ACCOUNT_ID")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(f"Missing Supabase credentials in {env_path}")

if not WHATSAPP_ACCESS_TOKEN or not WHATSAPP_PHONE_NUMBER_ID:
    print(
        f"Warning: Missing WhatsApp Business API credentials in {env_path}. WhatsApp messaging will be disabled."
    )
