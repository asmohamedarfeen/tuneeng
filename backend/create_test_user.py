from app.database import SessionLocal
from app.models import User
from app.security import get_password_hash

def main():
    db = SessionLocal()
    email = "testuser@example.com"
    password = "TestUser@123"
    
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"✅ User already exists.")
        print(f"Email: {email}")
        print(f"Password: {password} (if not changed)")
    else:
        new_user = User(
            email=email,
            full_name="Test User",
            username="testuser",
            hashed_password=get_password_hash(password)
        )
        db.add(new_user)
        db.commit()
        print(f"🎉 Created test user!")
        print(f"Email: {email}")
        print(f"Password: {password}")
    
    db.close()

if __name__ == "__main__":
    main()
