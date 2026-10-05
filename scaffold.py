import os

def create_file(path, content):
    dirname = os.path.dirname(path)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    with open(path, "w") as f:
        f.write(content.strip() + "\n")

# Backend files
create_file("backend/app/models/__init__.py", """
from app.core.database import Base
from .user import User
from .gmail_account import GmailAccount
from .thread import EmailThread
from .email import Email
from .participant import EmailParticipant
from .attachment import Attachment
from .label import EmailLabel
from .sync_job import SyncJob
from .processing_status import ProcessingStatus
""")

create_file("backend/app/models/user.py", """
import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    google_user_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    profile_picture = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
    
    gmail_accounts = relationship("GmailAccount", back_populates="user")
""")

create_file("backend/app/models/gmail_account.py", """
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
""")

create_file("backend/app/main.py", """
from fastapi import FastAPI
from app.core.database import engine, Base

# Create tables for demo purposes (Alembic should be used in prod)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MailPulse API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
""")

create_file("backend/alembic.ini", """
[alembic]
script_location = alembic
sqlalchemy.url = postgresql://mailpulse:mailpulse_password@db:5432/mailpulse
""")

create_file("docker-compose.yml", """
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: mailpulse
      POSTGRES_PASSWORD: mailpulse_password
      POSTGRES_DB: mailpulse
    ports:
      - "5432:5432"
  backend:
    build:
      context: ./backend
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://mailpulse:mailpulse_password@db:5432/mailpulse
    depends_on:
      - db
""")

print("Scaffolding complete.")
