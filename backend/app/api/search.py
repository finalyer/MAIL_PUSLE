from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.gmail_repository import GmailRepository
from app.repositories.email_repository import EmailRepository
from app.schemas.email import PaginatedEmails
from app.api.auth import get_current_user_id

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("", response_model=PaginatedEmails)
def search_emails(
    request: Request,
    q: str = "",
    page: int = 1,
    page_size: int = 50,
    db: Session = Depends(get_db),
):
    user_id = get_current_user_id(request)
    gmail_repo = GmailRepository(db)
    account = gmail_repo.get_by_user_id(user_id)
    if not account:
        raise HTTPException(status_code=404, detail="No Gmail account connected")

    email_repo = EmailRepository(db)
    items, total, pages = email_repo.search(account.id, q, page=page, page_size=page_size)
    return PaginatedEmails(items=items, total=total, page=page, page_size=page_size, pages=pages)
