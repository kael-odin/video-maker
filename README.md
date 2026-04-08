# Video Podcast Maker

An automated pipeline to create professional video podcasts from a topic using AI-powered TTS and Remotion.

## Features

- **AI-Powered TTS**: Support for Edge TTS (Microsoft Azure Neural TTS) with high-quality Chinese voice
- **Remotion Integration**: Create 4K videos with React components
- **Visual Editing**: Real-time style editing in Remotion Studio
- **Multiple Formats**: Support for horizontal (16:9) and vertical (9:16) videos
- **Auto Subtitles**: Generate SRT subtitles automatically
- **Thumbnail Generation**: Create thumbnails for multiple platforms

## Quick Start

### Prerequisites

- Node.js >= 18
- Python >= 3.8
- FFmpeg (for audio processing)

### Installation

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Upgrade edge-tts to latest version
pip install --upgrade edge-tts
```

### Create Your First Video

#### Step 1: Prepare Your Content

Create a new project folder in `projects/`:

```bash
mkdir projects/my-video
```

Create `podcast.txt` with your content:

```
[SECTION:hero]
Your opening hook here...

[SECTION:main]
Your main content...

[SECTION:summary]
Your summary...

[SECTION:outro]
Your call to action...
```

#### Step 2: Generate Audio

```bash
# Set proxy if needed (for Edge TTS)
$env:HTTP_PROXY='http://127.0.0.1:7899'
$env:HTTPS_PROXY='http://127.0.0.1:7899'

# Generate audio with Edge TTS
python generate_tts.py \
  --input projects/my-video/podcast.txt \
  --output-dir projects/my-video \
  --backend edge
```

This will generate:
- `podcast_audio.wav` - Audio file
- `podcast_audio.srt` - Subtitles
- `timing.json` - Timeline data

#### Step 3: Preview Video

```bash
# Start Remotion Studio
npx remotion studio src/remotion/index.ts --public-dir projects/my-video/
```

Open http://localhost:3000 and:
- Preview your video in real-time
- Adjust styles in the right panel (colors, fonts, animations)
- Test different resolutions (4K/vertical)

#### Step 4: Render Video

**Option A: Use the rendering script (Recommended)**

```bash
# Windows PowerShell
.\render.ps1 preview   # Fast preview (1-2 minutes)
.\render.ps1 standard # Balanced quality (5-10 minutes)
.\render.ps1 high     # Best quality (15-30 minutes)

# Linux/Mac
chmod +x render.sh
./render.sh preview
./render.sh standard
./render.sh high
```

**Option B: Manual rendering**

```bash
# Render 4K horizontal video
npx remotion render src/remotion/index.ts MyVideo out/video-4k.mp4 \
  --public-dir projects/my-video/ \
  --codec h264 \
  --quality 100 \
  --crf 18

# Render vertical video (for shorts)
npx remotion render src/remotion/index.ts MyVideoVertical out/video-vertical.mp4 \
  --public-dir projects/my-video/ \
  --codec h264 \
  --quality 100
```

**Rendering time estimates** (for 4min 23s video):
- Preview quality: 1-2 minutes
- Standard quality: 5-10 minutes
- High quality (4K): 15-30 minutes

#### Step 5: Generate Thumbnails

```bash
# YouTube/Bilibili thumbnail (16:9)
npx remotion render src/remotion/index.ts Thumbnail16x9 out/thumbnail-16x9.png \
  --public-dir projects/my-video/

# Xiaohongshu thumbnail (3:4)
npx remotion render src/remotion/index.ts Thumbnail3x4 out/thumbnail-3x4.png \
  --public-dir projects/my-video/
