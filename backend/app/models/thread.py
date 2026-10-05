import uuid
from sqlalchemy import Column, String, DateTime, Integer, Boolean, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime


class EmailThread(Base):
    __tablename__ = "email_threads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gmail_account_id = Column(UUID(as_uuid=True), ForeignKey("gmail_accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    gmail_thread_id = Column(String, nullable=False, index=True)
    subject = Column(Text, nullable=True)
    snippet = Column(Text, nullable=True)
    message_count = Column(Integer, default=0)
    first_message_at = Column(DateTime, nullable=True)
    last_message_at = Column(DateTime, nullable=True, index=True)
    participants_count = Column(Integer, default=0)
    has_attachments = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    gmail_account = relationship("GmailAccount", back_populates="threads")
    messages = relationship("Email", back_populates="thread", cascade="all, delete-orphan")
