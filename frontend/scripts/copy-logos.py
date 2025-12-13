#!/usr/bin/env python3
"""Copy logos from Landing/public/logos to client/public/logos"""

import shutil
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
SRC = PROJECT_ROOT / "Landing" / "public" / "logos"
DST = PROJECT_ROOT / "client" / "public" / "logos"

if SRC.exists():
    DST.mkdir(parents=True, exist_ok=True)
    shutil.copytree(SRC, DST, dirs_exist_ok=True)
    print(f"✅ Logos copied from {SRC} to {DST}")
else:
    print(f"⚠️  Source logos not found at {SRC}")

