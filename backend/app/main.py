from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.models import *  # Register all models

# Import API routers
from app.api import auth, threads, emails, search, analytics, sync

# Create all tables (Alembic manages schema, this ensures tables exist on startup)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MailPulse API",
    description="AI-powered Gmail Analytics & Intelligence platform",
    version="1.0.0",
)

# Session middleware (for OAuth state and user session)
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# CORS — allow local frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(threads.router)
app.include_router(emails.router)
app.include_router(search.router)
app.include_router(analytics.router)
app.include_router(sync.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "MailPulse API", "version": "1.0.0"}
