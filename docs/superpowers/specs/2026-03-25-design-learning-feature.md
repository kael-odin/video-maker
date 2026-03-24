# Design Learning Feature — Video Design Reference System

**Date:** 2026-03-25
**Status:** Approved
**Approach:** Pure Claude Vision (Approach 1)

## Summary

Add a "learn" capability to the video-podcast-maker skill that analyzes reference videos (via URL, local file, or screenshots) and extracts structured design attributes. Users review an analysis report, then optionally save results to a design reference library and/or create named style profiles for reuse.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Workflow model | B — Analysis report + human confirmation | Design is subjective; human-in-the-loop prevents bad extractions from polluting preferences |
| Input sources | All three: images, local video, URLs | All inputs become images for vision analysis; staged implementation (images → ffmpeg → Playwright) |
| Analysis engine | Pure Claude Vision | Simplest architecture, leverages existing vision capabilities, no external ML dependencies |
| Storage | `design_references/` directory + `user_prefs.json` index | Binary assets (screenshots) separate from structured data (JSON) |
| Preference evolution | Add `style_profiles` + `design_references` to user_prefs.json | Flexible user-named profiles replace rigid 5-category topic_patterns |

## Design Dimensions (Priority Order)

### Must-have (maps to existing props)
1. **Color scheme** — primary/accent/background, light vs dark theme
2. **Cover design** — title position, size ratio, composition style, palette
3. **Content page layouts** — which layout patterns (split, centered, grid, zigzag)
4. **Typography hierarchy** — title/subtitle/body size ratios

### Nice-to-have (enhanced expression)
5. **Animation style** — entrance type (fade/slide/scale), rhythm (gentle/snappy/bouncy)
6. **Background layers** — gradient, floating shapes, grid, decorative elements
7. **Information density** — spacious vs dense
8. **Transition style** — between-section transitions

## Command Interface

```bash
# Learn from reference
/video-podcast-maker learn <input> [--profile <name>] [--tags <tag1,tag2>]

# Input modes
/video-podcast-maker learn ./cover.png ./frame1.png ./frame2.png     # images
/video-podcast-maker learn ./reference.mp4                            # local video
/video-podcast-maker learn https://bilibili.com/video/BVxxxx          # URL

# Manage references
/video-podcast-maker references list
/video-podcast-maker references show <name>
/video-podcast-maker references delete <name>

# Manage style profiles
/video-podcast-maker profiles list
/video-podcast-maker profiles show <name>
/video-podcast-maker profiles delete <name>
/video-podcast-maker profiles create <name>
```

## Image Extraction Pipeline

### Images (direct)
- Validate file exists (PNG/JPG/WebP)
- Copy to `design_references/{name}/frames/`

### Local video (ffmpeg)
```bash
# 8 evenly-spaced frames + scene-change detection
ffmpeg -i reference.mp4 -vf "select='eq(n,0)+eq(n,floor(N/8))...'" -vsync vfn frames/frame_%03d.png
ffmpeg -i reference.mp4 -vf "select='gt(scene,0.3)'" -vsync vfn frames/scene_%03d.png
```
- Combine: up to **8 frames** (evenly-spaced + scene-change, deduplicated)
- First frame extracted as `cover.png`

### URL (Playwright)
1. Navigate to video page
2. Screenshot page → `cover.png`
3. Click play, seek to 0%, 15%, 30%, 45%, 60%, 75%, 90%
4. Screenshot video player region at each point
5. Total: 1 cover + 7 content frames = 8 images
6. **Fallback**: if Playwright fails → prompt user to provide local file or screenshots

### Frame limit: max 8 content frames + 1 cover

### Frame deduplication
Scene-change frames that fall within 2 seconds of an evenly-spaced frame are discarded. Remaining frames are sorted chronologically and capped at 8.

### Error handling
- **ffmpeg not installed**: skip local video input, prompt user for screenshots instead
- **Playwright not installed or blocked**: skip URL input, prompt for local file or screenshots
- **Corrupt/unsupported files**: report error, skip file, continue with remaining inputs
- **Video file > 2GB**: warn user, extract frames from first 30 minutes only
- **Vision analysis returns low-confidence results**: present results with confidence caveat, let user adjust

### Orientation awareness
Analysis detects video orientation (16:9 vs 9:16). When reference orientation mismatches target video, the report flags this: "Reference is vertical — layout patterns may not transfer directly to horizontal output."

## Report Schema (`report.json`)

