from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class ThreadRead(BaseModel):
    id: uuid.UUID
    gmail_thread_id: str
    subject: Optional[str] = None
    snippet: Optional[str] = None
    message_count: int = 0
    first_message_at: Optional[datetime] = None
    last_message_at: Optional[datetime] = None
    participants_count: int = 0
    has_attachments: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedThreads(BaseModel):
    items: List[ThreadRead]
    total: int
    page: int
    page_size: int
    pages: int
