from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.gmail_repository import GmailRepository
from app.repositories.email_repository import EmailRepository
from app.schemas.email import PaginatedEmails, EmailRead, EmailListItem
from app.api.auth import get_current_user_id

router = APIRouter(prefix="/api/emails", tags=["emails"])


def _get_account(user_id, db: Session):
    gmail_repo = GmailRepository(db)
    account = gmail_repo.get_by_user_id(user_id)
    if not account:
        raise HTTPException(status_code=404, detail="No Gmail account connected")
    return account


@router.get("", response_model=PaginatedEmails)
def list_emails(
    request: Request,
    page: int = 1,
    page_size: int = 200,
    thread_id: str = None,
    direction: str = None,
    is_read: bool = None,
    is_starred: bool = None,
    is_important: bool = None,
    db: Session = Depends(get_db),
):
    user_id = get_current_user_id(request)
    account = _get_account(user_id, db)
    email_repo = EmailRepository(db)
    items, total, pages = email_repo.list_paginated(
        account.id,
        page=page,
        page_size=page_size,
        thread_id=thread_id,
        direction=direction,
        is_read=is_read,
        is_starred=is_starred,
        is_important=is_important,
    )
    return PaginatedEmails(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{email_id}", response_model=EmailRead)
def get_email(email_id: str, request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user_id(request)
    account = _get_account(user_id, db)
    email_repo = EmailRepository(db)
    email = email_repo.get_by_id(email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    # Security: ensure email belongs to user's account
    if str(email.thread.gmail_account_id) != str(account.id):
        raise HTTPException(status_code=403, detail="Forbidden")
    return email
