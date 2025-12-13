# Quick Start Guide

## Run Everything with One Command

```bash
# From project root directory
python start.py
```

That's it! 🎉

The script will:
1. ✅ Check if frontend is built
2. ✅ Build frontend automatically if needed
3. ✅ Start FastAPI server

**Access your app at:** http://localhost:8000

- **Frontend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **API:** http://localhost:8000/api/*

## First Time Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Node.js Dependencies

```bash
# From project root
npm install
```

### 3. Run Everything

```bash
# From project root
python start.py
```

## Manual Build (Optional)

If you want to build the frontend manually first:

```bash
# From project root
npm run build
```

Then start the backend:

```bash
cd backend
python main.py
```

## Troubleshooting

### "Frontend not built" error

Run:
```bash
npm run build
```

### Port 8000 already in use

Change the port:
```bash
PORT=8001 python backend/main.py
```

### Python not found

Make sure Python 3.8+ is installed and in your PATH.

### Node.js not found

The start script will skip frontend build if Node.js isn't installed. Build manually with `npm run build`.

