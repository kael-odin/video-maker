# Vertical Shorts Auto-Segmentation

> Auto-generate 9:16 vertical short videos from an existing long-form video podcast.

## Problem

After producing a 16:9 long-form video, creators need 30-60s vertical clips for B站竖屏, 抖音, etc. Currently this requires manual editing. FFmpeg cropping from 16:9→9:16 looks bad because layouts are designed for widescreen.

## Solution

A Python script (`generate_shorts.py`) that reads the existing video's source data and produces native 9:16 Remotion compositions per section — no cropping, full vertical-optimized layout.

## Input/Output

**Input** (all already exist after long-form video production):
- `timing.json` — per-section timestamps
- `podcast.txt` — script with `[SECTION:xxx]` markers
- `podcast_audio.wav` — TTS narration audio
- `{PascalCaseName}Video.tsx` — long-form composition (section component definitions)

**Output** (per qualifying section):
```
videos/{name}/shorts/{section_name}/
  ├── short_audio.wav       # Extracted audio slice for this section
  ├── short_timing.json     # Single-section timing data
  └── short.mp4             # Rendered 9:16 4K video (2160×3840)
```

## Section Selection

Auto-filter from `timing.json`:
- **Skip**: sections named `hero`, `outro`, or with `is_silent: true`
- **Skip**: sections with `duration < 20s`
- **Include**: all remaining content sections

No manual selection needed. For a typical 3-5 minute video with 6 sections, this produces 2-4 shorts.

## Short Structure (3 parts)

Each short is a self-contained 9:16 video:

### 1. Intro Card (3 seconds, 90 frames)
- Section title as hook text (large, centered)
- Video topic name as subtitle
- Entrance animation
- Purpose: grab attention, provide context

### 2. Section Content (original duration)
- Reuses the same section component from the long-form video
- Rendered with `orientation: "vertical"` props
- All existing components auto-adapt (FlowChart, Timeline, DiagramReveal, etc.)
- Audio: extracted slice of `podcast_audio.wav`

### 3. CTA Card (3 seconds, 90 frames)
- "关注看完整版" (Follow for full video)
- No 点赞/收藏/关注 icons (B站 shorts have native UI for this)
- Purpose: drive traffic to the long-form video

**Total duration**: section duration + 6 seconds

## Architecture

### generate_shorts.py

Single Python script, no new dependencies beyond FFmpeg (already required).

```
generate_shorts.py
  --input-dir videos/{name}/       # Directory with timing.json, podcast_audio.wav
  --composition {PascalCaseName}Video.tsx  # Long-form composition (for reference)
  --min-duration 20                 # Minimum section duration in seconds
  --skip hero,outro                 # Section names to skip
```

**Steps**:
1. Read `timing.json`, apply filters
2. For each qualifying section:
   a. `ffmpeg -ss {start} -t {duration} -i podcast_audio.wav short_audio.wav`
   b. Generate `short_timing.json` with intro/content/cta sections
   c. Generate `{SectionName}Short.tsx` Remotion composition
   d. Register composition in Root.tsx
3. Print summary: which sections were selected, durations, output paths

### Remotion Composition Template

Each short gets a generated `{SectionName}Short.tsx`:

```tsx
// Auto-generated — do not edit
const ShortVideo = (props: VideoProps) => (
  <AbsoluteFill>
    <Scale4K orientation="vertical">
      <TransitionSeries>
        {/* Intro card: 90 frames */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <IntroCard title="处理流程" subtitle="大语言模型是怎么工作的？" props={props} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition ... />
        {/* Content: section duration frames */}
        <TransitionSeries.Sequence durationInFrames={sectionFrames}>
          <SectionComponent section={section} props={props} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition ... />
        {/* CTA: 90 frames */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <CTACard props={props} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </Scale4K>
    <Audio src={staticFile("short_audio.wav")} startFrom={0} />
  </AbsoluteFill>
);
```

### New Template Components

Two small components added to `templates/components/`:

**ShortIntroCard.tsx** — Full-screen title card for short intros
- Section title (large, 72px+)
- Video topic subtitle
- Entrance animation
- Vertical-optimized padding

**ShortCTACard.tsx** — End card driving traffic to full video
- "关注看完整版" text
- Simple, clean design
- Exit-ready (no complex animation)

### Rendering

```bash
# Render all shorts
npx remotion render src/remotion/index.ts PipelineShort videos/{name}/shorts/pipeline/short.mp4 --video-bitrate 16M
npx remotion render src/remotion/index.ts ArchitectureShort videos/{name}/shorts/architecture/short.mp4 --video-bitrate 16M
# ... etc
```

Or batch via the script:
```bash
python3 generate_shorts.py --input-dir videos/how-llms-work/ --render
```

The `--render` flag auto-runs `npx remotion render` for each generated composition.

## What This Does NOT Do

- No re-recording of TTS audio (reuses existing)
- No new content generation (reuses existing sections)
- No subtitle burning (shorts platforms have their own caption systems)
- No BGM mixing (shorts are typically narration-only)
- No thumbnail generation (platforms auto-generate from video)

## File Changes Summary

| File | Change |
|------|--------|
| `generate_shorts.py` | New — main script |
| `templates/components/ShortIntroCard.tsx` | New — intro title card |
| `templates/components/ShortCTACard.tsx` | New — end CTA card |
| `templates/components/index.ts` | Export new components |
| `CLAUDE.md` | Add shorts commands and architecture |
| `references/workflow-steps.md` | Add Step 13: Generate Vertical Shorts |
