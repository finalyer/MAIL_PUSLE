import os
from cryptography.fernet import Fernet
import base64
import hashlib
from app.core.config import settings


def _get_fernet() -> Fernet:
    """Derive a valid 32-byte Fernet key from the ENCRYPTION_KEY env var."""
    key_bytes = hashlib.sha256(settings.ENCRYPTION_KEY.encode()).digest()
    fernet_key = base64.urlsafe_b64encode(key_bytes)
    return Fernet(fernet_key)


def encrypt_token(token: str) -> str:
    """Encrypt a plaintext token."""
    f = _get_fernet()
    return f.encrypt(token.encode()).decode()


def decrypt_token(encrypted_token: str) -> str:
    """Decrypt an encrypted token."""
    f = _get_fernet()
    return f.decrypt(encrypted_token.encode()).decode()
