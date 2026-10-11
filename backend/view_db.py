#!/usr/bin/env python3
"""
MailPulse — Database Table Viewer CLI
Usage:
  venv/bin/python view_db.py [table_name] [limit]
Examples:
  venv/bin/python view_db.py summary
  venv/bin/python view_db.py emails 10
  venv/bin/python view_db.py users
  venv/bin/python view_db.py accounts
  venv/bin/python view_db.py sync_jobs
"""

import sys
from app.core.database import SessionLocal
from app.models.user import User
from app.models.gmail_account import GmailAccount
from app.models.email import Email
from app.models.thread import EmailThread
from app.models.sync_job import SyncJob


def print_table(headers, rows):
    if not rows:
        print("  (No records found)\n")
        return
    col_widths = [len(h) for h in headers]
    for row in rows:
        for i, val in enumerate(row):
            str_val = str(val or "")
            if len(str_val) > 40:
                str_val = str_val[:37] + "..."
            col_widths[i] = max(col_widths[i], len(str_val))

    sep = "+-" + "-+-".join("-" * w for w in col_widths) + "-+"
    header_row = "| " + " | ".join(h.ljust(col_widths[i]) for i, h in enumerate(headers)) + " |"

    print(sep)
    print(header_row)
    print(sep)
    for row in rows:
        formatted = []
        for i, val in enumerate(row):
            str_val = str(val or "")
            if len(str_val) > 40:
                str_val = str_val[:37] + "..."
            formatted.append(str_val.ljust(col_widths[i]))
        print("| " + " | ".join(formatted) + " |")
    print(sep + "\n")


def show_summary(db):
    print("\n================== MailPulse Database Summary ==================")
    counts = [
        ["Users", db.query(User).count()],
        ["Gmail Accounts", db.query(GmailAccount).count()],
        ["Email Threads", db.query(EmailThread).count()],
        ["Emails (Messages)", db.query(Email).count()],
        ["Sync Jobs", db.query(SyncJob).count()],
    ]
    print_table(["Table Name", "Record Count"], counts)


def show_users(db, limit=20):
    print(f"\n================== Users (Limit {limit}) ==================")
    rows = []
    for u in db.query(User).limit(limit).all():
        rows.append([str(u.id)[:8] + "...", u.email, u.name or "-", str(u.created_at)[:19]])
    print_table(["ID", "Email", "Name", "Created At"], rows)


def show_accounts(db, limit=20):
    print(f"\n============== Gmail Accounts (Limit {limit}) ==============")
    rows = []
    for a in db.query(GmailAccount).limit(limit).all():
        rows.append([str(a.id)[:8] + "...", a.gmail_email, a.sync_status, str(a.last_synced_at)[:19] if a.last_synced_at else "-"])
    print_table(["ID", "Gmail Email", "Status", "Last Synced At"], rows)


def show_emails(db, limit=10):
    print(f"\n================== Emails (Limit {limit}) ==================")
    rows = []
    for em in db.query(Email).order_by(Email.gmail_internal_date.desc()).limit(limit).all():
        sender = (em.sender_name or em.sender_email or "Unknown")[:25]
        subj = (em.subject or "(No subject)")[:35]
        date_str = str(em.gmail_internal_date)[:16] if em.gmail_internal_date else "-"
        rows.append([
            str(em.id)[:8] + "...",
            sender,
            subj,
            date_str,
            "Yes" if em.is_read else "No",
            "Yes" if em.is_starred else "No",
            em.direction
        ])
    print_table(["ID", "Sender", "Subject", "Date", "Read", "Starred", "Direction"], rows)


def show_sync_jobs(db, limit=10):
    print(f"\n================ Sync Jobs (Limit {limit}) ================")
    rows = []
    for j in db.query(SyncJob).order_by(SyncJob.created_at.desc()).limit(limit).all():
        rows.append([
            str(j.id)[:8] + "...",
            j.job_type,
            j.status,
            str(j.created_at)[:19] if j.created_at else "-",
            j.error_message or "None"
        ])
    print_table(["ID", "Job Type", "Status", "Created At", "Error"], rows)


def main():
    target = sys.argv[1].lower() if len(sys.argv) > 1 else "summary"
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10

    db = SessionLocal()
    try:
        if target in ("summary", "all"):
            show_summary(db)
            show_accounts(db, limit=5)
            show_emails(db, limit=5)
        elif target in ("emails", "email", "messages"):
            show_emails(db, limit=limit)
        elif target in ("users", "user"):
            show_users(db, limit=limit)
        elif target in ("accounts", "account", "gmail"):
            show_accounts(db, limit=limit)
        elif target in ("sync", "jobs", "sync_jobs"):
            show_sync_jobs(db, limit=limit)
        else:
            print(f"Unknown table '{target}'. Choose from: summary, emails, users, accounts, sync_jobs")
    finally:
        db.close()


if __name__ == "__main__":
    main()
