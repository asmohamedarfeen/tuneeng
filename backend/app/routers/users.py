from typing import Optional, List

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security import decode_access_token

router = APIRouter()
security = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> int:
    """Get current authenticated user ID from JWT token."""
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
        return user_id
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


class UserUpdate(BaseModel):
    """User update request model."""
    full_name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    """User response model."""
    id: int
    email: str
    full_name: str
    username: Optional[str] = None


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        username=user.username,
    )


@router.get("/", response_model=List[UserResponse])
async def get_users(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Get all users - requires authentication.
    
    Note: In production, add admin role check to restrict this endpoint.
    For now, any authenticated user can access this.
    """
    users = db.query(User).all()
    return [_user_to_response(u) for u in users]


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Get user by ID - requires authentication.
    
    Users can only view their own profile unless they are admin.
    """
    # Users can only view their own data (or implement admin check)
    if user_id != current_user_id:
        # In production, check if current_user is admin
        # For now, only allow viewing own profile
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own profile",
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return _user_to_response(user)

