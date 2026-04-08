#!/bin/bash

# Video Rendering Script
# Usage: ./render.sh [quality]
# quality: preview (fast), standard (balanced), high (best quality)

QUALITY=${1:-standard}

echo "========================================"
echo "Video Podcast Maker - Rendering Script"
echo "========================================"
echo ""

# Set quality parameters
case $QUALITY in
    preview)
        CODEC_ARGS="--codec h264 --quality 60"
        OUTPUT_SUFFIX="-preview"
        echo "Quality: Preview (fast rendering)"
        ;;
    high)
        CODEC_ARGS="--codec h264 --quality 100 --crf 18"
        OUTPUT_SUFFIX="-4k"
        echo "Quality: High (best quality)"
        ;;
    *)
        CODEC_ARGS="--codec h264 --quality 85"
        OUTPUT_SUFFIX="-standard"
        echo "Quality: Standard (balanced)"
        ;;
esac

echo ""
echo "Project: How to Learn Programming"
echo "Duration: 4 minutes 23 seconds"
echo "Frames: 7914 (30fps)"
echo ""

# Create output directory
mkdir -p out

# Render 4K horizontal video
echo "Rendering 4K horizontal video..."
START_TIME=$(date +%s)

npx remotion render src/remotion/index.ts MyVideo "out/how-to-learn-programming${OUTPUT_SUFFIX}.mp4" \
    --public-dir projects/how-to-learn-programming/ \
    $CODEC_ARGS

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "========================================"
echo "Rendering Complete!"
echo "========================================"
echo ""
echo "Output: out/how-to-learn-programming${OUTPUT_SUFFIX}.mp4"
echo "Rendering time: $(($DURATION / 60)) minutes $(($DURATION % 60)) seconds"
echo ""

# Ask if user wants to render vertical video
read -p "Render vertical video for shorts? (y/n) " RENDER_VERTICAL
if [ "$RENDER_VERTICAL" = "y" ]; then
    echo ""
    echo "Rendering vertical video..."
    
    npx remotion render src/remotion/index.ts MyVideoVertical "out/how-to-learn-programming-vertical.mp4" \
        --public-dir projects/how-to-learn-programming/ \
        $CODEC_ARGS
    
    echo ""
    echo "Vertical video created: out/how-to-learn-programming-vertical.mp4"
fi

# Ask if user wants to generate thumbnails
read -p "Generate thumbnails? (y/n) " RENDER_THUMBS
if [ "$RENDER_THUMBS" = "y" ]; then
    echo ""
    echo "Generating thumbnails..."
    
    # 16:9 thumbnail
    npx remotion render src/remotion/index.ts Thumbnail16x9 "out/thumbnail-16x9.png" \
        --public-dir projects/how-to-learn-programming/
    
    # 4:3 thumbnail
    npx remotion render src/remotion/index.ts Thumbnail4x3 "out/thumbnail-4x3.png" \
        --public-dir projects/how-to-learn-programming/
    
    # 3:4 thumbnail (Xiaohongshu)
    npx remotion render src/remotion/index.ts Thumbnail3x4 "out/thumbnail-3x4.png" \
        --public-dir projects/how-to-learn-programming/
    
    echo ""
    echo "Thumbnails created in out/"
fi

echo ""
echo "All done! Check the out/ directory for your videos."
echo ""
