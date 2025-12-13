"""
Contact Router

Handles contact form submissions and support inquiries.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

router = APIRouter()


# Request/Response Models
class ContactSubmission(BaseModel):
    """Contact form submission model."""
    name: str
    email: EmailStr
    message: str


class ContactResponse(BaseModel):
    """Contact submission response model."""
    success: bool
    message: str
    submission_id: Optional[str] = None


@router.post("/submit", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact(contact_data: ContactSubmission):
    """
    Submit a contact form inquiry.
    
    TODO: Store submissions in database and send email notifications.
    """
    try:
        # TODO: Save to database
        # from app.database import get_db
        # db = next(get_db())
        # contact_record = ContactSubmissionDB(...)
        # db.add(contact_record)
        # db.commit()
        
        # TODO: Send email notification
        # from app.email import send_contact_notification
        # await send_contact_notification(contact_data)
        
        # Generate a simple submission ID for tracking
        submission_id = f"CONTACT-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Log the submission (in production, this would go to database)
        print(f"📧 Contact submission received:")
        print(f"   Name: {contact_data.name}")
        print(f"   Email: {contact_data.email}")
        print(f"   Message: {contact_data.message[:100]}...")
        print(f"   Submission ID: {submission_id}")
        
        return {
            "success": True,
            "message": "Thank you for contacting us! We'll get back to you soon.",
            "submission_id": submission_id,
        }
    except Exception as e:
        print(f"❌ Error processing contact submission: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process your submission. Please try again later.",
        )


@router.get("/health")
async def contact_health():
    """Health check for contact service."""
    return {"status": "healthy", "service": "contact"}

