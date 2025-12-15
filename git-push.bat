@echo off
chcp 65001 >nul
cd /d "E:\Project's\TuneEng-1"

echo ========================================
echo Git Push Script
echo ========================================
echo.

echo [1/5] Checking git repository...
if not exist .git (
    echo Initializing git repository...
    git init
    if errorlevel 1 (
        echo ERROR: Failed to initialize git
        pause
        exit /b 1
    )
)

echo [2/5] Configuring remote...
git remote remove origin 2>nul
git remote add origin https://github.com/A-Zentrix/TUNELAND.git
if errorlevel 1 (
    git remote set-url origin https://github.com/A-Zentrix/TUNELAND.git
)

echo [3/5] Staging all changes...
git add .
REM Ensure Landing folder is included (if not already tracked)
git add Landing/ 2>nul
if errorlevel 1 (
    echo ERROR: Failed to stage changes
    pause
    exit /b 1
)

echo [4/5] Committing changes...
git commit -m "Fix CI/CD pipeline: Update navigation buttons, fix linting errors, add ESLint config"
if errorlevel 1 (
    echo WARNING: No changes to commit or commit failed
)

echo [5/5] Pushing to GitHub...
git branch -M main 2>nul
git push -u origin main
if errorlevel 1 (
    echo Trying master branch...
    git branch -M master 2>nul
    git push -u origin master
    if errorlevel 1 (
        echo ERROR: Failed to push to GitHub
        echo Please check your authentication and try again
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo SUCCESS! Changes pushed to GitHub
echo ========================================
pause

