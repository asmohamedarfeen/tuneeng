# PowerShell script to delete CI/CD files
$projectPath = "E:\Project's\TUNEENG_01"

Set-Location $projectPath

# Delete workflow file
$workflowFile = ".github\workflows\ci-cd.yml"
if (Test-Path $workflowFile) {
    Remove-Item $workflowFile -Force
    Write-Host "Deleted $workflowFile"
}

# Delete disabled workflow file if exists
$disabledFile = ".github\workflows\ci-cd.yml.disabled"
if (Test-Path $disabledFile) {
    Remove-Item $disabledFile -Force
    Write-Host "Deleted $disabledFile"
}

# Vercel has been completely removed from this project

Write-Host "`nCI/CD files removed successfully!"
Write-Host "GitHub Actions will no longer run on push."

