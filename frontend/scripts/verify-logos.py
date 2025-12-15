#!/usr/bin/env python3
"""Verify logo files are valid"""

from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).parent.parent
LOGOS_DIR = PROJECT_ROOT / "client" / "public" / "logos"
DIST_LOGOS_DIR = PROJECT_ROOT / "dist" / "public" / "logos"

def check_file(filepath):
    """Check if a file exists and has content."""
    if not filepath.exists():
        return False, "File does not exist"
    
    size = filepath.stat().st_size
    if size == 0:
        return False, "File is empty"
    
    # Check if it's a valid image by reading first bytes
    try:
        with open(filepath, 'rb') as f:
            header = f.read(10)
            # Check for common image formats
            if filepath.suffix == '.svg':
                # SVG should start with <?xml or <svg
                content = f.read(100).decode('utf-8', errors='ignore')
                if '<?xml' in content or '<svg' in content:
                    return True, f"Valid SVG ({size} bytes)"
                return False, "Invalid SVG format"
            elif filepath.suffix == '.png':
                if header.startswith(b'\x89PNG\r\n\x1a\n'):
                    return True, f"Valid PNG ({size} bytes)"
                return False, "Invalid PNG format"
            else:
                return True, f"File exists ({size} bytes)"
    except Exception as e:
        return False, f"Error reading file: {e}"

print("=" * 60)
print("Verifying Logo Files")
print("=" * 60)

logos = ["tcs.svg", "infosys.svg", "wipro.svg", "accenture.svg", 
         "cognizant.png", "hcl.svg", "capgemini.svg", "ibm.svg"]

print("\n📁 Source logos (client/public/logos):")
print("-" * 60)
all_valid = True
for logo in logos:
    filepath = LOGOS_DIR / logo
    valid, msg = check_file(filepath)
    status = "✅" if valid else "❌"
    print(f"{status} {logo:20} - {msg}")
    if not valid:
        all_valid = False

print("\n📁 Dist logos (dist/public/logos):")
print("-" * 60)
for logo in logos:
    filepath = DIST_LOGOS_DIR / logo
    valid, msg = check_file(filepath)
    status = "✅" if valid else "❌"
    print(f"{status} {logo:20} - {msg}")
    if not valid:
        all_valid = False

if not all_valid:
    print("\n⚠️  Some logos are invalid. They may need to be re-downloaded.")
    print("   Logos should be placed in client/public/logos/ directory")
    sys.exit(1)
else:
    print("\n✅ All logos are valid!")
    sys.exit(0)
