# Simple Video Rendering Script
# Render 1080p video with basic settings

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Video Rendering - 1080p Quality" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create output directory
if (-not (Test-Path "out")) {
    New-Item -ItemType Directory -Path "out" | Out-Null
}

Write-Host "Project: How to Learn Programming" -ForegroundColor White
Write-Host "Duration: 4 minutes 23 seconds" -ForegroundColor White
Write-Host "Resolution: 1920x1080 (1080p)" -ForegroundColor White
Write-Host ""

# Clean temp directory
$tempPath = "$env:TEMP\remotion-*"
Write-Host "Cleaning temp files..." -ForegroundColor Yellow
Remove-Item $tempPath -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Rendering video..." -ForegroundColor Cyan
Write-Host "This may take 5-10 minutes..." -ForegroundColor Yellow
Write-Host ""

$startTime = Get-Date

try {
    npx remotion render src/remotion/index.ts MyVideo out/how-to-learn-programming.mp4 `
        --public-dir projects/how-to-learn-programming/ `
        --codec h264 `
        --quality 70 `
        --log verbose

    $endTime = Get-Date
    $duration = $endTime - $startTime

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Rendering Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Output: out/how-to-learn-programming.mp4" -ForegroundColor White
    Write-Host "Rendering time: $($duration.TotalMinutes.ToString('F2')) minutes" -ForegroundColor White
    Write-Host ""

    # Show file size
    $fileSize = (Get-Item "out/how-to-learn-programming.mp4").Length / 1MB
    Write-Host "File size: $($fileSize.ToString('F2')) MB" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Rendering Failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Close other applications to free memory" -ForegroundColor White
    Write-Host "2. Run: Remove-Item `$env:TEMP\remotion-* -Recurse -Force" -ForegroundColor White
    Write-Host "3. Try rendering with lower quality" -ForegroundColor White
    Write-Host ""
    exit 1
}
