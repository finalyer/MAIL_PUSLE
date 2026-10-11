from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app import models  # noqa: F401 - Register all SQLAlchemy models
from app.api import analytics, auth, emails, search, sync, threads
from app.core.config import settings
from app.core.database import Base, engine

# Create all tables (Alembic manages schema; ensures tables exist on startup)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MailPulse API",
    description="AI-powered Gmail Analytics & Intelligence platform",
    version="1.0.0",
)

# Session middleware (for OAuth state and user session)
# same_site="lax" + https_only=False is required for local dev / proxy
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    same_site="lax",
    https_only=False,
    max_age=86400,  # 1 day
)

# CORS — allow local frontend dev server and tunnels
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|.*\.trycloudflare\.com|.*\.vercel\.app)(:\d+)?$",
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
