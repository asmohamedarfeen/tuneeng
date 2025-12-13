"""
Database configuration and session management for the FastAPI backend.

By default this uses a local SQLite file ``tuneeng.db`` so the app works
out-of-the-box. If a ``DATABASE_URL`` environment variable is provided,
it will be used instead (for example, to connect to PostgreSQL).

PostgreSQL example:
    DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/tuneeng
"""

from __future__ import annotations

import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session


# Read DATABASE_URL from environment; fall back to local SQLite file.
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Local development default – creates tuneeng.db in project root.
    DATABASE_URL = "sqlite:///../db/tuneeng.db"
    print(
        "⚠️  DATABASE_URL not set. Using local SQLite database at '../db/tuneeng.db'. "
        "Set DATABASE_URL to use PostgreSQL."
    )

# SQLite needs a special flag for multithreading when using the same connection.
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a SQLAlchemy session.

    The session is committed/closed automatically after the request.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


