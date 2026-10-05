"""
Gmail Sync Service
==================
Fetches Gmail threads/messages via the Gmail API and persists them to the
database using the MailPulse schema.

Features:
  - Exponential backoff with jitter on 429/403 rate limits
  - Throttled requests to stay well within Gmail API quotas
  - Incremental commits so partial progress is saved
  - Full support for threads, messages, participants, and attachments
"""

import base64
import datetime
import email as email_lib
import logging
import random
import time
import uuid
from typing import Optional, List, Dict, Any

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decrypt_token, encrypt_token
from app.models.attachment import Attachment
from app.models.email import Email
from app.models.gmail_account import GmailAccount
from app.models.participant import EmailParticipant
from app.models.sync_job import SyncJob
from app.models.thread import EmailThread

logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
MAX_INITIAL_RESULTS = 150
MAX_PAGE_SIZE = 25
THREAD_FETCH_DELAY_SECONDS = 0.12


# ---------------------------------------------------------------------------
# Credentials helpers
# ---------------------------------------------------------------------------

def _build_credentials(account: GmailAccount) -> Credentials:
    """Reconstruct and (if needed) refresh a Credentials object from the DB."""
    access_token = decrypt_token(account.access_token_encrypted)
    refresh_token = (
        decrypt_token(account.refresh_token_encrypted)
        if account.refresh_token_encrypted
        else None
    )
    creds = Credentials(
        token=access_token,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=SCOPES,
    )
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    return creds


def _persist_refreshed_token(db: Session, account: GmailAccount, creds: Credentials):
    """Persist a refreshed access token back to the DB if it changed."""
    try:
        current = decrypt_token(account.access_token_encrypted)
    except Exception:
        current = None

    if creds.token and creds.token != current:
        account.access_token_encrypted = encrypt_token(creds.token)
        if creds.expiry:
            account.token_expiry = creds.expiry
        db.commit()
        logger.info("Persisted refreshed access token for %s", account.gmail_email)


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

def _decode_body(part: dict) -> str:
    data = part.get("body", {}).get("data", "")
    if not data:
        return ""
    # Gmail uses URL-safe base64 without padding
    return base64.urlsafe_b64decode(data + "==").decode("utf-8", errors="replace")


def _extract_bodies(payload: dict) -> tuple[str, str]:
    """Return (plain_text, html_text) by recursing through MIME parts."""
    plain, html = "", ""
    mime_type = payload.get("mimeType", "")
    if mime_type == "text/plain":
        plain = _decode_body(payload)
    elif mime_type == "text/html":
        html = _decode_body(payload)
    elif "parts" in payload:
        for part in payload["parts"]:
            p, h = _extract_bodies(part)
            plain = plain or p
            html = html or h
    return plain, html


def _extract_attachments(payload: dict, out_list: list):
    """Recursively collect attachment metadata from MIME parts."""
    filename = payload.get("filename")
    body = payload.get("body", {})
    att_id = body.get("attachmentId")
    if filename and att_id:
        out_list.append({
            "filename": filename,
            "mime_type": payload.get("mimeType", "application/octet-stream"),
            "size_bytes": body.get("size", 0),
            "gmail_attachment_id": att_id,
        })
    for part in payload.get("parts", []):
        _extract_attachments(part, out_list)


def _header(headers: list[dict], name: str) -> str:
    name_lower = name.lower()
    for h in headers:
        if h.get("name", "").lower() == name_lower:
            return h.get("value", "")
    return ""


def _parse_addresses(raw: str) -> list[tuple[str, str]]:
    """Return list of (display_name, email_address) from an address header."""
    if not raw:
        return []
    return [
        (name.strip(), addr.strip().lower())
        for name, addr in email_lib.utils.getaddresses([raw])
        if addr.strip()
    ]


def _parse_date(date_str: str) -> Optional[datetime.datetime]:
    if not date_str:
        return None
    try:
        parsed = email_lib.utils.parsedate_to_datetime(date_str)
        return parsed.astimezone(datetime.timezone.utc).replace(tzinfo=None)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Main service class
# ---------------------------------------------------------------------------

