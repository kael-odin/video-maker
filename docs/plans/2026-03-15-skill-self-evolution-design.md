# Skill Self-Evolution Design

> Auto-learn user preferences from feedback and apply them intelligently in future video creation.

**Date:** 2026-03-15
**Status:** Approved
**Author:** Claude + User

---

## Overview

Enable the video-podcast-maker skill to "self-evolve" by learning user preferences across three dimensions:
- **Visual style** — colors, typography, layout, components
- **TTS preferences** — backend, speech rate, voice
- **Content style** — tone, verbosity, section structure

Learning happens through explicit feedback, implicit behavior observation, and satisfaction surveys. Preferences are stored locally in the skill directory (no agent dependency).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                          │
│  "我喜欢深色主题" / "语速快一点" / Studio 修改行为           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Preference Extraction Layer                     │
│  - Explicit command parsing (keyword + NLU)                  │
│  - Implicit behavior analysis (Studio modification diff)     │
│  - Satisfaction feedback collection (post-completion)        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              user_prefs.json (Persistent Storage)            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Preference Application Layer                    │
│  - Topic type detection (tech/finance/education/...)         │
│  - Preference merging (global → topic → current)             │
│  - Generate defaultVideoProps override                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Video Creation (existing 15-step workflow)      │
└─────────────────────────────────────────────────────────────┘
```

---

## Preference Schema

```json
{
  "version": "1.0",
  "updated_at": "2026-03-15T10:30:00Z",

  "global": {
    "visual": {
      "theme": "light|dark|auto",
      "primaryColor": "#4f6ef7",
      "backgroundColor": "#ffffff",
      "preferredComponents": ["Timeline", "FeatureGrid"],
      "titlePosition": "top-center",
      "progressBar": true,

      "typography": {
        "heroTitle": 96,
        "sectionTitle": 80,
        "cardTitle": 38,
        "bodyText": 32,
        "caption": 24,
        "scalePreference": 1.0
      },

      "layout": {
        "titlePosition": "top-center|top-left|center",
        "textAlign": "center|left",
        "contentWidth": 0.9,
        "cardPadding": 36
      },

      "spacing": {
        "sectionPadding": 60,
        "itemGap": 28,
        "marginBottom": 100
      }
    },

    "tts": {
      "backend": "azure|cosyvoice|edge",
      "rate": "+5%",
      "voice": "zh-CN-XiaoxiaoNeural"
    },

    "content": {
      "tone": "professional|casual|energetic",
      "verbosity": "concise|balanced|detailed",
      "sectionCount": 5,
      "outroStyle": "standard|minimal"
    }
  },

  "topic_patterns": {
    "tech": {
      "visual": { "primaryColor": "#4f6ef7", "theme": "light" },
      "content": { "tone": "professional" }
    },
    "finance": {
      "visual": { "primaryColor": "#1a1a2e", "theme": "dark" },
      "content": { "tone": "professional" }
    },
    "lifestyle": {
      "visual": { "primaryColor": "#FF6B6B", "theme": "light" },
      "content": { "tone": "casual" }
    }
  },

  "learning_history": [
    {
      "date": "2026-03-15",
      "source": "explicit|implicit|feedback",
      "change": { "path": "global.tts.rate", "from": "+5%", "to": "+10%" },
      "context": "用户说'语速再快一点'"
    }
  ]
}
```

---

## Learning Mechanisms

### Explicit Learning (Keyword Triggered)

| User Expression | Extraction Action |
|-----------------|-------------------|
| "我喜欢深色主题" / "下次用暗色" | `global.visual.theme = "dark"` |
| "语速快一点" / "说话太慢了" | `global.tts.rate` += 5% |
| "以后都用这个颜色" | Record current primaryColor to global |
| "科技类视频用蓝色" | `topic_patterns.tech.visual.primaryColor` |
| "正式一点" / "轻松一点" | `global.content.tone` |
| "文字太小" / "看不清" | `typography.*` × 1.1, record `scalePreference` |
| "标题再大一点" | `typography.heroTitle` += 8 |
| "卡片里的字太挤了" | `layout.cardPadding` += 8 |
| "内容靠左对齐" | `layout.textAlign = "left"` |

### Implicit Learning (Behavior Observation)

During Step 9 (Studio Preview), analyze user modifications:

```
User in Studio:
  titleSize: 80 → 96  (3 consecutive videos)

