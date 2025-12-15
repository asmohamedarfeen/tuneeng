@echo off
cd /d "E:\Project's\TuneEng-1"

echo Checking git status...
git status

if not exist .git (
    echo Initializing git repository...
    git init
)

echo Checking remote...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Adding remote origin...
    git remote add origin https://github.com/A-Zentrix/TUNELAND.git
) else (
    echo Updating remote URL...
    git remote set-url origin https://github.com/A-Zentrix/TUNELAND.git
)

echo Staging all changes...
git add .
REM Ensure Landing folder is included (if not already tracked)
git add Landing/ 2>nul

echo Committing changes...
git commit -m "Fix CI/CD pipeline: Update navigation buttons, fix linting errors, add ESLint config"

echo Pushing to GitHub...
git branch -M main 2>nul
git push -u origin main
if errorlevel 1 (
    echo Trying master branch...
    git branch -M master 2>nul
    git push -u origin master
)

echo Done!
pause