class GmailSyncService:
    def __init__(self, db: Session, account: GmailAccount):
        self.db = db
        self.account = account
        self.creds = _build_credentials(account)
        self.service = build("gmail", "v1", credentials=self.creds, cache_discovery=False)
        self.current_job: Optional[SyncJob] = None

    def _execute_api(self, request, max_retries: int = 5, initial_backoff: float = 1.5) -> Any:
        """
        Execute a Google API request with robust exponential backoff and jitter
        for rate limiting (429, 403 quota exceeded) and transient server errors.
        """
        backoff = initial_backoff
        for attempt in range(max_retries):
            try:
                return request.execute()
            except HttpError as exc:
                status = exc.resp.status
                err_text = str(exc).lower()
                is_rate_limit = (
                    status in (429, 500, 503)
                    or (status == 403 and any(k in err_text for k in ["quota", "ratelimit", "userate", "rate limit"]))
                )
                if is_rate_limit and attempt < max_retries - 1:
                    sleep_sec = backoff + random.uniform(0.2, 0.8)
                    logger.warning(
                        "Gmail API rate limit/transient error (%s). Backing off for %.2fs (attempt %d/%d)",
                        status, sleep_sec, attempt + 1, max_retries
                    )
                    time.sleep(sleep_sec)
                    backoff *= 2
                else:
                    raise

    # ------------------------------------------------------------------
    # Public entry point
    # ------------------------------------------------------------------

    def run_sync(self, job: SyncJob) -> SyncJob:
        """Execute a sync job, update its status, and return it."""
        self.current_job = job
        job.status = "RUNNING"
        job.started_at = datetime.datetime.utcnow()
        self.db.commit()

        try:
            if job.job_type in ("INITIAL_SYNC", "MANUAL_SYNC"):
                fetched, created, updated = self._full_sync()
            else:
                fetched, created, updated = self._incremental_sync()

            job.emails_fetched = fetched
            job.emails_created = created
            job.emails_updated = updated
            job.status = "COMPLETED"
            job.completed_at = datetime.datetime.utcnow()

            self.account.sync_status = "SYNCED"
            self.account.last_synced_at = datetime.datetime.utcnow()

        except Exception as exc:
            logger.exception("Sync job %s encountered an error: %s", job.id, exc)
            # If we managed to fetch some emails before failing, record as completed/partial
            if job.emails_created > 0 or job.emails_fetched > 0:
                job.status = "COMPLETED"
                job.error_message = f"Partially completed: {str(exc)}"
                self.account.sync_status = "SYNCED"
            else:
                job.status = "FAILED"
                job.error_message = str(exc)
                self.account.sync_status = "ERROR"
            job.completed_at = datetime.datetime.utcnow()

        finally:
            _persist_refreshed_token(self.db, self.account, self.creds)
            self.db.commit()

        return job

    # ------------------------------------------------------------------
    # Full sync
    # ------------------------------------------------------------------

    def _full_sync(self) -> tuple[int, int, int]:
        fetched = created = updated = 0
        page_token = None

        while fetched < MAX_INITIAL_RESULTS:
            remaining = MAX_INITIAL_RESULTS - fetched
            page_size = min(MAX_PAGE_SIZE, remaining)

            params: dict = {
                "userId": "me",
                "maxResults": page_size,
                "includeSpamTrash": False,
            }
            if page_token:
                params["pageToken"] = page_token

            req = self.service.users().threads().list(**params)
            resp = self._execute_api(req)
            stubs = resp.get("threads", [])
            if not stubs:
                break

            for stub in stubs:
                c, u = self._sync_thread(stub["id"])
                created += c
                updated += u
                fetched += 1

                if self.current_job:
                    self.current_job.emails_fetched = fetched
                    self.current_job.emails_created = created
                    self.current_job.emails_updated = updated

                # Incremental commit every 3 threads
                if fetched % 3 == 0:
                    self.db.commit()

                # Polite delay to respect Google query rate limit
                time.sleep(THREAD_FETCH_DELAY_SECONDS)

            page_token = resp.get("nextPageToken")
            if not page_token:
                break

        # Store history cursor
        try:
            prof_req = self.service.users().getProfile(userId="me")
            profile = self._execute_api(prof_req)
            self.account.sync_cursor = str(profile.get("historyId", ""))
        except Exception as e:
            logger.warning("Could not fetch user profile history cursor: %s", e)

        self.db.commit()
        return fetched, created, updated

    # ------------------------------------------------------------------
    # Incremental sync
    # ------------------------------------------------------------------

    def _incremental_sync(self) -> tuple[int, int, int]:
        fetched = created = updated = 0
        history_id = self.account.sync_cursor

        if not history_id:
            logger.warning("No history cursor — falling back to full sync")
            return self._full_sync()

        page_token = None
        seen_threads: set[str] = set()

        while True:
            params: dict = {
                "userId": "me",
                "startHistoryId": history_id,
                "historyTypes": ["messageAdded", "labelAdded", "labelRemoved"],
            }
            if page_token:
                params["pageToken"] = page_token

            try:
                req = self.service.users().history().list(**params)
                resp = self._execute_api(req)
            except Exception as exc:
                logger.warning("historyId stale, falling back to full sync: %s", exc)
                return self._full_sync()

            for record in resp.get("history", []):
                all_msgs = (
                    record.get("messagesAdded", [])
                    + record.get("labelsAdded", [])
                    + record.get("labelsRemoved", [])
                )
                for entry in all_msgs:
                    tid = entry.get("message", {}).get("threadId")
                    if tid and tid not in seen_threads:
                        seen_threads.add(tid)
                        c, u = self._sync_thread(tid)
                        created += c
                        updated += u
                        fetched += 1

                        if self.current_job:
                            self.current_job.emails_fetched = fetched
                            self.current_job.emails_created = created
                            self.current_job.emails_updated = updated

                        if fetched % 3 == 0:
                            self.db.commit()

                        time.sleep(THREAD_FETCH_DELAY_SECONDS)

            page_token = resp.get("nextPageToken")
            if not page_token:
                new_hid = resp.get("historyId")
                if new_hid:
                    self.account.sync_cursor = str(new_hid)
                break

        self.db.commit()
        return fetched, created, updated

    # ------------------------------------------------------------------
    # Thread-level
    # ------------------------------------------------------------------

    def _sync_thread(self, gmail_thread_id: str) -> tuple[int, int]:
        try:
            req = self.service.users().threads().get(
                userId="me",
                id=gmail_thread_id,
                format="full",
            )
            raw = self._execute_api(req)
        except Exception as exc:
            logger.warning("Could not fetch thread %s: %s", gmail_thread_id, exc)
            return 0, 0

        messages = raw.get("messages", [])
        if not messages:
            return 0, 0

        first_headers = messages[0].get("payload", {}).get("headers", [])
        last_headers = messages[-1].get("payload", {}).get("headers", [])

        subject = _header(first_headers, "Subject") or "(No Subject)"
        snippet = raw.get("snippet", "")
        msg_count = len(messages)
        first_msg_at = _parse_date(_header(first_headers, "Date"))
        last_msg_at = _parse_date(_header(last_headers, "Date"))

        thread = self._upsert_thread(
            gmail_thread_id=gmail_thread_id,
            subject=subject,
            snippet=snippet,
            message_count=msg_count,
            first_message_at=first_msg_at,
            last_message_at=last_msg_at,
        )

        created = updated = 0
        for raw_msg in messages:
            c, u = self._sync_message(thread, raw_msg)
            created += c
            updated += u

        # Update participant count after all messages are flushed
        thread.participants_count = self._count_unique_participants(thread.id)
        self.db.flush()

        return created, updated

    def _upsert_thread(
        self,
        gmail_thread_id: str,
        subject: str,
        snippet: str,
        message_count: int,
        first_message_at: Optional[datetime.datetime],
        last_message_at: Optional[datetime.datetime],
    ) -> EmailThread:
        thread = (
            self.db.query(EmailThread)
            .filter(
                EmailThread.gmail_thread_id == gmail_thread_id,
                EmailThread.gmail_account_id == self.account.id,
            )
            .first()
        )
        if not thread:
            thread = EmailThread(
                id=uuid.uuid4(),
                gmail_account_id=self.account.id,
                gmail_thread_id=gmail_thread_id,
            )
            self.db.add(thread)

        thread.subject = subject
        thread.snippet = snippet
        thread.message_count = message_count
        thread.first_message_at = first_message_at
        thread.last_message_at = last_message_at
        self.db.flush()
        return thread

    def _count_unique_participants(self, thread_id: uuid.UUID) -> int:
        from sqlalchemy import select, func, distinct
        result = self.db.execute(
            select(func.count(distinct(EmailParticipant.email_address)))
            .join(Email, EmailParticipant.email_id == Email.id)
            .where(Email.thread_id == thread_id)
        ).scalar()
        return result or 0

    # ------------------------------------------------------------------
    # Message-level
    # ------------------------------------------------------------------

    def _sync_message(self, thread: EmailThread, raw_msg: dict) -> tuple[int, int]:
        gmail_msg_id = raw_msg.get("id", "")
        payload = raw_msg.get("payload", {})
        headers = payload.get("headers", [])
        label_ids: list[str] = raw_msg.get("labelIds", [])

        # Parse headers
        subject = _header(headers, "Subject") or thread.subject or "(No Subject)"
        from_header = _header(headers, "From")
        to_header = _header(headers, "To")
        cc_header = _header(headers, "Cc")
        bcc_header = _header(headers, "Bcc")
        date_str = _header(headers, "Date")
        sent_at = _parse_date(date_str)

        # Bodies
        plain_body, html_body = _extract_bodies(payload)

        # Derive recipient lists (JSON-stored)
        to_list = [addr for _, addr in _parse_addresses(to_header)]
        cc_list = [addr for _, addr in _parse_addresses(cc_header)]
        bcc_list = [addr for _, addr in _parse_addresses(bcc_header)]

        # Determine direction
        direction = "sent" if "SENT" in label_ids else "received"

        # Internal date (milliseconds epoch → datetime)
        internal_date_ms = raw_msg.get("internalDate")
        internal_date = (
            datetime.datetime.utcfromtimestamp(int(internal_date_ms) / 1000)
            if internal_date_ms
            else sent_at
        )

        # Parse sender
        sender_parts = _parse_addresses(from_header)
        sender_name = sender_parts[0][0] if sender_parts else ""
        sender_email = sender_parts[0][1] if sender_parts else ""

        # Upsert
        existing = (
            self.db.query(Email)
            .filter(Email.gmail_message_id == gmail_msg_id)
            .first()
        )
        if existing:
            # Only update mutable fields
            existing.is_read = "UNREAD" not in label_ids
            existing.is_starred = "STARRED" in label_ids
            existing.is_important = "IMPORTANT" in label_ids
            existing.label_ids = label_ids
            existing.body_text = existing.body_text or plain_body[:50_000]
            existing.body_html = existing.body_html or html_body[:200_000]
            self.db.flush()
            return 0, 1

        msg = Email(
            id=uuid.uuid4(),
            thread_id=thread.id,
            gmail_message_id=gmail_msg_id,
            gmail_internal_date=internal_date,
            sender_email=sender_email,
            sender_name=sender_name,
            recipient_emails=to_list,
            cc_emails=cc_list,
            bcc_emails=bcc_list,
            subject=subject,
            snippet=raw_msg.get("snippet", ""),
            body_text=plain_body[:50_000],
            body_html=html_body[:200_000],
            direction=direction,
            label_ids=label_ids,
            is_read="UNREAD" not in label_ids,
            is_starred="STARRED" in label_ids,
            is_important="IMPORTANT" in label_ids,
            has_attachments=self._has_attachments(payload),
        )
        self.db.add(msg)
        self.db.flush()

        # Participants — from/to/cc/bcc as EmailParticipant rows
        sender_full = _parse_addresses(from_header)
        if sender_full:
            self.db.add(EmailParticipant(
                id=uuid.uuid4(),
                email_id=msg.id,
                email_address=sender_full[0][1],
                display_name=sender_full[0][0],
                participant_type="from",
            ))

        for name, addr in _parse_addresses(to_header):
            self.db.add(EmailParticipant(
                id=uuid.uuid4(), email_id=msg.id,
                email_address=addr, display_name=name, participant_type="to",
            ))
        for name, addr in _parse_addresses(cc_header):
            self.db.add(EmailParticipant(
                id=uuid.uuid4(), email_id=msg.id,
                email_address=addr, display_name=name, participant_type="cc",
            ))
        for name, addr in _parse_addresses(bcc_header):
            self.db.add(EmailParticipant(
                id=uuid.uuid4(), email_id=msg.id,
                email_address=addr, display_name=name, participant_type="bcc",
            ))

        # Attachments
        if msg.has_attachments:
            thread.has_attachments = True
            att_items = []
            _extract_attachments(payload, att_items)
            for item in att_items:
                self.db.add(Attachment(
                    id=uuid.uuid4(),
                    email_id=msg.id,
                    gmail_attachment_id=item["gmail_attachment_id"],
                    filename=item["filename"],
                    mime_type=item["mime_type"],
                    size_bytes=item["size_bytes"],
                ))

        self.db.flush()
        return 1, 0

    @staticmethod
    def _has_attachments(payload: dict) -> bool:
        """Recursively check if any MIME part has an attachment."""
        if payload.get("filename"):
            return True
        for part in payload.get("parts", []):
            if GmailSyncService._has_attachments(part):
                return True
        return False
