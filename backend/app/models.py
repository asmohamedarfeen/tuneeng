"""
SQLAlchemy ORM models for the FastAPI backend.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from .database import Base


class User(Base):
    """
    User model for authentication and profile information.

    Fields:
        - id: primary key
        - email: unique email address
        - hashed_password: bcrypt-hashed password
        - full_name: user's full name
        - username: optional display/handle name, unique if provided
        - created_at: timestamp of creation
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    username = Column(String(255), unique=True, nullable=True, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


