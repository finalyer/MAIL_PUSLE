from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class SyncJobRead(BaseModel):
    id: uuid.UUID
    gmail_account_id: uuid.UUID
    job_type: str
    status: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    emails_fetched: int = 0
    emails_created: int = 0
    emails_updated: int = 0
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
