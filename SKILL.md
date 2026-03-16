---
name: video-podcast-maker
description: Use when user provides a topic and wants an automated video podcast created - handles research, script writing, TTS audio synthesis, Remotion video creation, and final MP4 output with background music
author: Agents365-ai
category: Content Creation
version: 1.1.0
created: 2025-01-27
updated: 2026-03-16
bilibili: https://space.bilibili.com/441831884
github: https://github.com/Agents365-ai/video-podcast-maker
dependencies:
  - remotion-best-practices
metadata:
  openclaw:
    requires:
      env:
        - AZURE_SPEECH_KEY
        - AZURE_SPEECH_REGION
      bins:
        - python3
        - ffmpeg
        - node
        - npx
    primaryEnv: AZURE_SPEECH_KEY
    emoji: "🎬"
    homepage: https://github.com/Agents365-ai/video-podcast-maker
    os: ["macos", "linux"]
    install:
      - kind: brew
        formula: ffmpeg
        bins: [ffmpeg]
      - kind: uv
        package: edge-tts
        bins: [edge-tts]
---

> **REQUIRED: Load Remotion Best Practices First**
>
> This skill depends on `remotion-best-practices` (official Remotion best practices). **You MUST invoke it before proceeding:**
> ```
> Skill tool: skill="remotion-best-practices"
> ```

# Video Podcast Maker

## Quick Start

打开 Claude Code，直接说：**"帮我制作一个关于 [你的主题] 的 B站视频播客"**

---

## Auto Update Check

**Claude behavior:** 每次 skill 被调用时，自动检查是否有新版本：

```bash
timeout 5 git -C ~/.claude/skills/video-podcast-maker fetch --quiet 2>/dev/null || true
LOCAL=$(git -C ~/.claude/skills/video-podcast-maker rev-parse HEAD 2>/dev/null)
REMOTE=$(git -C ~/.claude/skills/video-podcast-maker rev-parse origin/main 2>/dev/null)
if [ -n "$LOCAL" ] && [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
  echo "UPDATE_AVAILABLE"
else
  echo "UP_TO_DATE"
fi
```

- **有更新时**：使用 AskUserQuestion 提示用户 "video-podcast-maker skill 有新版本可用，是否更新？"
  - **是（推荐）** → 执行 `git -C ~/.claude/skills/video-podcast-maker pull`
  - **否** → 继续使用当前版本
- **已是最新**：静默继续，不打扰用户

---

## Prerequisites (One-time Setup)

### 0.1 环境检查清单

| 工具 | 检查命令 | 安装 (macOS) |
|------|----------|--------------|
| Node.js 18+ | `node -v` | `brew install node` |
| Python 3.8+ | `python3 --version` | `brew install python3` |
| FFmpeg | `ffmpeg -version` | `brew install ffmpeg` |

### 0.2 API 密钥

```bash
# Azure Speech (必需) - 添加到 ~/.zshrc
export AZURE_SPEECH_KEY="your-azure-speech-key"
export AZURE_SPEECH_REGION="eastasia"

# 验证
echo $AZURE_SPEECH_KEY  # 应显示你的密钥
```

