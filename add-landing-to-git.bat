@echo off
chcp 65001 >nul
cd /d "E:\Project's\TuneEng-1"

echo ========================================
echo Adding Landing folder to Git
echo ========================================
echo.

echo [1/2] Adding Landing folder to git (node_modules will be excluded by .gitignore)...
git add Landing/
if errorlevel 1 (
    echo ERROR: Failed to add Landing folder
    pause
    exit /b 1
)

echo [2/2] Checking status...
git status --short Landing/

echo.
echo ========================================
echo SUCCESS! Landing folder added to git
echo ========================================
echo.
echo You can now commit and push:
echo   git commit -m "Add Landing folder"
echo   git push
echo.
pause

