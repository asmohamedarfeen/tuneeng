"""
Security utilities for password hashing and JWT token handling.
"""

from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import jwt, JWTError
from passlib.context import CryptContext


# In production, set these via environment variables.
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    # Allow default only in development (check if running in dev mode)
    import sys
    
    # Check for development indicators
    is_development = (
        "pytest" in sys.modules  # Running tests
        or os.getenv("ENVIRONMENT") == "development"  # Explicit dev flag
        or os.getenv("ENVIRONMENT") != "production"  # Not explicitly production
        or os.getenv("DATABASE_URL", "").startswith("sqlite")  # Using SQLite (dev)
        or not os.getenv("DATABASE_URL")  # No DATABASE_URL set (local dev)
    )
    
    if is_development:
        # Generate a default development key (32+ characters for security)
        SECRET_KEY = "DEV_SECRET_KEY_CHANGE_IN_PRODUCTION_MIN_32_CHARS"
        print("⚠️  WARNING: Using default JWT_SECRET_KEY for development.")
        print("   Set JWT_SECRET_KEY environment variable in production!")
    else:
        raise ValueError(
            "JWT_SECRET_KEY environment variable must be set. "
            "Generate a strong secret key (minimum 32 characters) for production."
        )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify that a plain text password matches a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a plain text password using bcrypt."""
    return pwd_context.hash(password)


def create_access_token(
    data: Dict[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Payload to embed in the token (will be copied).
        expires_delta: Optional custom expiration period.

    Returns:
        Encoded JWT as a string.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT access token.

    Raises:
        JWTError: if the token is invalid/expired.
    """
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload


