from backend.app.mcp_app import mcp_app
from backend.app.routers import user_router
from fastapi import FastAPI

app = FastAPI(title="FastAPI + Supabase", lifespan=mcp_app.lifespan)

app.include_router(user_router.router)

app.mount("/tools/", mcp_app)
