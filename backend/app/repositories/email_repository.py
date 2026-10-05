from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, func, or_, cast, String
from app.models.email import Email
from app.models.thread import EmailThread
from typing import Optional
import math


class EmailRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_gmail_message_id(self, gmail_message_id: str) -> Email | None:
        return self.db.query(Email).filter(Email.gmail_message_id == gmail_message_id).first()

    def get_by_id(self, email_id) -> Email | None:
        return (
            self.db.query(Email)
            .options(
                joinedload(Email.participants),
                joinedload(Email.attachments),
            )
            .filter(Email.id == email_id)
            .first()
        )

    def list_paginated(self, gmail_account_id, page: int = 1, page_size: int = 50, thread_id: str = None):
        query = (
            self.db.query(Email)
            .join(Email.thread)
            .filter(EmailThread.gmail_account_id == gmail_account_id)
        )
        if thread_id:
            # Accept both internal UUID and gmail_thread_id
            query = query.filter(
                or_(
                    cast(Email.thread_id, String) == thread_id,
                    EmailThread.gmail_thread_id == thread_id,
                )
            )
        query = query.order_by(desc(Email.gmail_internal_date))
        total = query.count()
        items = query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total, math.ceil(total / page_size) if total else 0

    def search(self, gmail_account_id, query_str: str, page: int = 1, page_size: int = 50):
        search_term = f"%{query_str}%"
        query = (
            self.db.query(Email)
            .join(Email.thread)
            .filter(EmailThread.gmail_account_id == gmail_account_id)
            .filter(
                or_(
                    Email.subject.ilike(search_term),
                    Email.sender_email.ilike(search_term),
                    Email.sender_name.ilike(search_term),
                    Email.snippet.ilike(search_term),
                    Email.body_text.ilike(search_term),
                )
            )
            .order_by(desc(Email.gmail_internal_date))
        )
        total = query.count()
        items = query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total, math.ceil(total / page_size) if total else 0

    def create_or_update(self, thread_id, gmail_message_id: str, **kwargs) -> Email:
        email = self.get_by_gmail_message_id(gmail_message_id)
        if email:
            for k, v in kwargs.items():
                setattr(email, k, v)
        else:
            email = Email(thread_id=thread_id, gmail_message_id=gmail_message_id, **kwargs)
            self.db.add(email)
        self.db.commit()
        self.db.refresh(email)
        return email

    def get_analytics(self, gmail_account_id):
        """Return aggregate stats for the analytics endpoint."""
        total = (
            self.db.query(func.count(Email.id))
            .join(Email.thread)
            .filter(EmailThread.gmail_account_id == gmail_account_id)
            .scalar()
        )
        unread = (
            self.db.query(func.count(Email.id))
            .join(Email.thread)
            .filter(EmailThread.gmail_account_id == gmail_account_id, Email.is_read == False)
            .scalar()
        )
        starred = (
            self.db.query(func.count(Email.id))
            .join(Email.thread)
            .filter(EmailThread.gmail_account_id == gmail_account_id, Email.is_starred == True)
            .scalar()
        )
        with_attachments = (
            self.db.query(func.count(Email.id))
            .join(Email.thread)
            .filter(EmailThread.gmail_account_id == gmail_account_id, Email.has_attachments == True)
            .scalar()
        )
        sent = (
            self.db.query(func.count(Email.id))
            .join(Email.thread)
            .filter(EmailThread.gmail_account_id == gmail_account_id, Email.direction == "sent")
            .scalar()
        )
        received = total - sent
        return {
            "total_emails": total,
            "unread": unread,
            "starred": starred,
            "with_attachments": with_attachments,
            "sent": sent,
            "received": received,
        }
