# 清理临时文件

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "清理临时文件..." -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Cyan

# 删除临时音频片段
Write-Host "`n删除临时音频片段..." -ForegroundColor Yellow
$partFiles = Get-ChildItem -Path projects -Filter "part_*.wav" -Recurse -ErrorAction SilentlyContinue
if ($partFiles) {
    $partFiles | Remove-Item -Force
    Write-Host "  已删除 $($partFiles.Count) 个临时音频片段" -ForegroundColor Green
} else {
    Write-Host "  没有找到临时音频片段" -ForegroundColor Gray
}

# 删除 concat_list.txt
Write-Host "`n删除 concat_list.txt..." -ForegroundColor Yellow
$concatFiles = Get-ChildItem -Path projects -Filter "concat_list.txt" -Recurse -ErrorAction SilentlyContinue
if ($concatFiles) {
    $concatFiles | Remove-Item -Force
    Write-Host "  已删除 $($concatFiles.Count) 个 concat_list.txt 文件" -ForegroundColor Green
} else {
    Write-Host "  没有找到 concat_list.txt 文件" -ForegroundColor Gray
}

# 删除 public 目录下的音频文件
Write-Host "`n删除 public 目录下的音频文件..." -ForegroundColor Yellow
$publicAudio = Get-ChildItem -Path public -Filter "podcast_audio.*" -ErrorAction SilentlyContinue
if ($publicAudio) {
    $publicAudio | Remove-Item -Force
    Write-Host "  已删除 $($publicAudio.Count) 个音频文件" -ForegroundColor Green
} else {
    Write-Host "  没有找到音频文件" -ForegroundColor Gray
}

# 删除 Python 缓存
Write-Host "`n删除 Python 缓存..." -ForegroundColor Yellow
$pycacheDirs = Get-ChildItem -Path . -Directory -Filter "__pycache__" -Recurse -ErrorAction SilentlyContinue
if ($pycacheDirs) {
    $pycacheDirs | Remove-Item -Recurse -Force
    Write-Host "  已删除 $($pycacheDirs.Count) 个 __pycache__ 目录" -ForegroundColor Green
} else {
    Write-Host "  没有找到 Python 缓存" -ForegroundColor Gray
}

# 删除 .pyc 文件
Write-Host "`n删除 .pyc 文件..." -ForegroundColor Yellow
$pycFiles = Get-ChildItem -Path . -Filter "*.pyc" -Recurse -ErrorAction SilentlyContinue
if ($pycFiles) {
    $pycFiles | Remove-Item -Force
    Write-Host "  已删除 $($pycFiles.Count) 个 .pyc 文件" -ForegroundColor Green
} else {
    Write-Host "  没有找到 .pyc 文件" -ForegroundColor Gray
}

# 统计清理结果
Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "清理完成！" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan

# 显示当前仓库大小
Write-Host "`n当前仓库大小:" -ForegroundColor Yellow
$totalSize = (Get-ChildItem -Path . -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "  总大小: $totalSizeMB MB" -ForegroundColor Cyan
