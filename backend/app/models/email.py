import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime


class Email(Base):
    __tablename__ = "email_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    thread_id = Column(UUID(as_uuid=True), ForeignKey("email_threads.id", ondelete="CASCADE"), nullable=False, index=True)
    gmail_message_id = Column(String, nullable=False, unique=True, index=True)
    gmail_internal_date = Column(DateTime, nullable=True, index=True)
    sender_email = Column(String, nullable=True, index=True)
    sender_name = Column(String, nullable=True)
    recipient_emails = Column(JSON, default=list)
    cc_emails = Column(JSON, default=list)
    bcc_emails = Column(JSON, default=list)
    subject = Column(Text, nullable=True)
    snippet = Column(Text, nullable=True)
    body_text = Column(Text, nullable=True)
    body_html = Column(Text, nullable=True)
    direction = Column(String, default="received")  # "sent" or "received"
    label_ids = Column(JSON, default=list)
    is_read = Column(Boolean, default=False)
    is_starred = Column(Boolean, default=False)
    is_important = Column(Boolean, default=False)
    has_attachments = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    thread = relationship("EmailThread", back_populates="messages")
    participants = relationship("EmailParticipant", back_populates="email", cascade="all, delete-orphan")
    attachments = relationship("Attachment", back_populates="email", cascade="all, delete-orphan")
    processing_status = relationship("ProcessingStatus", back_populates="email", uselist=False, cascade="all, delete-orphan")
