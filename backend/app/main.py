from backend.app.mcp_app import mcp_app
from backend.app.routers import user_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FastAPI + Supabase", lifespan=mcp_app.lifespan, )

origins = [
        "http://localhost:3000",
        "https://pegueopumba.com.br",
    ]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
        allow_headers=["*"],  # Allows all headers
    )

app.include_router(user_router.router)

app.mount("/tools/", mcp_app)
