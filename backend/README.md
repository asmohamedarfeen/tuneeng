# TuneEng FastAPI Backend

Backend API server for the TuneEng LSRW platform built with FastAPI.

## Features

- **FastAPI** - Modern, fast web framework for building APIs
- **CORS Enabled** - Configured to work with frontend applications
- **RESTful API** - Well-structured API endpoints
- **Type Safety** - Pydantic models for request/response validation
- **Modular Structure** - Organized routers for different features

## Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── README.md              # This file
└── app/
    ├── __init__.py
    └── routers/
        ├── __init__.py
        ├── auth.py        # Authentication endpoints
        ├── users.py       # User management
        ├── practice.py   # LSRW practice exercises
        ├── leaderboard.py # Rankings and scores
        ├── profile.py    # User profiles
        └── tracker.py    # Progress tracking
```

## Setup

### Quick Start (Recommended)

**One command to run everything:**

```bash
# From project root
python start.py
```

This will:
1. ✅ Check if frontend is built
2. ✅ Build frontend if needed (`npm run build`)
3. ✅ Start FastAPI server serving both frontend and API

**Everything will be available at:** `http://localhost:8000`

### Manual Setup

#### 1. Install Dependencies

**Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

**Node.js dependencies (for frontend):**
```bash
# From project root
npm install
```

#### 2. Build Frontend

```bash
# From project root
npm run build
```

This creates the frontend build in `dist/public/`

#### 3. Run the Server

**From backend directory:**
```bash
cd backend
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Everything will be available at:** `http://localhost:8000`

## API Documentation

Once the server is running, you can access:

- **Interactive API Docs (Swagger UI):** http://localhost:8000/docs
- **Alternative API Docs (ReDoc):** http://localhost:8000/redoc
- **OpenAPI JSON:** http://localhost:8000/openapi.json

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users (`/api/users`)
- `GET /api/users/` - Get all users
- `GET /api/users/{user_id}` - Get user by ID

### Practice (`/api/practice`)
- `GET /api/practice/exercises` - Get practice exercises
- `POST /api/practice/sessions` - Start practice session
- `POST /api/practice/feedback` - Get AI feedback
- `GET /api/practice/sessions/{session_id}` - Get session details

### Leaderboard (`/api/leaderboard`)
- `GET /api/leaderboard/` - Get leaderboard rankings
- `GET /api/leaderboard/user/{user_id}/rank` - Get user rank

### Profile (`/api/profile`)
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update user profile
- `GET /api/profile/stats` - Get learning statistics

### Tracker (`/api/tracker`)
- `GET /api/tracker/progress` - Get progress history
- `GET /api/tracker/summary` - Get progress summary

## Frontend Integration

**The backend now serves the frontend automatically!**

When you run the backend, it serves:
- **Frontend (React App):** `http://localhost:8000/` (and all routes like `/practice`, `/profile`, etc.)
- **API Endpoints:** `http://localhost:8000/api/*`

The frontend is configured to use relative URLs (`/api`) when served from the same origin, so everything works seamlessly.

### Development with Separate Servers

If you want to run frontend and backend separately (for hot-reload during development):

1. **Terminal 1 - Backend only:**
   ```bash
   cd backend
   python main.py
   ```

2. **Terminal 2 - Frontend dev server:**
   ```bash
   npm run dev
   ```

Then set the API URL in your frontend:
```typescript
// In client/src/config/api.ts or via environment variable
VITE_API_BASE_URL=http://localhost:8000/api
```

## Development

### Adding New Endpoints

1. Create or update a router in `app/routers/`
2. Import and include the router in `main.py`
3. Define Pydantic models for request/response validation
4. Test using the Swagger UI at `/docs`

### Database Integration (Future)

To add database support:
1. Uncomment database dependencies in `requirements.txt`
2. Configure `DATABASE_URL` in `.env`
3. Create database models and migrations
4. Update routers to use database queries

## Notes

- Current implementation uses placeholder data
- Authentication is mocked (JWT tokens not fully implemented)
- Database integration is ready to be added
- AI feedback endpoints are structured but need actual AI service integration

