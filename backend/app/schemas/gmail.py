from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class GmailAccountRead(BaseModel):
    id: uuid.UUID
    gmail_email: str
    sync_status: str
    last_synced_at: Optional[datetime] = None
    scopes: Optional[str] = None

    class Config:
        from_attributes = True


class GmailStatusResponse(BaseModel):
    connected: bool
    account: Optional[GmailAccountRead] = None
    sync_status: Optional[str] = None
    last_synced_at: Optional[datetime] = None


class SyncProgressResponse(BaseModel):
    status: str
    progress: int
    emails_processed: int
    total_estimated: int
    job_id: Optional[str] = None
