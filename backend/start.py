#!/usr/bin/env python3
"""
TuneEng - Single Entry Point
=============================

Run this file to start the entire application (frontend + backend).

Usage:
    python start.py

This will:
1. Check if frontend is built
2. Build frontend if needed (npm run build)
3. Start FastAPI server serving both frontend and API
"""

import subprocess
import sys
import os
import shutil
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
BACKEND_DIR = Path(__file__).parent
FRONTEND_DIR = REPO_ROOT / "frontend"
FRONTEND_DIST = FRONTEND_DIR / "dist" / "public"


def check_node_installed():
    """Check if Node.js and npm are installed."""
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Node.js/npm not found. Skipping frontend build.")
        return False


def build_frontend():
    """Build the frontend using npm."""
    print("📦 Building frontend...")
    try:
        result = subprocess.run(
            ["npm", "run", "build"],
            cwd=FRONTEND_DIR,
            check=True,
            capture_output=True,
            text=True,
        )
        print("✅ Frontend built successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend build failed:")
        if e.stderr:
            print(e.stderr)
        if e.stdout:
            print(e.stdout)
        return False


def copy_logos():
    """Copy logos from Landing to client public folder."""
    src = FRONTEND_DIR / "Landing" / "public" / "logos"
    dst = FRONTEND_DIR / "client" / "public" / "logos"
    
    if src.exists() and src.is_dir():
        dst.mkdir(parents=True, exist_ok=True)
        shutil.copytree(src, dst, dirs_exist_ok=True)
        print("✅ Company logos copied to client/public/logos")
        
        # Verify logos exist
        required_logos = ["tcs.svg", "infosys.svg", "wipro.svg", "accenture.svg", 
                         "cognizant.png", "hcl.svg", "capgemini.svg", "ibm.svg"]
        missing = [logo for logo in required_logos if not (dst / logo).exists()]
        if missing:
            print(f"⚠️  Missing logos: {', '.join(missing)}")
            print("   Logos should be placed in client/public/logos/ directory")
        else:
            print("✅ All required logos are present")
        return True
    return False


def check_frontend_built():
    """Check if frontend is already built."""
    index_file = FRONTEND_DIST / "index.html"
    return index_file.exists()


def start_backend():
    """Start the FastAPI backend server."""
    print("\n" + "=" * 60)
    print("🚀 Starting TuneEng Full Stack Application")
    print("=" * 60)
    print("   Frontend and API will be served at: http://localhost:8000")
    print("   API docs available at: http://localhost:8000/docs")
    print("   Press Ctrl+C to stop the server")
    print("=" * 60 + "\n")
    
    os.chdir(BACKEND_DIR)
    # Use the Python executable that's running this script
    python_exe = sys.executable
    os.execvp(python_exe, [python_exe, "main.py"])


def main():
    """Main entry point."""
    print("=" * 60)
    print("TuneEng - Starting Full Stack Application")
    print("=" * 60)
    
    # Check if Node.js is installed
    if not check_node_installed():
        print("⚠️  Node.js/npm not found. Skipping frontend build.")
        print("   Please build the frontend manually with: cd frontend && npm run build")
        print("   Then run: python backend/main.py")
        print("\n   Starting backend anyway...\n")
        start_backend()
        return
    
    # Copy logos first (needed for build)
    if copy_logos():
        print("")  # Add spacing
    
    # Check if frontend is already built
    if check_frontend_built():
        print("✅ Frontend already built, skipping build step.")
        # Still copy logos in case they're missing from dist
        copy_logos()
    else:
        print("📦 Frontend not found, building now...")
        if not build_frontend():
            print("\n⚠️  Frontend build failed, but starting backend anyway...")
            print("   You can build it manually later with: cd frontend && npm run build")
            print("   The backend will still serve API endpoints.\n")
    
    # Start the backend (which will serve both frontend and API)
    start_backend()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down...")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