**Note on precision:** Color values are approximate suggestions extracted by Claude Vision — treat as "closest match" rather than exact hex codes. Claude may propose 2-3 candidate palettes for user selection. Layout pattern names are Claude's best mapping to the project's component vocabulary; the user confirms or adjusts at review time.

```json
{
  "report_version": "1.0",
  "source": {
    "type": "url|local_video|images",
    "url": "https://bilibili.com/video/BVxxxx",
    "title": "AI Agent 2026 完全指南",
    "orientation": "horizontal|vertical",
    "analyzed_at": "2026-03-25T10:30:00Z"
  },
  "cover_design": {
    "composition": "center-title|left-title|split|overlay",
    "title_position": "center|top-left|bottom-left",
    "title_size_ratio": 0.15,
    "has_subtitle": true,
    "color_scheme": ["#1a1a2e", "#e94560", "#ffffff"],
    "style_tags": ["dark", "gradient", "bold-title"],
    "description": "Human-readable description of cover design"
  },
  "content_design": {
    "theme": "light|dark",
    "palette": {
      "primaryColor": "#4f6ef7",
      "accentColor": "#e94560",
      "backgroundColor": "#0f0f23",
      "textColor": "#ffffff"
    },
    "typography_feel": "bold-clean|elegant-serif|casual-rounded",
    "density": "spacious|balanced|dense",
    "layout_patterns": [
      {
        "frame": "frame_001.png",
        "layout": "CenteredShowcase|SplitLayout|MetricsRow|...",
        "description": "Description of this frame's layout"
      }
    ],
    "backgrounds": ["gradient|shapes|grid|clean"],
    "animation_feel": "gentle|snappy|bouncy",
    "transition_style": "fade|slide|wipe"
  },
  "props_mapping": {
    "primaryColor": "#4f6ef7",
    "accentColor": "#e94560",
    "backgroundColor": "#0f0f23",
    "textColor": "#ffffff",
    "titleSize": 96,
    "subtitleSize": 52,
    "bodySize": 32,
    "enableAnimations": true,
    "transitionType": "fade",
    "transitionDuration": 15,
    "showProgressBar": true,
    "iconStyle": "lucide",
    "iconAnimation": "entrance",
    "orientation": "horizontal"
  },
  "summary": "Human-readable one-line summary of the design style",
  "tags": ["tech", "dark", "minimalist", "gradient"]
}
```

**Field naming convention:** `content_design.palette` and `props_mapping` both use Root.tsx prop names (`primaryColor`, `accentColor`, `backgroundColor`, `textColor`) — no translation needed. `props_mapping` is an exhaustive subset of `videoSchema` props; fields not extractable from visual analysis (e.g., `bgmVolume`) are omitted intentionally.

## Style Profile System

### user_prefs.json evolution (v1.0 → v1.1)

New top-level fields added. **Migration:** at skill startup (Step 1), if `version` is `"1.0"`, silently upgrade to `"1.1"` by adding empty `style_profiles: {}` and `design_references: {}`. Existing fields are untouched.

```json
{
  "version": "1.1",
  "global": { },
  "topic_patterns": { },

  "style_profiles": {
    "<user-named-profile>": {
      "description": "Human-readable description",
      "props_override": {
        "primaryColor": "#4f6ef7",
        "backgroundColor": "#0f0f23"
      },
      "preferred_layouts": ["CenteredShowcase", "MetricsRow"],
      "preferred_backgrounds": ["gradient", "clean"],
      "animation_feel": "gentle",
      "density": "spacious",
      "references": ["bilibili-BVxxxx"],
      "created_at": "2026-03-25",
      "updated_at": "2026-03-25"
    }
  },

  "design_references": {
    "<reference-id>": {
      "path": "design_references/<reference-id>/",
      "title": "Video title",
      "source_url": "https://...",
      "analyzed_at": "2026-03-25",
      "tags": ["tech", "dark"]
    }
  },

  "learning_history": [ ]
}
```

### Profile naming
- Fully user-controlled — no restrictions
- Can organize by topic ("tech-explainer"), aesthetic ("neon-gradient"), channel ("某UP主风格"), or use case ("conference-talk")

### Reference ID naming convention
- **URL input**: `{platform}-{video_id}` (e.g., `bilibili-BV1xx411c7xx`, `youtube-dQw4w9WgXcQ`)
- **Local video**: `local-{filename_without_ext}` (e.g., `local-my-reference`)
- **Image set**: `images-{user_provided_name}` or `images-{timestamp}` if no name given
- Collision: append `-2`, `-3` suffix

