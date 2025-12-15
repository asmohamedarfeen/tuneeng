# TuneEng LSRW Platform

Full-stack English communication learning platform with FastAPI backend and React frontend.

## Quick Start

### Single Command to Run Everything

```bash
python start.py
```

That's it! This will:
- ✅ Check if frontend is built
- ✅ Build frontend automatically if needed
- ✅ Start FastAPI server serving both frontend and API

**Access your app at:** http://localhost:8000

## First Time Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Run Everything

```bash
# From project root
python start.py
```

## Alternative: Using npm

You can also use npm to start:

```bash
npm start
```

This runs `python start.py` under the hood.

## What Gets Started

When you run `python start.py`:

- **Frontend (React App):** http://localhost:8000
  - Landing page, practice hub, profile, leaderboard, etc.
  
- **API Endpoints:** http://localhost:8000/api/*
  - Authentication, practice exercises, leaderboard, profile, tracker
  
- **API Documentation:** http://localhost:8000/docs
  - Interactive Swagger UI for testing API endpoints

## Project Structure

```
TuneEng-1/
├── start.py              # 🚀 Main entry point - run this!
├── backend/              # FastAPI backend
│   ├── main.py          # FastAPI app (serves frontend + API)
│   ├── app/             # Application code
│   │   └── routers/     # API route handlers
│   └── requirements.txt # Python dependencies
├── client/              # React frontend
│   └── src/            # Frontend source code
├── Landing/            # Landing page module
└── dist/               # Built frontend (generated)
```

## Development

### Backend Only

```bash
cd backend
python main.py
```

### Frontend Only (Development)

```bash
npm run dev
```

### Build Frontend Only

```bash
npm run build
```

## API Endpoints

All API endpoints are prefixed with `/api`:

- **Authentication:** `/api/auth/*`
- **Practice:** `/api/practice/*`
- **Leaderboard:** `/api/leaderboard/*`
- **Profile:** `/api/profile/*`
- **Tracker:** `/api/tracker/*`

See http://localhost:8000/docs for full API documentation.

## Troubleshooting

### Port 8000 Already in Use

Change the port:
```bash
PORT=8001 python start.py
```

### Frontend Not Built

The script will build it automatically. Or build manually:
```bash
npm run build
```

### Python Not Found

Make sure Python 3.8+ is installed and in your PATH.

## License

MIT
"# TUNE-ENG_UPDATED" 
