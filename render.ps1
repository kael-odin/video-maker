# Video Rendering Script
# Usage: .\render.ps1 [quality]
# quality: preview (fast), standard (balanced), high (best quality)

param(
    [string]$quality = "standard"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Video Podcast Maker - Rendering Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set quality parameters
switch ($quality) {
    "preview" {
        $codecArgs = "--codec h264 --quality 60"
        $outputSuffix = "-preview"
        Write-Host "Quality: Preview (fast rendering)" -ForegroundColor Yellow
    }
    "high" {
        $codecArgs = "--codec h264 --quality 100 --crf 18"
        $outputSuffix = "-4k"
        Write-Host "Quality: High (best quality)" -ForegroundColor Green
    }
    default {
        $codecArgs = "--codec h264 --quality 85"
        $outputSuffix = "-standard"
        Write-Host "Quality: Standard (balanced)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Project: How to Learn Programming" -ForegroundColor White
Write-Host "Duration: 4 minutes 23 seconds" -ForegroundColor White
Write-Host "Frames: 7914 (30fps)" -ForegroundColor White
Write-Host ""

# Create output directory
if (-not (Test-Path "out")) {
    New-Item -ItemType Directory -Path "out" | Out-Null
}

# Render 4K horizontal video
Write-Host "Rendering 4K horizontal video..." -ForegroundColor Cyan
$startTime = Get-Date

npx remotion render src/remotion/index.ts MyVideo "out/how-to-learn-programming$outputSuffix.mp4" `
    --public-dir projects/how-to-learn-programming/ `
    $codecArgs.Split(' ')

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Rendering Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Output: out/how-to-learn-programming$outputSuffix.mp4" -ForegroundColor White
Write-Host "Rendering time: $($duration.TotalMinutes.ToString('F2')) minutes" -ForegroundColor White
Write-Host ""

# Ask if user wants to render vertical video
$renderVertical = Read-Host "Render vertical video for shorts? (y/n)"
if ($renderVertical -eq 'y') {
    Write-Host ""
    Write-Host "Rendering vertical video..." -ForegroundColor Cyan
    
    npx remotion render src/remotion/index.ts MyVideoVertical "out/how-to-learn-programming-vertical.mp4" `
        --public-dir projects/how-to-learn-programming/ `
        $codecArgs.Split(' ')
    
    Write-Host ""
    Write-Host "Vertical video created: out/how-to-learn-programming-vertical.mp4" -ForegroundColor Green
}

# Ask if user wants to generate thumbnails
$renderThumbs = Read-Host "Generate thumbnails? (y/n)"
if ($renderThumbs -eq 'y') {
    Write-Host ""
    Write-Host "Generating thumbnails..." -ForegroundColor Cyan
    
    # 16:9 thumbnail
    npx remotion render src/remotion/index.ts Thumbnail16x9 "out/thumbnail-16x9.png" `
        --public-dir projects/how-to-learn-programming/
    
    # 4:3 thumbnail
    npx remotion render src/remotion/index.ts Thumbnail4x3 "out/thumbnail-4x3.png" `
        --public-dir projects/how-to-learn-programming/
    
    # 3:4 thumbnail (Xiaohongshu)
    npx remotion render src/remotion/index.ts Thumbnail3x4 "out/thumbnail-3x4.png" `
        --public-dir projects/how-to-learn-programming/
    
    Write-Host ""
    Write-Host "Thumbnails created in out/" -ForegroundColor Green
}

Write-Host ""
Write-Host "All done! Check the out/ directory for your videos." -ForegroundColor Cyan
Write-Host ""
