"""
Sync API routes
===============
GET  /api/sync/status        - Current sync status + latest job
GET  /api/sync/jobs          - Last 20 sync jobs
GET  /api/sync/jobs/{job_id} - Individual job details
POST /api/sync/trigger       - Manually trigger a sync (runs in background)
"""

import uuid
import logging
import threading
import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db, SessionLocal
from app.api.auth import get_current_user_id
from app.models.sync_job import SyncJob
from app.repositories.gmail_repository import GmailRepository
from app.schemas.sync import SyncJobRead

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/sync", tags=["sync"])


# ---------------------------------------------------------------------------
# Background runner (own DB session so it's not tied to the request session)
# ---------------------------------------------------------------------------

def _run_sync_in_background(job_id: str, gmail_account_id: str):
    """Run the Gmail sync service in a dedicated thread with its own DB session."""
    from app.services.gmail_sync_service import GmailSyncService
    from app.models.gmail_account import GmailAccount

    db: Session = SessionLocal()
    try:
        job = db.query(SyncJob).filter(SyncJob.id == uuid.UUID(job_id)).first()
        account = db.query(GmailAccount).filter(
            GmailAccount.id == uuid.UUID(gmail_account_id)
        ).first()

        if not job or not account:
            logger.error("Sync job or account not found: job=%s account=%s", job_id, gmail_account_id)
            return

        service = GmailSyncService(db, account)
        service.run_sync(job)
        logger.info("Sync job %s completed: %s", job_id, job.status)
    except Exception as exc:
        logger.exception("Background sync crashed for job %s: %s", job_id, exc)
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post("/trigger")
def trigger_sync(
    request: Request,
    db: Session = Depends(get_db),
):
    """Trigger a manual Gmail sync. Returns the created SyncJob immediately."""
    user_id = get_current_user_id(request)
    gmail_repo = GmailRepository(db)
    account = gmail_repo.get_by_user_id(user_id)

    if not account:
        raise HTTPException(status_code=404, detail="No Gmail account connected")

    # Reset any stale running/pending jobs older than 10 mins
    stale_time = datetime.datetime.utcnow() - datetime.timedelta(minutes=10)
    db.query(SyncJob).filter(
        SyncJob.gmail_account_id == account.id,
        SyncJob.status.in_(["RUNNING", "PENDING"]),
        SyncJob.created_at < stale_time,
    ).update({"status": "FAILED", "error_message": "Timed out"}, synchronize_session=False)
    db.commit()

    running = (
        db.query(SyncJob)
        .filter(
            SyncJob.gmail_account_id == account.id,
            SyncJob.status.in_(["RUNNING", "PENDING"]),
        )
        .first()
    )
    if running:
        raise HTTPException(status_code=409, detail="A sync is already in progress")

    # Decide sync type
    job_type = "INITIAL_SYNC" if not account.sync_cursor else "MANUAL_SYNC"

    job = SyncJob(
        id=uuid.uuid4(),
        gmail_account_id=account.id,
        job_type=job_type,
        status="PENDING",
        created_at=datetime.datetime.utcnow(),
    )
    account.sync_status = "SYNCING"
    db.add(job)
    db.commit()
    db.refresh(job)

    # Fire off the sync in a background thread
    t = threading.Thread(
        target=_run_sync_in_background,
        args=(str(job.id), str(account.id)),
        daemon=True,
    )
    t.start()

    return SyncJobRead.model_validate(job)


@router.get("/status")
def sync_status(request: Request, db: Session = Depends(get_db)):
    """Get the current sync status and the latest sync job."""
    user_id = get_current_user_id(request)
    gmail_repo = GmailRepository(db)
    account = gmail_repo.get_by_user_id(user_id)

    if not account:
        raise HTTPException(status_code=404, detail="No Gmail account connected")

    latest_job = (
        db.query(SyncJob)
        .filter(SyncJob.gmail_account_id == account.id)
        .order_by(SyncJob.created_at.desc())
        .first()
    )

    return {
        "gmail_email": account.gmail_email,
        "sync_status": account.sync_status,
        "last_synced_at": account.last_synced_at,
        "latest_job": SyncJobRead.model_validate(latest_job) if latest_job else None,
    }


@router.get("/jobs", response_model=List[SyncJobRead])
def list_sync_jobs(request: Request, db: Session = Depends(get_db)):
    """List the last 20 sync jobs for the authenticated user."""
    user_id = get_current_user_id(request)
    gmail_repo = GmailRepository(db)
    account = gmail_repo.get_by_user_id(user_id)

    if not account:
        raise HTTPException(status_code=404, detail="No Gmail account connected")

    jobs = (
        db.query(SyncJob)
        .filter(SyncJob.gmail_account_id == account.id)
        .order_by(SyncJob.created_at.desc())
        .limit(20)
        .all()
    )
    return jobs


@router.get("/jobs/{job_id}", response_model=SyncJobRead)
def get_sync_job(job_id: str, request: Request, db: Session = Depends(get_db)):
    """Get a specific sync job by ID."""
    user_id = get_current_user_id(request)
    gmail_repo = GmailRepository(db)
    account = gmail_repo.get_by_user_id(user_id)

    if not account:
        raise HTTPException(status_code=404, detail="No Gmail account connected")

    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid job ID")

    job = (
        db.query(SyncJob)
        .filter(SyncJob.id == job_uuid, SyncJob.gmail_account_id == account.id)
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Sync job not found")

    return job
