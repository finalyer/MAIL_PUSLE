from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
import uuid


class AttachmentRead(BaseModel):
    id: uuid.UUID
    filename: Optional[str] = None
    mime_type: Optional[str] = None
    size_bytes: int = 0

    class Config:
        from_attributes = True


class ParticipantRead(BaseModel):
    id: uuid.UUID
    email_address: str
    display_name: Optional[str] = None
    participant_type: str

    class Config:
        from_attributes = True


class EmailRead(BaseModel):
    id: uuid.UUID
    thread_id: uuid.UUID
    gmail_message_id: str
    gmail_internal_date: Optional[datetime] = None
    sender_email: Optional[str] = None
    sender_name: Optional[str] = None
    recipient_emails: Optional[List[str]] = []
    cc_emails: Optional[List[str]] = []
    subject: Optional[str] = None
    snippet: Optional[str] = None
    body_text: Optional[str] = None
    direction: str = "received"
    label_ids: Optional[List[str]] = []
    is_read: bool = False
    is_starred: bool = False
    is_important: bool = False
    has_attachments: bool = False
    participants: List[ParticipantRead] = []
    attachments: List[AttachmentRead] = []
    created_at: datetime

    class Config:
        from_attributes = True


class EmailListItem(BaseModel):
    id: uuid.UUID
    thread_id: uuid.UUID
    gmail_message_id: str
    sender_email: Optional[str] = None
    sender_name: Optional[str] = None
    subject: Optional[str] = None
    snippet: Optional[str] = None
    gmail_internal_date: Optional[datetime] = None
    is_read: bool = False
    is_starred: bool = False
    is_important: bool = False
    has_attachments: bool = False
    label_ids: Optional[List[str]] = []
    direction: str = "received"

    class Config:
        from_attributes = True


class PaginatedEmails(BaseModel):
    items: List[EmailListItem]
    total: int
    page: int
    page_size: int
    pages: int
