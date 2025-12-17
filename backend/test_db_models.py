from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, ListeningQuestion, ReadingQuestion, SpeakingQuestion, WritingQuestion

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
        # Create one of each question
        l_q = ListeningQuestion(content="Listening Test Q1")
        r_q = ReadingQuestion(content="Reading Test Q1")
        s_q = SpeakingQuestion(content="Speaking Test Q1")
        w_q = WritingQuestion(content="Writing Test Q1")
        
        session.add_all([l_q, r_q, s_q, w_q])
        session.commit()
        
        # Verify they exist and have IDs
        assert l_q.id is not None
        assert r_q.id is not None
        assert s_q.id is not None
        assert w_q.id is not None
        
        print("Successfully created and retrieved all question types.")
        
        # Verify content retrieval
        retrieved_l = session.query(ListeningQuestion).first()
        print(f"Retrieved Listening: {retrieved_l.content}")
        
    except Exception as e:
        print(f"Test failed: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    test_models()
