from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import threading
import uuid
import datetime
import os

from app.core.database import get_db, SessionLocal
from app.services.oauth_service import get_authorization_url, exchange_code, get_user_info
from app.repositories.user_repository import UserRepository
from app.repositories.gmail_repository import GmailRepository
from app.schemas.user import UserRead

router = APIRouter(prefix="/api/auth", tags=["auth"])

SESSION_USER_KEY = "user_id"
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def get_current_user_id(request: Request) -> str:
    user_id = request.session.get(SESSION_USER_KEY)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_id


def _schedule_initial_sync(gmail_account_id: str):
    """Kick off an INITIAL_SYNC in a background thread after OAuth completes."""
    from app.models.sync_job import SyncJob
    from app.models.gmail_account import GmailAccount
    from app.services.gmail_sync_service import GmailSyncService

    def _run():
        db: Session = SessionLocal()
        try:
            account = db.query(GmailAccount).filter(
                GmailAccount.id == uuid.UUID(gmail_account_id)
            ).first()
            if not account:
                return
            # Skip if a sync is already in progress
            running = db.query(SyncJob).filter(
                SyncJob.gmail_account_id == account.id,
                SyncJob.status.in_(["PENDING", "RUNNING"]),
            ).first()
            if running:
                return

            job = SyncJob(
                id=uuid.uuid4(),
                gmail_account_id=account.id,
                job_type="INITIAL_SYNC",
                status="PENDING",
                created_at=datetime.datetime.utcnow(),
            )
            account.sync_status = "SYNCING"
            db.add(job)
            db.commit()

            service = GmailSyncService(db, account)
            service.run_sync(job)
        except Exception:
            import logging
            logging.getLogger(__name__).exception(
                "Initial sync failed for account %s", gmail_account_id
            )
        finally:
            db.close()

    threading.Thread(target=_run, daemon=True).start()


@router.get("/google")
def google_login(request: Request):
    """Redirect user to Google OAuth."""
    auth_url, state = get_authorization_url()
    request.session["oauth_state"] = state
    return RedirectResponse(url=auth_url)


@router.get("/google/callback")
def google_callback(request: Request, code: str, state: str, db: Session = Depends(get_db)):
    """Handle Google OAuth callback, store tokens, create session, trigger initial sync."""
    try:
        token_data = exchange_code(code, state)
        user_info = get_user_info(token_data["access_token"])

        user_repo = UserRepository(db)
        gmail_repo = GmailRepository(db)

        user = user_repo.upsert(
            google_user_id=user_info["id"],
            email=user_info["email"],
            name=user_info.get("name", ""),
            picture=user_info.get("picture", ""),
        )

        gmail_account = gmail_repo.upsert(
            user_id=user.id,
            gmail_email=user_info["email"],
            access_token=token_data["access_token"],
            refresh_token=token_data.get("refresh_token"),
            token_expiry=token_data["token_expiry"],
            scopes=token_data["scopes"],
        )

        request.session[SESSION_USER_KEY] = str(user.id)

        # Auto-trigger initial sync in background
        _schedule_initial_sync(str(gmail_account.id))

        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth failed: {str(e)}")


@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"success": True, "message": "Logged out"}


@router.get("/me", response_model=UserRead)
def get_me(request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user_id(request)
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
