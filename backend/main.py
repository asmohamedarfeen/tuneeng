"""
FastAPI Backend for TuneEng LSRW Platform

Main application entry point with CORS configuration and route registration.
Serves both the API and the frontend static files.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from pathlib import Path
from contextlib import asynccontextmanager

from app.routers import auth, users, practice, leaderboard, profile, tracker, contact
from app.database import Base, engine, SessionLocal
from app.models import User
from app.security import get_password_hash
from app.middleware.rate_limit import RateLimitMiddleware


# Get the project root directory (parent of backend folder)
PROJECT_ROOT = Path(__file__).parent.parent
FRONTEND_DIST = PROJECT_ROOT / "dist" / "public"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown events."""
    # Startup
    print("🚀 Starting TuneEng FastAPI Backend...")

    # Ensure database tables exist
    Base.metadata.create_all(bind=engine)

    # Seed a default demo user for easy login during development
    try:
        db = SessionLocal()
        demo_email = "demo.user@example.com"
        demo_password = "DemoPass123!"

        existing = db.query(User).filter(User.email == demo_email).first()
        if not existing:
            demo_user = User(
                email=demo_email,
                full_name="Demo User",
                username="demouser",
                hashed_password=get_password_hash(demo_password),
            )
            db.add(demo_user)
            db.commit()
            print("✅ Seeded demo user:", demo_email, "/", demo_password)
        else:
            print("ℹ️  Demo user already exists:", demo_email)
    except Exception as e:
        print("⚠️  Failed to seed demo user:", e)
    finally:
        try:
            db.close()
        except Exception:
            pass
    
    # Check if frontend is built
    if FRONTEND_DIST.exists() and (FRONTEND_DIST / "index.html").exists():
        print(f"✅ Frontend found at {FRONTEND_DIST}")
    else:
        print(f"⚠️  Frontend not built yet. Run 'npm run build' first.")
        print(f"   Expected location: {FRONTEND_DIST}")
    
    yield
    # Shutdown
    print("🛑 Shutting down TuneEng FastAPI Backend...")


# Initialize FastAPI app
app = FastAPI(
    title="TuneEng LSRW API",
    description="Backend API for TuneEng LSRW - English Communication Learning Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Rate Limiting Middleware - Must be before CORS
app.add_middleware(RateLimitMiddleware)

# CORS Configuration - Allow frontend to connect
# In production, restrict to specific origins
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:8000,http://localhost:5000,http://localhost:5173,http://localhost:3000,http://127.0.0.1:8000,http://127.0.0.1:5000,http://127.0.0.1:5173,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(practice.router, prefix="/api/practice", tags=["Practice"])
app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["Leaderboard"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(tracker.router, prefix="/api/tracker", tags=["Tracker"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return JSONResponse({"status": "healthy", "service": "tuneeng-api"})


@app.get("/api/test-logos")
async def test_logos():
    """Test endpoint to verify logos are accessible."""
    logos_dir = FRONTEND_DIST / "logos"
    if not logos_dir.exists():
        logos_dir = PROJECT_ROOT / "client" / "public" / "logos"
    
    if not logos_dir.exists():
        return JSONResponse({"error": "Logos directory not found"}, status_code=404)
    
    logos = {}
    for logo_file in logos_dir.glob("*"):
        if logo_file.is_file():
            logos[logo_file.name] = {
                "exists": True,
                "size": logo_file.stat().st_size,
                "url": f"/logos/{logo_file.name}"
            }
    
    return JSONResponse({
        "logos_dir": str(logos_dir),
        "logos": logos,
        "count": len(logos)
    })


# Mount static files (CSS, JS, images, etc.) - must be before catch-all route
if FRONTEND_DIST.exists():
    # Mount assets directory for static files
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    # Mount logos directory for company logos
    # Vite copies public folder contents to dist, so logos should be in dist/public/logos
    logos_dir = FRONTEND_DIST / "logos"
    if not logos_dir.exists():
        # Fallback to source public folder (for development or if build didn't copy)
        source_logos = PROJECT_ROOT / "client" / "public" / "logos"
        if source_logos.exists():
            logos_dir = source_logos
            print(f"⚠️  Using source logos from: {logos_dir}")
        else:
            print(f"⚠️  Logos not found in dist or source")
    if logos_dir.exists():
        # List available logos for debugging
        available_logos = list(logos_dir.glob("*"))
        print(f"✅ Logos mounted from: {logos_dir}")
        print(f"   Available logos: {[f.name for f in available_logos]}")
        app.mount("/logos", StaticFiles(directory=logos_dir), name="logos")

    # Mount images directory for illustrative images (e.g. LSRW module cards)
    images_dir = FRONTEND_DIST / "images"
    if images_dir.exists():
        print(f"✅ Images mounted from: {images_dir}")
        app.mount("/images", StaticFiles(directory=images_dir), name="images")
    
    # Serve root-level static files (favicon, etc.) - handle in catch-all route


# Root endpoint - serve frontend
@app.get("/")
async def root():
    """Root endpoint - serves the React frontend."""
    index_path = FRONTEND_DIST / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    else:
        return JSONResponse(
            {
                "error": "Frontend not built",
                "message": "Please run 'npm run build' to build the frontend",
                "expected_path": str(index_path),
            },
            status_code=503,
        )


# Catch-all route for SPA - must be last
# This serves index.html for all non-API routes, allowing React Router to handle routing
@app.get("/{full_path:path}")
async def serve_spa(request: Request, full_path: str):
    """
    Serve the React SPA for all non-API routes.
    This allows React Router to handle client-side routing.
    """
    # Don't interfere with API routes
    if full_path.startswith("api/"):
        return JSONResponse({"error": "Not found"}, status_code=404)
    
    # Don't interfere with static assets (handled by mount)
    if full_path.startswith("assets/"):
        return JSONResponse({"error": "Not found"}, status_code=404)
    
    # Don't interfere with logos (handled by mount)
    if full_path.startswith("logos/"):
        return JSONResponse({"error": "Not found"}, status_code=404)

    # Don't interfere with images (handled by mount)
    if full_path.startswith("images/"):
        return JSONResponse({"error": "Not found"}, status_code=404)
    
    # Serve root-level static files if they exist
    static_files = ["favicon.ico", "robots.txt", "manifest.json", "favicon.png"]
    if full_path in static_files:
        static_path = FRONTEND_DIST / full_path
        if static_path.exists():
            return FileResponse(static_path)
        return JSONResponse({"error": "Not found"}, status_code=404)
    
    # Serve index.html for all other routes (SPA routing)
    index_path = FRONTEND_DIST / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    else:
        return JSONResponse(
            {
                "error": "Frontend not built",
                "message": "Please run 'npm run build' to build the frontend",
                "expected_path": str(index_path),
            },
            status_code=503,
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info",
    )

