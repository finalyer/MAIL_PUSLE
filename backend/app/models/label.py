import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime


class EmailLabel(Base):
    __tablename__ = "email_labels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gmail_account_id = Column(UUID(as_uuid=True), ForeignKey("gmail_accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    gmail_label_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    label_type = Column(String, nullable=True)  # "system" or "user"
    color = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
