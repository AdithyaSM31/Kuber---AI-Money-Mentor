import os
from supabase import create_async_client
import structlog

logger = structlog.get_logger()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

async def get_supabase():
    return await create_async_client(SUPABASE_URL, SUPABASE_KEY)

async def save_health_score(data: dict):
    if not SUPABASE_URL: return
    try:
        client = await get_supabase()
        await client.table("health_scores").insert(data).execute()
        logger.info("health_score_saved_db", score_id=data["id"])
    except Exception as e:
        logger.error("supabase_save_error", error=str(e), table="health_scores")

async def save_financial_profile(data: dict):
    if not SUPABASE_URL: return
    try:
        client = await get_supabase()
        await client.table("financial_profiles").upsert(data, on_conflict="user_id").execute()
        logger.info("financial_profile_saved_db", user_id=data["user_id"])
    except Exception as e:
        logger.error("supabase_save_error", error=str(e), table="financial_profiles")

