from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.gmail_repository import GmailRepository
from app.repositories.thread_repository import ThreadRepository
from app.repositories.email_repository import EmailRepository
from app.repositories.user_repository import UserRepository
from app.schemas.thread import PaginatedThreads, ThreadRead
from app.api.auth import get_current_user_id
import math

router = APIRouter(prefix="/api/threads", tags=["threads"])


def _get_account(user_id, db: Session):
    gmail_repo = GmailRepository(db)
    account = gmail_repo.get_by_user_id(user_id)
    if not account:
        raise HTTPException(status_code=404, detail="No Gmail account connected")
    return account


@router.get("", response_model=PaginatedThreads)
def list_threads(
    request: Request,
    page: int = 1,
    page_size: int = 50,
    db: Session = Depends(get_db),
):
    user_id = get_current_user_id(request)
    account = _get_account(user_id, db)
    thread_repo = ThreadRepository(db)
    items, total, pages = thread_repo.list_paginated(account.id, page=page, page_size=page_size)
    return PaginatedThreads(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{thread_id}", response_model=ThreadRead)
def get_thread(thread_id: str, request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user_id(request)
    account = _get_account(user_id, db)
    thread_repo = ThreadRepository(db)
    thread = thread_repo.get_by_id(thread_id)
    if not thread or str(thread.gmail_account_id) != str(account.id):
        raise HTTPException(status_code=404, detail="Thread not found")
    return thread