```

## Project Structure

```
video-podcast-maker/
├── src/remotion/              # Remotion video project
│   ├── index.ts              # Entry point
│   ├── Root.tsx              # Root component (editable props)
│   ├── Video.tsx             # Video component
│   ├── Thumbnail.tsx         # Thumbnail component
│   └── components/           # Reusable component library
├── projects/                  # Your video projects
│   └── how-to-learn-programming/
│       ├── podcast.txt       # Script
│       ├── podcast_audio.wav # Generated audio
│       ├── podcast_audio.srt # Generated subtitles
│       └── timing.json       # Generated timeline
├── tts/                       # TTS backends
│   └── backends/
│       └── edge.py           # Edge TTS implementation
├── templates/                 # Project templates
├── remotion.config.ts        # Remotion configuration
├── package.json              # Node.js dependencies
└── requirements.txt          # Python dependencies
```

## Customizing Your Video

### Editable Properties (in Remotion Studio)

Open Remotion Studio and use the right panel to adjust:

#### Colors
- `primaryColor` - Main color (titles, highlights)
- `backgroundColor` - Background color
- `textColor` - Text color
- `accentColor` - Accent color (CTAs, highlights)

#### Typography
- `titleSize` - Title font size
- `subtitleSize` - Subtitle font size
- `bodySize` - Body text font size

#### Progress Bar
- `showProgressBar` - Show/hide progress bar
- `progressBarHeight` - Progress bar height
- `progressFontSize` - Progress bar text size

#### Audio
- `bgmVolume` - Background music volume (0-0.3)

#### Animations
- `enableAnimations` - Enable entrance animations
- `transitionType` - Section transitions (fade/slide/wipe/none)
- `transitionDuration` - Transition duration in frames

### Customizing Section Content

Edit `src/remotion/Video.tsx` to customize each section:

```typescript
case "hero":
  return (
    <FullBleedLayout bg={props.backgroundColor}>
      <h1>Your Custom Title</h1>
      <p>Your Custom Subtitle</p>
    </FullBleedLayout>
  );
```

## TTS Configuration

### Edge TTS (Recommended)

**Advantages**:
- High-quality Chinese voice
- Free to use
- Fast generation speed

**Proxy Configuration** (if needed):
```bash
# PowerShell
$env:HTTP_PROXY='http://127.0.0.1:7899'
$env:HTTPS_PROXY='http://127.0.0.1:7899'

# Bash/Linux
export HTTP_PROXY='http://127.0.0.1:7899'
export HTTPS_PROXY='http://127.0.0.1:7899'
```

**Troubleshooting**:
- If you get 403 errors, upgrade edge-tts: `pip install --upgrade edge-tts`
- For WebSocket issues, use system proxy mode instead of TUN mode
- Recommended nodes: Taiwan, Hong Kong, Japan, Singapore

## Example Project

Check `projects/how-to-learn-programming/` for a complete example:

- **Topic**: How to learn programming efficiently
- **Duration**: 4 minutes 23 seconds
- **Sections**: 5 chapters
- **Audio**: Generated with Edge TTS
- **Status**: Ready for preview and rendering

## Output Formats

### Videos
- **4K Horizontal**: 3840x2160 (YouTube, Bilibili)
- **Vertical**: 2160x3840 (Shorts, TikTok)

### Thumbnails
- **16:9**: 1920x1080 (YouTube, Bilibili covers)
- **4:3**: 1200x900 (Bilibili feed)
- **3:4**: 1080x1440 (Xiaohongshu)
- **9:16**: 1080x1920 (Shorts covers)

## Tech Stack

- **TTS Engine**: Edge TTS 7.2.8 (Microsoft Azure Neural TTS)
- **Video Framework**: Remotion 4.0 (React-based)
- **Audio Processing**: FFmpeg 8.1
- **Languages**: TypeScript, Python

## Troubleshooting

### FFmpeg Not Found
```bash
# Windows: Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Or install via winget
winget install --id Gyan.FFmpeg -e
```

### Remotion Studio Won't Start
```bash
# Reinstall dependencies
npm install

# Check Node.js version (needs >= 18)
node --version
```

### Audio Generation Fails
1. Check proxy settings
2. Upgrade edge-tts: `pip install --upgrade edge-tts`
3. Try different proxy nodes
4. Check PowerShell encoding: `$env:PYTHONIOENCODING='utf-8'`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

- **kael-odin**
- Email: kael@thordata.com
- GitHub: https://github.com/kael-odin/video-maker

## Acknowledgments

- [Remotion](https://www.remotion.dev/) - React-based video creation
- [Edge TTS](https://github.com/rany2/edge-tts) - Microsoft Edge's TTS API
- [FFmpeg](https://ffmpeg.org/) - Audio/video processing
