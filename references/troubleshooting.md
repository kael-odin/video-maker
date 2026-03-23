# Video Podcast Maker — Troubleshooting & Reference

> **When to load:** Claude loads this file when encountering errors, when user asks about preferences, or when user asks about BGM options.

## Troubleshooting

### TTS: Azure API Key Error

**Symptoms**: `Error: Authentication failed`, `HTTP 401 Unauthorized`

**Solution**:
```bash
echo $AZURE_SPEECH_KEY
echo $AZURE_SPEECH_REGION

export AZURE_SPEECH_KEY="your-key-here"
export AZURE_SPEECH_REGION="eastasia"
```

---

### FFmpeg: BGM Mixing Issues

**Symptoms**: BGM too loud over voice, BGM ends abruptly

**Solution**:
```bash
# Basic mix (voice primary, BGM lowered)
ffmpeg -i voice.mp3 -i bgm.mp3 \
  -filter_complex "[0:a]volume=1.0[voice];[1:a]volume=0.15[bgm];[voice][bgm]amix=inputs=2:duration=first" \
  -ac 2 output.mp3

# With fade in/out
ffmpeg -i voice.mp3 -i bgm.mp3 \
  -filter_complex "
    [0:a]volume=1.0[voice];
    [1:a]volume=0.15,afade=t=in:st=0:d=2,afade=t=out:st=58:d=2[bgm];
    [voice][bgm]amix=inputs=2:duration=first
  " output.mp3
```

---

### Quick Checklists

**Pre-render**:
- [ ] All asset files exist
- [ ] timing.json format correct
- [ ] Audio duration matches timing
- [ ] Environment variables set
- [ ] Disk space sufficient (>20GB for 4K)

**Post-render**:
- [ ] Video duration correct
- [ ] Audio-video sync
- [ ] Subtitles display correctly
- [ ] No black/blank frames

---

## Background Music Options

### Included Tracks

Available at `${CLAUDE_SKILL_DIR}/assets/`:

| Track | Mood | Best For |
|-------|------|----------|
| `perfect-beauty-191271.mp3` | Upbeat, positive | Tech demos, product intros, tutorials |
| `snow-stevekaldes-piano-397491.mp3` | Calm piano | Reflective topics, analysis, comparisons |

### Using Custom BGM

```bash
cp /path/to/my-bgm.mp3 videos/{name}/bgm.mp3
```

If user says "use my own BGM" or provides a file path, skip the default BGM copy in Step 11.

### Royalty-Free BGM Sources

| Source | URL | License |
|--------|-----|---------|
| Pixabay Music | https://pixabay.com/music/ | Free, no attribution |
| Free Music Archive | https://freemusicarchive.org/ | CC licenses |
| Incompetech | https://incompetech.com/ | CC BY (attribution) |
| Uppbeat | https://uppbeat.io/ | Free tier available |
| Chosic | https://www.chosic.com/free-music/all/ | Various CC |

### BGM Selection Guide

| Video Type | Recommended Mood | Volume |
|------------|-----------------|--------|
| Tech/coding | Lo-fi, ambient | 0.03-0.05 |
| Product review | Upbeat, corporate | 0.05-0.08 |
| News/analysis | Neutral, minimal | 0.03-0.05 |
| Tutorial | Calm, steady | 0.04-0.06 |
| Lifestyle | Warm, acoustic | 0.05-0.08 |

**Claude behavior:** In auto mode, select most appropriate included track by topic type. In interactive mode, ask user.

---

## Preference Commands

Users can manage preferences in conversation:

### View Preferences

User says: "show preferences" / "显示偏好设置"

Claude outputs current settings summary (visual, TTS, content, topic patterns, learning history count).

### Reset Preferences

User says: "reset preferences" / "重置偏好"

```bash
cp ${CLAUDE_SKILL_DIR}/user_prefs.template.json ${CLAUDE_SKILL_DIR}/user_prefs.json
echo "✓ Preferences reset to defaults"
```

### Save Current Settings

User says: "save this as tech default" / "把这个设置保存为科技类默认"

Claude extracts current visual/tts/content settings, updates `topic_patterns.tech`.

### Manual Preference Setting

User says: "set speech rate to +10%" / "dark theme as default" / "title always 100px"

Claude directly updates the corresponding field in `user_prefs.json`.

---

## Preference Learning

**Claude behavior:** Execute after Studio preview iteration completes.

### Detect Modifications

Compare values at start vs end of Studio preview session:

| Category | Detection |
|----------|-----------|
| Typography | titleSize, subtitleSize, bodySize changes |
| Color | primaryColor, backgroundColor changes |
| Layout | progress bar toggle, transition effect changes |

### Progressive Learning

- **First modification**: Current video only, don't update global preferences
- **Repeated modification** (≥2 same direction): Ask user if it should become default

```
"Detected [N] consecutive increases to title size (80 → 96). Set 96px as default?"
- Yes (recommended) → update user_prefs.json
- No → current video only
```

### Explicit Preference Capture

Detect expressions and learn:

| User Expression Pattern | Learning Action |
|------------------------|----------------|
| "always use this color" | Save primaryColor to global |
| "use this style for tech videos" | Save to topic_patterns.tech |
| "remember these settings" | Save all current modifications to global |

### Update Preference File

After learning, update `user_prefs.json` and add `learning_history` record:

```json
{
  "date": "2026-03-15",
  "source": "implicit",
  "change": { "path": "global.visual.typography.heroTitle", "from": 80, "to": 96 },
  "context": "User adjusted title size 3 times in Studio"
}
```