Claude learns:
  "检测到您经常调大标题字号，是否将 96px 设为默认值？"
  User confirms → update global.visual.typography.heroTitle = 96
```

### Progressive Learning Logic

```
1st time "文字太小" → Adjust current video only, don't update global
2nd time "文字太小" → Prompt "检测到您偏好较大字号，是否设为默认？"
User confirms → scalePreference = 1.2, auto-apply to future videos
```

### Satisfaction Feedback

After video completion (post Step 14):

```
"这个视频的整体风格满意吗？"
- 满意 → Reinforce current choices (increase confidence)
- 需要调整 → Record specific feedback, avoid next time
```

---

## Application Mechanism

### Topic Type Detection

At Step 1 (Define Topic), Claude analyzes topic and matches category:

```
User input: "帮我做一个关于 DeepSeek R1 的视频"

Claude analysis:
  Keywords: DeepSeek, AI, 模型 → Category: tech
  Apply preferences: topic_patterns.tech + global
```

**Preset Topic Categories:**
- `tech` — AI, programming, hardware, software
- `finance` — investment, stocks, cryptocurrency
- `education` — tutorials, learning methods
- `lifestyle` — lifestyle, food, travel
- `news` — news, hot topics

### Preference Merge Priority

```
Final Preferences = merge(
  1. Root.tsx defaultVideoProps      ← Lowest (code defaults)
  2. global preferences              ← User global settings
  3. topic_patterns[detected_type]   ← Topic-specific
  4. Current explicit instructions   ← Highest priority
)
```

### Application Timing

| Workflow Step | Read Preferences | Apply To |
|---------------|------------------|----------|
| Step 1 | All | Overall style direction |
| Step 4 (Script) | content.* | Tone, verbosity |
| Step 7 (Thumbnail) | visual.* | Cover colors, text size |
| Step 8 (TTS) | tts.* | Backend, rate, voice |
| Step 9 (Remotion) | visual.*, typography.*, layout.* | Component styles, layout |

### Transparency

First time applying preferences, inform user:

```
"根据您的偏好设置：
 - 主题: 深色 (您之前设置)
 - 字号: 较大 (scalePreference: 1.2)
 - 语速: +10%

 如需调整请随时告诉我。"
```

---

## SKILL.md Integration

### New Step 0: Load User Preferences

Before Step 1, auto-execute:

1. Read `~/.claude/skills/video-podcast-maker/user_prefs.json`
2. If not exists, use empty preferences (first use)
3. Apply preferences in subsequent steps

### New Step 9.5: Learn from Modifications

After Studio preview adjustments:

1. Compare initial vs final values, identify significant changes
2. If a modification occurs ≥2 times, ask if should be default
3. User confirms → update user_prefs.json

### Update Step 14: Add Satisfaction Feedback

Collect satisfaction after verification.

### User Commands

Users can say at any time:

| Command | Effect |
|---------|--------|
| "显示我的偏好设置" | Output current user_prefs.json summary |
| "重置偏好" / "清除学习记录" | Clear user_prefs.json |
| "这个视频的设置保存为科技类默认" | Save to topic_patterns.tech |

---

## File Structure

```
~/.claude/skills/video-podcast-maker/
├── user_prefs.json          # User preference storage (new)
├── prefs_schema.json        # Preference field definitions (new)
├── SKILL.md                 # Update: integrate preference read/learn steps
├── generate_tts.py          # Existing
└── templates/
    └── Root.tsx             # Update: support override from preferences
```

---

## Success Criteria

1. User says "文字太小" twice → skill remembers and auto-applies larger font
2. Tech videos automatically use blue theme after user sets it once
3. User can view/reset preferences at any time
4. No external agent dependency — pure file-based storage
5. Transparent: skill tells user what preferences are being applied