获取方式：[Azure 门户](https://portal.azure.com/) → 创建"语音服务"资源

### 0.3 Python 依赖

```bash
pip install azure-cognitiveservices-speech requests
```

### 0.4 Remotion 项目设置

```bash
# 创建 Remotion 项目（如已有则跳过）
npx create-video@latest my-video-project
cd my-video-project
npm i  # 安装依赖

# 验证
npx remotion studio  # 应打开浏览器预览
```

### 0.5 快速验证

```bash
# 一键检查所有依赖
echo "=== 环境检查 ===" && \
node -v && \
python3 --version && \
ffmpeg -version 2>&1 | head -1 && \
[ -n "$AZURE_SPEECH_KEY" ] && echo "✓ AZURE_SPEECH_KEY 已设置" || echo "✗ AZURE_SPEECH_KEY 未设置"
```

---

## Overview

Automated pipeline to create professional **Bilibili (B站) 横屏知识视频** from a topic.

> **目标平台：B站横屏视频 (16:9)**
> - 分辨率：3840×2160 (4K) 或 1920×1080 (1080p)
> - 风格：简约纯白（默认）

**技术栈：** Claude + Azure TTS + Remotion + FFmpeg

### 适用场景

| 适合 | 不适合 |
|------|--------|
| 知识科普视频 (横屏 16:9) | 直播录像 |
| 产品对比评测 | 真人出镜 |
| 教程讲解 | Vlog |
| 新闻资讯解读 | 音乐 MV |
| 竖屏精华片段 (9:16) | |

### 输出规格

| 参数 | 横屏 (16:9) | 竖屏 (9:16) |
|------|-------------|-------------|
| **分辨率** | 3840×2160 (4K) | 2160×3840 (4K) |
| **帧率** | 30 fps | 30 fps |
| **编码** | H.264, 16Mbps | H.264, 16Mbps |
| **音频** | AAC, 192kbps | AAC, 192kbps |
| **时长** | 1-15 分钟 | 60-90 秒 (精华片段) |

---

## Execution Modes

**Claude behavior:** At the start of the workflow, detect the user's intent:

- If user says "帮我制作..." / "make a video about..." with no special instructions → **Auto Mode**
- If user says "我想自己控制每个步骤" / mentions interactive/manual → **Interactive Mode**
- Default: **Auto Mode**

### Auto Mode (Default)

Runs the full pipeline with sensible defaults. **Only 2 mandatory prompts:**

1. **Step 1**: Confirm topic direction (required — determines everything)
2. **Step 9**: Studio preview feedback loop (required — visual quality matters)

All other decisions use these defaults:

| Step | Decision | Auto Default |
|------|----------|-------------|
| Step 3 | Title position | top-center |
| Step 5 | Media assets | Skip (text-only animations) |
| Step 7 | Thumbnail method | Remotion-generated (16:9 + 4:3) |
| Step 9 | Outro animation | Pre-made MP4 (white for light theme, black for dark) |
| Step 12 | Subtitles | Skip |
| Step 15 | Cleanup | Auto-clean temp files |

Users can override any default by mentioning it in their initial request:
- "帮我做一个关于AI的视频，要烧字幕" → auto mode + subtitles on
- "用深色主题，AI生成封面" → auto mode + dark theme + imagen thumbnails
- "需要截图素材" → auto mode + media collection enabled

### Interactive Mode

Prompts the user at each decision point. Activated by:
- "互动模式" / "interactive mode"
- "我想自己选择每个选项"
- User explicitly requests control over specific steps

---

## Workflow State & Resume

**Claude behavior:** Automatically persist workflow progress for error recovery.

### State File

Each video project maintains `videos/{name}/workflow_state.json`:

```json
{
  "video_name": "ai-agents-explained",
  "mode": "auto",
  "started_at": "2026-03-16T10:30:00",
  "current_step": 8,
  "steps": {
    "1": { "status": "completed", "completed_at": "2026-03-16T10:31:00" },
    "2": { "status": "completed", "completed_at": "2026-03-16T10:35:00" },
    "8": { "status": "failed", "error": "AZURE_SPEECH_KEY not set" }
  }
}
```

### Auto-Resume

**Claude behavior:** When the skill is invoked:

1. Check if `videos/*/workflow_state.json` exists for any in-progress video
2. If found, report status and ask: "检测到未完成的视频项目 `{name}`，当前在第 {N} 步。是否继续？"
   - **继续** → Resume from the failed/incomplete step
   - **重新开始** → Reset state, start from Step 1
   - **新视频** → Start a different video, keep old state
3. If not found, start fresh

### Step Lifecycle

Each step follows this pattern:
1. Update state: `status: "in_progress"`
2. Execute step
3. On success: `status: "completed"`, record `completed_at`
4. On failure: `status: "failed"`, record `error` message
5. On skip (auto mode): `status: "skipped"`

### Manual Resume

Users can explicitly resume:
- "继续上次的视频" → find latest workflow_state.json, resume
- "从第8步开始" → resume from Step 8 (validate prior steps' outputs exist)

---

## Technical Rules

以下是视频制作的技术硬约束，其他视觉设计和布局由 Claude 根据内容自由发挥：

| Rule | Requirement |
|------|-------------|
| **Single Project** | All videos live under `videos/{name}/` in the user's Remotion project. NEVER create a new project/repo for each video. Remotion code, templates, and components are shared; only per-video assets (podcast.txt, audio, timing.json, output MP4) go in each subfolder. |
| **4K Output** | 3840×2160, use `scale(2)` wrapper over 1920×1080 design space |
| **Content Width** | ≥85% of screen width, no tiny centered boxes |
| **Bottom Safe Zone** | Bottom 100px reserved for subtitles |
| **Audio Sync** | All animations driven by `timing.json` timestamps |
| **Thumbnail** | Must generate both 16:9 (1920×1080) AND 4:3 (1200×900). Design for small-size visibility: title text ≥80px bold, icons/graphics as large as possible, high contrast colors, minimal elements. Thumbnails are viewed at ~300px wide in feed — if text isn't readable at that size, make it bigger. Default layout: title centered, all UI elements and text centered (both horizontally and vertically). |
| **Font** | PingFang SC / Noto Sans SC for Chinese text |

## Visual Design

> **Full design guide:** Read `DESIGN_GUIDE.md` when working on Step 9 (Remotion composition).
> Claude MUST load `DESIGN_GUIDE.md` before creating or modifying any Remotion components.

---

## 文件路径与命名规范

### 目录结构

```
project-root/                           # Remotion 项目根目录
├── src/remotion/                       # Remotion 源码
│   ├── compositions/                   # 视频 Composition 定义
│   ├── Root.tsx                        # Remotion 入口
│   └── index.ts                        # 导出
│
├── public/media/{video-name}/          # 素材目录 (Remotion staticFile() 可访问)
│   ├── {section}_{index}.{ext}         # 通用素材
│   ├── {section}_screenshot.png        # 网页截图
│   ├── {section}_logo.png              # Logo
│   ├── {section}_web_{index}.{ext}     # 网络图片
│   └── {section}_ai.png               # AI 生成图片
│
├── videos/{video-name}/                # 视频项目资产 (非 Remotion 代码)
│   ├── workflow_state.json             # Workflow progress (auto-managed)
│   ├── topic_definition.md             # Step 1: 主题定义
│   ├── topic_research.md               # Step 2: 研究资料
│   ├── podcast.txt                     # Step 4: 旁白脚本
│   ├── media_manifest.json             # Step 5: 素材清单
│   ├── publish_info.md                 # Step 6+13: 发布信息
│   ├── podcast_audio.wav               # Step 8: TTS 音频
│   ├── podcast_audio.srt               # Step 8: 字幕文件
│   ├── timing.json                     # Step 8: 时间轴
│   ├── thumbnail_*.png                 # Step 7: 封面
│   ├── output.mp4                      # Step 10: Remotion 输出
│   ├── video_with_bgm.mp4             # Step 11: 添加 BGM
│   ├── final_video.mp4                 # Step 12: 最终输出
│   └── bgm.mp3                         # 背景音乐
│
└── remotion.config.ts                  # Remotion 配置
```

> ⚠️ **重要**: Remotion 渲染时必须指定完整输出路径，否则默认输出到 `out/`:
> ```bash
> npx remotion render src/remotion/index.ts CompositionId videos/{name}/output.mp4
> ```

### 命名规则

**视频名称 `{video-name}`**: 全小写英文，连字符分隔（如 `reference-manager-comparison`）

**章节名称 `{section}`**: 全小写英文，下划线分隔，与 `[SECTION:xxx]` 一致

**缩略图命名** (⚠️ 16:9 和 4:3 **都是必须的**，B站不同位置使用不同比例):
| 类型 | 16:9 (播放页横版) | 4:3 (推荐流/动态竖版) |
|------|------|-----|
| Remotion | `thumbnail_remotion_16x9.png` | `thumbnail_remotion_4x3.png` |
| AI | `thumbnail_ai_16x9.png` | `thumbnail_ai_4x3.png` |

### 渲染前后文件操作

```bash
# 渲染前
cp videos/{name}/podcast_audio.wav videos/{name}/timing.json public/
[ -f videos/{name}/media_manifest.json ] && cp videos/{name}/media_manifest.json public/

# 渲染后清理
rm -f public/podcast_audio.wav public/timing.json public/media_manifest.json
rm -rf public/media/{name}
```

---

## Workflow

### Progress Tracking

在 Step 1 开始时：
1. Create `videos/{name}/workflow_state.json` with initial state
2. 使用 `TaskCreate` **按以下列表逐条创建 tasks**，每步开始时 `TaskUpdate` 为 `in_progress`，完成后标记 `completed`
3. Each step completion updates BOTH `workflow_state.json` AND TaskUpdate

```
 1. Define topic direction (brainstorming) → topic_definition.md
 2. Research topic → topic_research.md
 3. Design video sections (5-7 chapters)
 4. Write narration script → podcast.txt
 5. Collect media assets → media_manifest.json
 6. Generate publish info (Part 1) → publish_info.md
 7. Generate thumbnails (16:9 + 4:3) → thumbnail_*.png
 8. Generate TTS audio → podcast_audio.wav, timing.json
 9. Create Remotion composition + Studio preview
10. Render 4K video → output.mp4
11. Mix background music → video_with_bgm.mp4
12. Add subtitles (optional) → final_video.mp4
13. Complete publish info (Part 2) → chapter timestamps
14. Verify output & cleanup
```

### Validation Checkpoints

**After Step 8 (TTS)**:
- [ ] `podcast_audio.wav` exists and plays correctly
- [ ] `timing.json` has all sections with correct timestamps
- [ ] `podcast_audio.srt` encoding is UTF-8

**After Step 10 (Render)**:
- [ ] `output.mp4` resolution is 3840x2160
- [ ] Audio-video sync verified
- [ ] No black frames

---

## Step 0: Load User Preferences

**Claude behavior:** 自动执行，无需用户干预

1. 检查 `user_prefs.json` 是否存在于 skill 目录
2. 如果不存在，从 `user_prefs.template.json` 复制创建
3. 读取用户偏好并在后续步骤中应用

```bash
SKILL_DIR="~/.claude/skills/video-podcast-maker"
PREFS_FILE="$SKILL_DIR/user_prefs.json"
TEMPLATE_FILE="$SKILL_DIR/user_prefs.template.json"

if [ ! -f "$PREFS_FILE" ]; then
  cp "$TEMPLATE_FILE" "$PREFS_FILE"
  echo "✓ 首次使用，已创建默认偏好配置"
fi
```

4. 在 Step 1 开始时，告知用户当前应用的偏好（如有自定义）：

```
"根据您的偏好设置：
 - 主题: [theme]
 - 字号缩放: [scalePreference]x
 - 语速: [tts.rate]

如需调整请随时告诉我，或说「显示偏好设置」查看详情。"
```

---

## Step 1: Define Topic Direction

使用 `brainstorming` skill 确认：
1. **目标受众**: 技术开发者 / 普通用户 / 学生 / 专业人士
2. **视频定位**: 科普入门 / 深度解析 / 新闻速报 / 教程实操
3. **内容范围**: 历史背景 / 技术原理 / 使用方法 / 对比评测
4. **视频风格**: 严肃专业 / 轻松幽默 / 快节奏
5. **时长预期**: 短 (1-3分钟) / 中 (3-7分钟) / 长 (7-15分钟)

保存为 `videos/{name}/topic_definition.md`

---

## Step 2: Research Topic

Use WebSearch and WebFetch. Save to `videos/{name}/topic_research.md`.

---

## Step 3: Design Video Sections

Design 5-7 sections:
- Hero/Intro (15-25s)
- Core concepts (30-45s each)
- Demo/Examples (30-60s)
- Comparison/Analysis (30-45s)
- Summary (20-30s)

### Content Density Selection

Before designing, assign each section a density tier based on content volume:

| Tier | Items | Best For |
|------|-------|----------|
| **Impact** | 1 | Hook, hero, CTA, brand moment — largest text |
| **Standard** | 2-3 | Features, comparison, demo |
| **Compact** | 4-6 | Feature grid, ecosystem |
| **Dense** | 6+ | Data tables, detailed comparisons — smallest text |

### Topic Type Detection

基于主题关键词自动检测类别并匹配偏好：

| 关键词 | 类别 | 应用偏好 |
|-------|------|---------|
| AI、编程、软件、硬件、技术 | tech | topic_patterns.tech |
| 投资、股票、基金、加密货币、理财 | finance | topic_patterns.finance |
| 教程、学习、入门、指南 | education | topic_patterns.education |
| 美食、旅行、生活、Vlog | lifestyle | topic_patterns.lifestyle |
| 新闻、热点、事件、速报 | news | topic_patterns.news |

**Claude behavior:** 检测到主题类别后，合并 `topic_patterns[category]` 到当前偏好。

### Title Position

**Auto mode:** Use `top-center` (default for most video content).
**Interactive mode:** Ask user to choose from: 顶部居中 (推荐) / 顶部左侧 / 全屏居中.

**规则：** 单个视频内保持标题位置一致。

---

## Step 4: Write Narration Script

**偏好应用:** 根据 `user_prefs.content` 调整脚本风格：
- `tone: professional` → 使用正式用语，避免口语化
- `tone: casual` → 轻松口语，可加入语气词
- `verbosity: concise` → 每段 50-80 字
- `verbosity: detailed` → 每段 100-150 字

Create `videos/{name}/podcast.txt` with section markers:

```text
[SECTION:hero]
大家好，欢迎来到本期视频。今天我们聊一个...

[SECTION:features]
它有以下功能...

[SECTION:demo]
让我演示一下...

[SECTION:summary]
总结一下，xxx是目前最xxx的xxx。

[SECTION:references]
本期视频参考了官方文档和技术博客。

[SECTION:outro]
感谢观看！点赞投币收藏，关注我，下期再见！
```

**数字必须使用中文读音** - 所有数字必须写成中文，TTS 才能正确朗读：

| 类型 | ❌ 错误 | ✅ 正确 |
|------|---------|---------|
| 整数 | 29, 3999, 128 | 二十九，三千九百九十九，一百二十八 |
| 小数 | 1.2, 3.5 | 一点二，三点五 |
| 百分比 | 15%, -10% | 百分之十五，负百分之十 |
| 日期 | 2025-01-15 | 二零二五年一月十五日 |
| 大数字 | 6144, 234324 | 六千一百四十四，二十三万四千三百二十四 |
| 英文单位 | 128GB, 273GB/s | 一百二十八G，二百七十三GB每秒 |

**章节说明**:
- **summary**: 纯内容总结，不包含互动引导
- **references** (可选): 一句话概括参考来源
- **outro**: 感谢 + 一键三连引导
- 空内容的 `[SECTION:xxx]` 为静音章节

### Duration Estimation (Dry Run)

**Claude behavior:** After writing `podcast.txt`, automatically run dry-run to estimate video duration:

```bash
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name} --dry-run
```

Report estimated duration to user. If too long (>12min) or too short (<3min), suggest adjustments before proceeding to TTS.

---

## Step 5: Collect Media Assets

**Auto mode:** Skip media collection (text-only animated sections). Proceed to Step 6.
**Interactive mode:** Ask per-section media source (跳过 / 本地文件 / 网页截图 / 网络检索 / AI 生成).

If user mentioned AI images, screenshots, or specific assets in their initial request, collect those regardless of mode.

素材保存到 `public/media/{video-name}/`，生成 `media_manifest.json`。

**可用素材来源：**
- **Unsplash** / **Pexels** / **Pixabay** — 免费图片
- **unDraw** — 开源 SVG 插图
- **Simple Icons** — 品牌 SVG 图标
- **Playwright** — 网页截图
- **imagen skill** — AI 生成图片

---

## Step 6: Generate Publish Info (Part 1)

基于 `podcast.txt` 生成 `publish_info.md`:
- 标题（数字 + 主题 + 吸引词）
- 标签（10个，含产品名/领域词/热门标签）
- 简介（100-200字）

---

## Step 7: Generate Video Thumbnail

**Auto mode:** Generate Remotion thumbnails (16:9 + 4:3).
**Interactive mode:** Ask user to choose: Remotion生成 / AI文生图(imagen skill) / 两者都生成.

⚠️ **必须生成两个比例**: 16:9 (播放页) 和 4:3 (推荐流/动态)，缺一不可。9:16 仅在生成竖屏视频时需要。

```bash
npx remotion still src/remotion/index.ts Thumbnail16x9 videos/{name}/thumbnail_remotion_16x9.png
npx remotion still src/remotion/index.ts Thumbnail4x3 videos/{name}/thumbnail_remotion_4x3.png
# Optional: vertical thumbnail (only if rendering vertical video)
npx remotion still src/remotion/index.ts Thumbnail9x16 videos/{name}/thumbnail_remotion_9x16.png
```

---

## Step 8: Generate TTS Audio

**偏好应用:** 从 `user_prefs.tts` 读取 backend/rate/voice 设置。

```bash
cp ~/.claude/skills/video-podcast-maker/generate_tts.py .

# Primary command (backend from user_prefs or env)
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name}

# Resume from breakpoint (skip already synthesized parts)
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name} --resume

# Dry run (estimate duration, no API call)
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name} --dry-run
```

Backend selection via env: `TTS_BACKEND=azure|cosyvoice|edge`, rate via `TTS_RATE="+5%"`.

### 多音字/发音校正 (SSML Phoneme)

TTS 脚本支持三种方式校正发音，优先级从高到低：

**1. 内联标注** (最高优先级) - 在 podcast.txt 中直接标注：
```text
每个执行器[zhí xíng qì]都有自己的上下文窗口
如果不合格，就打回重做[chóng zuò]
```

**2. 项目词典** - 在 `videos/{name}/phonemes.json` 中定义：
```json
{
  "执行器": "zhí xíng qì",
  "重做": "chóng zuò",
  "一行命令": "yì háng mìng lìng"
}
```

**3. 内置词典** - 预置常见多音字（自动应用）

**Outputs**: `podcast_audio.wav`, `podcast_audio.srt`, `timing.json`

**timing.json `label` field**: Each section gets a human-readable label extracted from the first line of its content (before first punctuation, max 10 chars). This is displayed in the `ChapterProgressBar` component. Example: `[SECTION:hero]` with content "大家好，欢迎来到本期视频" → `label: "大家好"`. Silent sections use the section name as label.

---

## Step 9: Create Remotion Composition + Studio Preview

**Claude MUST read `DESIGN_GUIDE.md` before this step.**

**偏好应用:** 从 `user_prefs.visual` 覆盖 `defaultVideoProps`：
- `typography.*` × `scalePreference` → 应用字号缩放
- `theme: dark` → 交换 backgroundColor/textColor
- `primaryColor`, `accentColor` → 直接覆盖

复制文件到 public/:
```bash
cp videos/{name}/podcast_audio.wav videos/{name}/timing.json public/
```

### 标准视频模板（必须遵循）

使用 `templates/Video.tsx` 作为起点，已包含完整实现（4K 缩放、章节进度条、音频集成）。

```bash
cp ~/.claude/skills/video-podcast-maker/templates/Video.tsx src/remotion/
cp ~/.claude/skills/video-podcast-maker/templates/Root.tsx src/remotion/
cp -r ~/.claude/skills/video-podcast-maker/templates/components src/remotion/components
```

Components are modular — import only what you need:
```tsx
import { ComparisonCard, CodeBlock, FeatureGrid } from "./components";
```

### 章节转场效果

模板使用 `@remotion/transitions` 的 `TransitionSeries` 实现章节间平滑过渡。

| 属性 | 默认值 | 说明 |
|------|--------|------|
| `transitionType` | `fade` | 转场类型：fade / slide / wipe / none |
| `transitionDuration` | `15` (0.5秒) | 转场时长（帧数） |

安装依赖（项目中执行）：
```bash
npm install @remotion/transitions
```

### 关键架构说明

| 要点 | 说明 |
|------|------|
| **ChapterProgressBar 位置** | 必须放在 `scale(2)` 容器**外部**，否则宽度会被压缩 |
| **章节宽度分配** | 使用 `flex: ch.duration_frames` 按时长比例分配 |
| **进度指示** | 当前章节内显示白色进度条，底部显示总进度 |
| **4K 缩放** | 内容区域使用 `scale(2)` 从 1920×1080 放大到 3840×2160 |

### 一键三连片尾

**Auto mode:** Use pre-made MP4 animation (white for light theme, black for dark theme).
**Interactive mode:** Ask user to choose: 预制 MP4 动画 (推荐) / Remotion 代码生成.

```bash
# Copy to project public directory
cp ~/.claude/skills/video-podcast-maker/assets/bilibili-triple-white.mp4 public/media/{video-name}/
# Or black background version
cp ~/.claude/skills/video-podcast-maker/assets/bilibili-triple-black.mp4 public/media/{video-name}/
```

```tsx
// In outro section, embed with <OffthreadVideo>
import { OffthreadVideo, staticFile } from "remotion";
<OffthreadVideo src={staticFile("media/{video-name}/bilibili-triple-white.mp4")} />
```

### Studio Preview & Iterative Refinement

**Both modes:** Always launch Studio preview and iterate. This is the essential quality gate.

```bash
npx remotion studio src/remotion/index.ts
```

**Iterative feedback loop:**

1. Launch `remotion studio` (real-time preview, hot reload)
2. **Ask user:** "预览效果满意吗？如果需要调整，请描述修改意见（例如：标题太小、背景换深色、动画太快）"
   - **满意，继续渲染** → proceed to Step 10
   - **需要修改** → apply changes, Studio hot reloads, repeat
3. Pronunciation fixes require re-running TTS (Step 8) and copying updated files to `public/`.

---

## Step 10: Render Video

### Preview Render (recommended before 4K)

Quick 720p render (~10x faster than 4K) to validate full video end-to-end (audio sync, transitions, timing):

```bash
npx remotion render src/remotion/index.ts CompositionId videos/{name}/preview.mp4 --scale 0.33 --crf 28
```

This catches issues that Studio preview may miss (e.g., audio sync drift, transition timing across sections, final frame count). Review `preview.mp4`, then proceed to 4K if satisfied.

> **When to use Studio vs preview render:**
> - **Studio** — iterating on visual design (layout, colors, animations). Real-time, hot reload.
> - **Preview render** — validating the complete video (audio sync, transitions, pacing). Fast MP4 output.

### 4K Render

```bash
npx remotion render src/remotion/index.ts CompositionId videos/{name}/output.mp4 --video-bitrate 16M
```

**验证 4K**:
```bash
ffprobe -v quiet -show_entries stream=width,height -of csv=p=0 videos/{name}/output.mp4
# 期望: 3840,2160
```

### Optional: Render Vertical Highlight Clip (9:16)

```bash
npx remotion render src/remotion/index.ts MyVideoVertical videos/{name}/output_vertical.mp4 --video-bitrate 16M
npx remotion still src/remotion/index.ts Thumbnail9x16 videos/{name}/thumbnail_remotion_9x16.png
```

The vertical composition reuses Video.tsx with `orientation: "vertical"`. All components auto-adapt for 9:16.

---

## Step 11: Mix with Background Music

```bash
cp ~/.claude/skills/video-podcast-maker/assets/perfect-beauty-191271.mp3 videos/{name}/bgm.mp3

ffmpeg -y \
  -i videos/{name}/output.mp4 \
  -stream_loop -1 -i videos/{name}/bgm.mp3 \
  -filter_complex "[0:a]volume=1.0[a1];[1:a]volume=0.05[a2];[a1][a2]amix=inputs=2:duration=first[aout]" \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k \
  videos/{name}/video_with_bgm.mp4
```

> **BGM options & troubleshooting:** See `TROUBLESHOOTING.md`.

---

## Step 12: Add Subtitles

**Auto mode:** Skip subtitles — copy `video_with_bgm.mp4` as `final_video.mp4`.
**Interactive mode:** Ask user: "需要烧录字幕吗？字幕可以提高视频的可访问性。"

If user requested subtitles (any mode):
```bash
ffmpeg -y -i videos/{name}/video_with_bgm.mp4 \
  -vf "subtitles=videos/{name}/podcast_audio.srt:force_style='FontName=PingFang SC,FontSize=14,PrimaryColour=&H00333333,OutlineColour=&H00FFFFFF,Bold=1,Outline=2,Shadow=0,MarginV=20'" \
  -c:v libx264 -crf 18 -preset slow -s 3840x2160 \
  -c:a copy videos/{name}/final_video.mp4
```

If skipping subtitles:
```bash
cp videos/{name}/video_with_bgm.mp4 videos/{name}/final_video.mp4
```

---

## Step 13: Complete Publish Info (Part 2)

从 `timing.json` 生成 B站章节：

```
00:00 开场
00:23 功能介绍
00:55 演示
01:20 总结
```

格式：`MM:SS 章节标题`，每段间隔 ≥5秒。

---

## Step 14: Verify Output & Cleanup

### 14.1 Verification

```bash
VIDEO_DIR="videos/{name}"
echo "=== 文件检查 ==="
for f in podcast.txt podcast_audio.wav podcast_audio.srt timing.json output.mp4 final_video.mp4; do
  [ -f "$VIDEO_DIR/$f" ] && echo "✓ $f" || echo "✗ $f 缺失"
done

echo "=== 技术指标 ==="
RES=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$VIDEO_DIR/final_video.mp4")
[ "$RES" = "3840,2160" ] && echo "✓ 分辨率: 3840x2160 (4K)" || echo "✗ 分辨率: $RES (非4K)"
DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$VIDEO_DIR/final_video.mp4" | cut -d. -f1)
echo "✓ 时长: ${DUR}s"
SIZE=$(ls -lh "$VIDEO_DIR/final_video.mp4" | awk '{print $5}')
echo "✓ 文件大小: $SIZE"
```

### 14.2 Cleanup

**Auto mode:** Auto-clean temp files, report what was removed.
**Interactive mode:** List files and ask for confirmation before deleting.

```bash
VIDEO_DIR="videos/{name}"
rm -f "$VIDEO_DIR"/part_*.wav "$VIDEO_DIR"/concat_list.txt
rm -f "$VIDEO_DIR"/output.mp4 "$VIDEO_DIR"/video_with_bgm.mp4
rm -f public/podcast_audio.wav public/timing.json public/media_manifest.json
rm -rf public/media/{name}
echo "✓ 临时文件已清理"
```

### 14.3 Final Report

```
=== 视频制作完成 ===
✓ 文件: final_video.mp4
✓ 分辨率: 3840x2160 (4K)
✓ 时长: XXs
✓ 大小: XXX MB
✓ 封面: thumbnail_remotion_16x9.png, thumbnail_remotion_4x3.png
✓ 发布信息: publish_info.md
✓ 临时文件已清理
```

---

## Troubleshooting & Preferences

> **Full reference:** Read `TROUBLESHOOTING.md` when encountering errors, when user asks about preferences or BGM options.
