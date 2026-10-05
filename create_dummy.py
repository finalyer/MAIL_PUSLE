import os

def create_dummy_model(name, class_name):
    content = f"""
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
import datetime
from app.core.database import Base

class {class_name}(Base):
    __tablename__ = '{name}s'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
"""
    with open(f"backend/app/models/{name}.py", "w") as f:
        f.write(content.strip() + "\n")

create_dummy_model("thread", "EmailThread")
create_dummy_model("email", "Email")
create_dummy_model("participant", "EmailParticipant")
create_dummy_model("attachment", "Attachment")
create_dummy_model("label", "EmailLabel")
create_dummy_model("sync_job", "SyncJob")
create_dummy_model("processing_status", "ProcessingStatus")

print("Created dummy models.")
