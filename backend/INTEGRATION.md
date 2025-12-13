# FastAPI Backend Integration Guide

This guide explains how to connect the frontend to the FastAPI backend.

## Quick Start

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Backend Server

```bash
# Option 1: Using the run script
python run.py

# Option 2: Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 3. Configure Frontend

The frontend is already configured to use the FastAPI backend. The API base URL is set in `client/src/config/api.ts`.

To change the backend URL, set the environment variable:
```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

Or update `client/src/config/api.ts` directly.

## API Endpoints

All endpoints are prefixed with `/api`:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Practice**: `/api/practice/*`
- **Leaderboard**: `/api/leaderboard/*`
- **Profile**: `/api/profile/*`
- **Tracker**: `/api/tracker/*`

## Using the API in Frontend

### Example: Fetching Practice Exercises

```typescript
import { API_ENDPOINTS } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

function PracticeComponent() {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.practice.exercises()],
    queryFn: async () => {
      const res = await fetch(API_ENDPOINTS.practice.exercises());
      return res.json();
    },
  });
  
  // ... rest of component
}
```

### Example: Making POST Requests

```typescript
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/config/api";

async function startPracticeSession(skillType: string) {
  const res = await apiRequest(
    "POST",
    API_ENDPOINTS.practice.startSession(),
    { skill_type: skillType }
  );
  return res.json();
}
```

## Running Both Servers

### Development Setup

1. **Terminal 1 - FastAPI Backend:**
   ```bash
   cd backend
   python run.py
   ```

2. **Terminal 2 - Frontend (Express + Vite):**
   ```bash
   npm run dev
   ```

The frontend will be served at `http://localhost:5000` and will make API calls to `http://localhost:8000/api`.

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5000` (Express server)
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)

To add more origins, update `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",
        "http://your-frontend-url:port",
        # Add more origins as needed
    ],
    # ...
)
```

## Testing the API

### Using Swagger UI

Visit `http://localhost:8000/docs` for interactive API documentation.

### Using curl

```bash
# Health check
curl http://localhost:8000/api/health

# Get practice exercises
curl http://localhost:8000/api/practice/exercises

# Get leaderboard
curl http://localhost:8000/api/leaderboard/
```

## Next Steps

1. **Implement Authentication**: Add JWT token generation and verification
2. **Add Database**: Connect to PostgreSQL or your preferred database
3. **Implement AI Feedback**: Integrate with OpenAI or your AI service
4. **Add File Upload**: Handle audio/video file uploads for practice submissions
5. **Add WebSocket**: Real-time features for live practice sessions

## Troubleshooting

### CORS Errors

If you see CORS errors, make sure:
1. The backend is running on port 8000
2. Your frontend origin is in the `allow_origins` list
3. You're using the correct API base URL in the frontend

### Connection Refused

If you get connection refused errors:
1. Verify the backend is running: `curl http://localhost:8000/api/health`
2. Check the port isn't already in use
3. Verify firewall settings allow connections to port 8000

