#!/bin/bash

# 清理临时文件

echo "======================================"
echo "清理临时文件..."
echo "======================================"

# 删除临时音频片段
echo -e "\n删除临时音频片段..."
part_count=$(find projects/ -name "part_*.wav" -type f | wc -l)
if [ $part_count -gt 0 ]; then
    find projects/ -name "part_*.wav" -type f -delete
    echo "  已删除 $part_count 个临时音频片段"
else
    echo "  没有找到临时音频片段"
fi

# 删除 concat_list.txt
echo -e "\n删除 concat_list.txt..."
concat_count=$(find projects/ -name "concat_list.txt" -type f | wc -l)
if [ $concat_count -gt 0 ]; then
    find projects/ -name "concat_list.txt" -type f -delete
    echo "  已删除 $concat_count 个 concat_list.txt 文件"
else
    echo "  没有找到 concat_list.txt 文件"
fi

# 删除 public 目录下的音频文件
echo -e "\n删除 public 目录下的音频文件..."
if ls public/podcast_audio.* 1> /dev/null 2>&1; then
    rm -f public/podcast_audio.*
    echo "  已删除音频文件"
else
    echo "  没有找到音频文件"
fi

# 删除 Python 缓存
echo -e "\n删除 Python 缓存..."
pycache_count=$(find . -type d -name "__pycache__" | wc -l)
if [ $pycache_count -gt 0 ]; then
    find . -type d -name "__pycache__" -exec rm -rf {} +
    echo "  已删除 $pycache_count 个 __pycache__ 目录"
else
    echo "  没有找到 Python 缓存"
fi

# 删除 .pyc 文件
echo -e "\n删除 .pyc 文件..."
pyc_count=$(find . -name "*.pyc" -type f | wc -l)
if [ $pyc_count -gt 0 ]; then
    find . -name "*.pyc" -type f -delete
    echo "  已删除 $pyc_count 个 .pyc 文件"
else
    echo "  没有找到 .pyc 文件"
fi

# 统计清理结果
echo -e "\n======================================"
echo "清理完成！"
echo "======================================"

# 显示当前仓库大小
echo -e "\n当前仓库大小:"
total_size=$(du -sh . | cut -f1)
echo "  总大小: $total_size"
