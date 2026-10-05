from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class UserBase(BaseModel):
    email: str
    name: Optional[str] = None
    profile_picture: Optional[str] = None


class UserCreate(UserBase):
    google_user_id: str


class UserRead(UserBase):
    id: uuid.UUID
    google_user_id: str
    created_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True
