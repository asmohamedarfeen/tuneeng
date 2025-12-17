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


from pathlib import Path

# Read DATABASE_URL from environment; fall back to local SQLite file.
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Build absolute path to db file to avoid CWD issues
    # database.py is in backend/app/, so we go up 2 levels to backend/, then up to project root
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    DB_DIR = BASE_DIR / "db"
    DB_FILE = DB_DIR / "tuneeng.db"
    
    # Ensure db directory exists
    DB_DIR.mkdir(exist_ok=True)
    
    DATABASE_URL = f"sqlite:///{DB_FILE}"
    print(
        f"⚠️  DATABASE_URL not set. Using local SQLite database at '{DB_FILE}'. "
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