### Relationship: style_profiles vs topic_patterns
- `topic_patterns` is **retained for backward compatibility** — auto-detected topic still applies as a base layer
- `style_profiles` are user-created, override topic_patterns when explicitly specified
- No migration of topic_patterns → style_profiles; they coexist independently
- Long-term: as users build style profiles, topic_patterns becomes less relevant but is never removed

### Priority chain (updated)
```
Root.tsx defaults < global < topic_patterns[type] < style_profiles[name] < current instructions
```

### Multi-reference profile merging
- Colors: show both palettes, user picks or Claude suggests blend
- Layouts: union of preferred layouts
- Density/animation: if conflicting, ask user
- No auto-averaging — always present choices for subjective attributes

## Workflow Integration

### Pre-workflow: Design Reference (optional)
Before existing Step 1 (not a numbered step). User provides a reference with the video creation request:
- Quick learn → analysis report → user confirms
- Extracted props applied as session overrides
- NOT saved to design_references/ unless user explicitly asks

### Step 9 enhancement
Claude's design decision process at composition time:
1. Session-specified style profile? → use it
2. No profile specified? → check design_references for matching tags
3. Found relevant references? → suggest matching profile to user
4. Nothing matches? → fall back to current behavior (global + topic_patterns)

### Standalone learn command
Independent of video creation workflow. `learn` can be used anytime to build the reference library.

## Storage Structure

```
design_references/
  bilibili-BVxxxx/
    report.json          # structured analysis
    cover.png            # thumbnail/cover
    frames/              # key frame screenshots
      frame_001.png
      frame_002.png
      ...
  local-my-reference/
    report.json
    cover.png
    frames/
      ...
```

### Subcommand dispatch
The `learn`, `references`, and `profiles` subcommands are **Claude-driven, not code-driven**. SKILL.md defines the subcommand syntax; Claude parses the user's arguments and executes the appropriate workflow (vision analysis, JSON read/write, file management). No separate dispatch code needed — this follows the same pattern as the existing 14-step workflow where Claude orchestrates each step. `learn_design.py` only handles image extraction (ffmpeg commands); all analysis, report generation, and preference management happen in Claude's conversation context.

### CLI flag semantics
- `--profile <name>`: **create new** profile if name doesn't exist, **add to existing** if it does. Claude confirms which action before proceeding.
- `--tags <tag1,tag2>`: tags the **reference** (stored in `design_references` index), not the profile. Profiles inherit tags from their linked references for search purposes.

## Files to Create/Modify

| Action | File | Change |
|--------|------|--------|
| Create | `learn_design.py` | Image extraction pipeline (ffmpeg frame extraction, file validation) |
| Create | `design_references/` | Directory for stored analyses |
| Create | `design_references/.gitkeep` | Ensure directory exists in git |
| Modify | `.gitignore` | Add `design_references/*/frames/` and `design_references/*/cover.png` |
| Modify | `user_prefs.json` | Add `style_profiles` + `design_references` fields, bump version to 1.1 |
| Modify | `user_prefs.template.json` | Add empty defaults for new fields |
| Modify | `prefs_schema.json` | Add JSON Schema definitions for `style_profiles` and `design_references` |
| Modify | `SKILL.md` | Add pre-workflow step, learn/references/profiles commands, update description frontmatter for discoverability |
| Modify | `references/workflow-steps.md` | Detail pre-workflow design reference + Step 9 enhancements |
| Modify | `references/troubleshooting.md` | Add learn-related troubleshooting |
| Modify | `CLAUDE.md` | Add learn commands, update architecture section |
| Modify | `templates/Thumbnail.tsx` | Support `cover_design` overrides from style profiles |

## Implementation Priority

| Phase | Scope | Deliverable |
|-------|-------|-------------|
| Phase 1 | Image input + vision analysis + report.json | Core learn loop works with screenshots |
| Phase 2 | Style profiles + user_prefs.json evolution | Profiles can be created, listed, applied |
| Phase 3 | Local video extraction (ffmpeg) | `learn ./video.mp4` works |
| Phase 4 | URL extraction (Playwright — experimental) | `learn https://bilibili.com/...` works; fallback-first approach, Playwright is a bonus |
| Phase 5 | Step 9 integration + pre-workflow step | Design references inform video creation |

## Disk Management

- Recommended max: **30 references** (approx 300MB with 8 frames each at 1080p PNG)
- `references list` shows total disk usage
- `references delete` removes directory and index entry
- Stale reference cleanup: if `design_references/{id}/` directory is manually deleted, next `references list` detects missing path and removes the orphaned index entry from `user_prefs.json`
