import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime

class GmailAccount(Base):
    __tablename__ = "gmail_accounts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    gmail_email = Column(String, index=True)
    access_token_encrypted = Column(String)
    refresh_token_encrypted = Column(String, nullable=True)
    token_expiry = Column(DateTime)
    scopes = Column(String)
    sync_status = Column(String, default="NOT_CONNECTED")
    last_synced_at = Column(DateTime, nullable=True)
    sync_cursor = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="gmail_accounts")
    threads = relationship("EmailThread", back_populates="gmail_account")
