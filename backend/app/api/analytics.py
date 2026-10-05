from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.gmail_repository import GmailRepository
from app.repositories.email_repository import EmailRepository
from app.api.auth import get_current_user_id

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/overview")
def analytics_overview(request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user_id(request)
    gmail_repo = GmailRepository(db)
    account = gmail_repo.get_by_user_id(user_id)
    if not account:
        raise HTTPException(status_code=404, detail="No Gmail account connected")

    email_repo = EmailRepository(db)
    stats = email_repo.get_analytics(account.id)
    return {
        "success": True,
        "data": stats,
        "account": {
            "gmail_email": account.gmail_email,
            "sync_status": account.sync_status,
            "last_synced_at": account.last_synced_at,
        },
    }
