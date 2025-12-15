# PowerShell script to push code to GitHub
Set-Location "E:\Project's\TUNEENG_01"

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..."
    git init
}

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Adding remote origin..."
    git remote add origin https://github.com/A-Zentrix/TUNELAND.git
} else {
    Write-Host "Remote already exists: $remoteExists"
    Write-Host "Updating remote URL..."
    git remote set-url origin https://github.com/A-Zentrix/TUNELAND.git
}

# Stage all changes
Write-Host "Staging all changes..."
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "Committing changes..."
    git commit -m "Update navigation buttons: Replace Learn/Track/Manage with Dashboard/Practice/Learn/Assessments/Community/Contact"
    
    Write-Host "Pushing to GitHub..."
    git push -u origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Trying master branch..."
        git push -u origin master
    }
} else {
    Write-Host "No changes to commit."
}

Write-Host "Done!"

