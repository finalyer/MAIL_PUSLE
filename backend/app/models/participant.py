import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime


class EmailParticipant(Base):
    __tablename__ = "email_participants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_id = Column(UUID(as_uuid=True), ForeignKey("email_messages.id", ondelete="CASCADE"), nullable=False, index=True)
    email_address = Column(String, nullable=False, index=True)
    display_name = Column(String, nullable=True)
    participant_type = Column(String, nullable=False)  # "from", "to", "cc", "bcc"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    email = relationship("Email", back_populates="participants")
