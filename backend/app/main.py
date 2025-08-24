from fastapi import FastAPI
from backend.app.routers import user_router, occurrence_router

app = FastAPI(title="FastAPI + Supabase")

app.include_router(user_router.router)
app.include_router(occurrence_router.router)
