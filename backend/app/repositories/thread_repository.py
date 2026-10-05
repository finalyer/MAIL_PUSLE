from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, func, or_
from app.models.thread import EmailThread
from app.models.email import Email
from typing import Optional
import math


class ThreadRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_gmail_thread_id(self, gmail_account_id, gmail_thread_id: str) -> EmailThread | None:
        return (
            self.db.query(EmailThread)
            .filter(
                EmailThread.gmail_account_id == gmail_account_id,
                EmailThread.gmail_thread_id == gmail_thread_id,
            )
            .first()
        )

    def get_by_id(self, thread_id) -> EmailThread | None:
        return self.db.query(EmailThread).filter(EmailThread.id == thread_id).first()

    def list_paginated(self, gmail_account_id, page: int = 1, page_size: int = 50):
        query = (
            self.db.query(EmailThread)
            .filter(EmailThread.gmail_account_id == gmail_account_id)
            .order_by(desc(EmailThread.last_message_at))
        )
        total = query.count()
        items = query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total, math.ceil(total / page_size) if total else 0

    def upsert(self, gmail_account_id, gmail_thread_id: str, **kwargs) -> EmailThread:
        thread = self.get_by_gmail_thread_id(gmail_account_id, gmail_thread_id)
        if thread:
            for k, v in kwargs.items():
                setattr(thread, k, v)
        else:
            thread = EmailThread(
                gmail_account_id=gmail_account_id,
                gmail_thread_id=gmail_thread_id,
                **kwargs,
            )
            self.db.add(thread)
        self.db.commit()
        self.db.refresh(thread)
        return thread
