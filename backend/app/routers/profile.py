"""
Profile Router

Handles user profile management, preferences, learning stats, and personal information.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Dict, List, Any

router = APIRouter()
security = HTTPBearer()


class ProfileUpdate(BaseModel):
    """Profile update request model."""
    full_name: Optional[str] = None
    username: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class LearningStats(BaseModel):
    """Learning statistics model."""
    total_practice_time: int  # minutes
    exercises_completed: int
    current_streak: int  # days
    longest_streak: int  # days
    skill_progress: Dict[str, float]  # skill_type -> percentage
    badges_earned: List[str]


class ProfileResponse(BaseModel):
    """Profile response model."""
    user_id: int
    email: str
    full_name: str
    username: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    learning_stats: LearningStats
    preferences: Dict[str, Any]


@router.get("/", response_model=ProfileResponse)
async def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Get current user's profile."""
    # Placeholder implementation
    return {
        "user_id": 1,
        "email": "user@example.com",
        "full_name": "Test User",
        "username": "testuser",
        "bio": "Learning English for corporate success!",
        "avatar_url": None,
        "learning_stats": {
            "total_practice_time": 1200,
            "exercises_completed": 45,
            "current_streak": 7,
            "longest_streak": 15,
            "skill_progress": {
                "listening": 85.5,
                "speaking": 78.2,
                "reading": 92.0,
                "writing": 88.7,
            },
            "badges_earned": ["first_exercise", "week_streak", "listening_master"],
        },
        "preferences": {
            "notifications": True,
            "theme": "light",
            "language": "en",
        },
    }


@router.put("/", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Update user profile."""
    # Placeholder implementation
    return {
        "user_id": 1,
        "email": "user@example.com",
        "full_name": profile_data.full_name or "Test User",
        "username": profile_data.username or "testuser",
        "bio": profile_data.bio,
        "avatar_url": profile_data.avatar_url,
        "learning_stats": {
            "total_practice_time": 1200,
            "exercises_completed": 45,
            "current_streak": 7,
            "longest_streak": 15,
            "skill_progress": {
                "listening": 85.5,
                "speaking": 78.2,
                "reading": 92.0,
                "writing": 88.7,
            },
            "badges_earned": ["first_exercise", "week_streak"],
        },
        "preferences": {},
    }


@router.get("/stats", response_model=LearningStats)
async def get_learning_stats(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Get user's learning statistics."""
    # Placeholder implementation
    return {
        "total_practice_time": 1200,
        "exercises_completed": 45,
        "current_streak": 7,
        "longest_streak": 15,
        "skill_progress": {
            "listening": 85.5,
            "speaking": 78.2,
            "reading": 92.0,
            "writing": 88.7,
        },
        "badges_earned": ["first_exercise", "week_streak", "listening_master"],
    }

