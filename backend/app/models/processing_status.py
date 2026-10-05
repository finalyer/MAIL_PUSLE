import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime


class ProcessingStatus(Base):
    __tablename__ = "processing_status"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_id = Column(UUID(as_uuid=True), ForeignKey("email_messages.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    preprocessing_status = Column(String, default="PENDING")  # PENDING, COMPLETED, FAILED
    processed_at = Column(DateTime, nullable=True)
    processing_version = Column(String, nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    email = relationship("Email", back_populates="processing_status")
