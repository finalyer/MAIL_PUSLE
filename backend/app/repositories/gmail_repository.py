from sqlalchemy.orm import Session
from app.models.gmail_account import GmailAccount
from app.core.security import encrypt_token
import datetime


class GmailRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id) -> GmailAccount | None:
        return self.db.query(GmailAccount).filter(GmailAccount.user_id == user_id).first()

    def get_by_id(self, account_id) -> GmailAccount | None:
        return self.db.query(GmailAccount).filter(GmailAccount.id == account_id).first()

    def upsert(
        self,
        user_id,
        gmail_email: str,
        access_token: str,
        refresh_token: str | None,
        token_expiry: datetime.datetime,
        scopes: str,
    ) -> GmailAccount:
        account = self.get_by_user_id(user_id)
        encrypted_access = encrypt_token(access_token)
        encrypted_refresh = encrypt_token(refresh_token) if refresh_token else None

        if account:
            account.gmail_email = gmail_email
            account.access_token_encrypted = encrypted_access
            if encrypted_refresh:
                account.refresh_token_encrypted = encrypted_refresh
            account.token_expiry = token_expiry
            account.scopes = scopes
            account.sync_status = "CONNECTED"
            account.updated_at = datetime.datetime.utcnow()
        else:
            account = GmailAccount(
                user_id=user_id,
                gmail_email=gmail_email,
                access_token_encrypted=encrypted_access,
                refresh_token_encrypted=encrypted_refresh,
                token_expiry=token_expiry,
                scopes=scopes,
                sync_status="CONNECTED",
            )
            self.db.add(account)

        self.db.commit()
        self.db.refresh(account)
        return account

    def update_sync_status(self, account: GmailAccount, status: str) -> GmailAccount:
        account.sync_status = status
        if status == "SYNCED":
            account.last_synced_at = datetime.datetime.utcnow()
        self.db.commit()
        self.db.refresh(account)
        return account

    def update_sync_cursor(self, account: GmailAccount, cursor: str) -> GmailAccount:
        account.sync_cursor = cursor
        self.db.commit()
        self.db.refresh(account)
        return account
