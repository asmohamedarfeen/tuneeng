from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, User, UserQuestionHistory, ListeningQuestion, ReadingQuestion, SpeakingQuestion, WritingQuestion

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def test_models():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    session = TestingSessionLocal()
    try:
        # 1. Create Question Types
        l_q = ListeningQuestion(content="Listening Test Q1")
        r_q = ReadingQuestion(content="Reading Test Q1")
        s_q = SpeakingQuestion(content="Speaking Test Q1")
        w_q = WritingQuestion(content="Writing Test Q1")
        
        session.add_all([l_q, r_q, s_q, w_q])
        session.commit() # Commit to get IDs
        
        print("✅ Created Question Models")

        # 2. Create User
        user = User(
            email="test@example.com",
            hashed_password="hashed_secret",
            full_name="Test User",
            username="testuser"
        )
        session.add(user)
        session.commit()
        print("✅ Created User")
        
        # 3. Create UserQuestionHistory
        history = UserQuestionHistory(
            user_id=user.id,
            listening_question_ids=[l_q.id],
            reading_question_ids=[r_q.id, 999], # Add dummy ID
            speaking_question_ids=[],
            writing_question_ids=[w_q.id]
        )
        session.add(history)
        session.commit()
        
        # 4. Verify History Retrieval
        retrieved_history = session.query(UserQuestionHistory).filter_by(user_id=user.id).first()
        
        assert retrieved_history is not None
        assert retrieved_history.listening_question_ids == [l_q.id]
        assert retrieved_history.reading_question_ids == [r_q.id, 999]
        assert retrieved_history.speaking_question_ids == []
        assert retrieved_history.writing_question_ids == [w_q.id]
        
        print(f"✅ Verified History for User {user.email}")
        print(f"   Listening IDs: {retrieved_history.listening_question_ids}")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    test_models()

