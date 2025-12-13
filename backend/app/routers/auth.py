from typing import Optional, Dict, Any
import re

from fastapi import APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)

router = APIRouter()
security = HTTPBearer()


class UserRegister(BaseModel):
    """User registration request model."""
    email: EmailStr
    password: str
    full_name: str
    username: Optional[str] = None
    
    @validator('password')
    def validate_password_strength(cls, v):
        """Validate password meets security requirements."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>\[\]\\/_+=\-~`]', v):
            raise ValueError('Password must contain at least one special character')
        if len(v) > 128:
            raise ValueError('Password must be less than 128 characters')
        return v
    
    @validator('full_name')
    def validate_full_name(cls, v):
        """Validate full name length."""
        if len(v) < 1:
            raise ValueError('Full name cannot be empty')
        if len(v) > 100:
            raise ValueError('Full name must be less than 100 characters')
        return v
    
    @validator('username')
    def validate_username(cls, v):
        """Validate username if provided."""
        if v is not None:
            if len(v) < 3:
                raise ValueError('Username must be at least 3 characters long')
            if len(v) > 50:
                raise ValueError('Username must be less than 50 characters')
            if not re.match(r'^[a-zA-Z0-9_-]+$', v):
                raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v


class UserLogin(BaseModel):
    """User login request model."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User response model returned to clients (without password)."""
    id: int
    email: str
    full_name: str
    username: Optional[str] = None


class TokenResponse(BaseModel):
    """Token response model."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


def _user_to_response(user: User) -> UserResponse:
    """Helper to convert ORM User to Pydantic response model."""
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        username=user.username,
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user in the database.

    - Ensures email uniqueness.
    - Optionally ensures username uniqueness if provided.
    - Hashes password before storing.
    """
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    username = user_data.username or user_data.email.split("@")[0]

    # If username is provided or derived, ensure it is unique.
    username_conflict = (
        db.query(User).filter(User.username == username).first()
        if username is not None
        else None
    )
    if username_conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    hashed_password = get_password_hash(user_data.password)

    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        username=username,
        hashed_password=hashed_password,
    )
    db.add(user)
    db.flush()  # Assign ID before commit for response

    return _user_to_response(user)


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return a JWT access token.

    - Looks up the user by email.
    - Verifies the password using bcrypt.
    - Returns a bearer token and basic user info.
    """
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token_data: Dict[str, Any] = {"sub": str(user.id)}
    access_token = create_access_token(token_data)

    return TokenResponse(access_token=access_token, user=_user_to_response(user))


@router.post("/logout")
async def logout():
    """
    Logout endpoint.

    Tokens are stateless JWTs, so "logout" is handled client-side by
    deleting the stored token. This endpoint exists primarily for symmetry
    and future extension (e.g., token blacklisting).
    """
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """
    Get current authenticated user from the JWT access token.

    The token must be sent as an `Authorization: Bearer <token>` header.
    """
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return _user_to_response(user)

