# Skill UX Improvements: Auto Mode, Error Recovery, File Split

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce user interruptions (9→2 mandatory prompts), add workflow resume capability, and split SKILL.md from 1258→~500 lines.

**Architecture:** Extract visual design and troubleshooting content into separate reference docs loaded on-demand. Add execution mode system (auto/interactive) to SKILL.md. Add workflow_state.json persistence for step-level resume.

**Tech Stack:** Markdown (SKILL.md, DESIGN_GUIDE.md, TROUBLESHOOTING.md)

---

## Task 1: Create DESIGN_GUIDE.md

**Files:**
- Create: `DESIGN_GUIDE.md`

Extract the following sections from current SKILL.md (preserving exact content):

| Source Lines | Section |
|-------------|---------|
| 176-211 | Visual Design Minimums (MUST follow) |
| 214-226 | Design Philosophy |
| 228-259 | Quality Checklists (Per-Section + Video-Level + TTS Quality) |
| 261-300 | Visual Design Reference (Typography Scale, Layout Patterns, Color Coding) |

**Step 1: Create DESIGN_GUIDE.md**

Content structure:
```markdown
# Video Podcast Maker — Design Guide

> **When to load:** Claude loads this file when working on Step 9 (Remotion composition) or when the user asks about visual design.

## Visual Design Minimums (MUST follow)
[exact content from SKILL.md lines 178-211]

## Design Philosophy
[exact content from SKILL.md lines 216-226]

## Quality Checklists (MUST follow)
[exact content from SKILL.md lines 228-259]

## Visual Design Reference (recommended)
[exact content from SKILL.md lines 263-300]
```

**Step 2: Verify line count**

Run: `wc -l DESIGN_GUIDE.md`
Expected: ~180 lines

**Step 3: Commit**

```bash
git add DESIGN_GUIDE.md
git commit -m "docs: extract design guide from SKILL.md"
```

---

## Task 2: Create TROUBLESHOOTING.md

**Files:**
- Create: `TROUBLESHOOTING.md`

Extract:

| Source Lines | Section |
|-------------|---------|
| 868-914 | Step 9.5: Learn from Modifications (preference learning) |
| 1124-1128 | Background Music Options |
| 1130-1201 | Preference Commands |
| 1204-1258 | Troubleshooting (常见问题) |

**Step 1: Create TROUBLESHOOTING.md**

Content structure:
```markdown
# Video Podcast Maker — Troubleshooting & Reference

> **When to load:** Claude loads this file when encountering errors, when user asks about preferences, or when user asks about BGM options.

## Troubleshooting (常见问题)
[exact content: TTS Azure errors, FFmpeg BGM issues, quick checklists]

## Background Music Options
[exact content]

## Preference Commands
[exact content: show/reset/save/manual preferences]

## Preference Learning (Step 9.5)
[exact content: detect modifications, progressive learning, explicit capture, update prefs]
```

**Step 2: Verify line count**

Run: `wc -l TROUBLESHOOTING.md`
Expected: ~200 lines

**Step 3: Commit**

```bash
git add TROUBLESHOOTING.md
git commit -m "docs: extract troubleshooting and preferences from SKILL.md"
```

---

## Task 3: Rewrite SKILL.md — Add Execution Modes

**Files:**
- Modify: `SKILL.md`

**Step 1: Add Execution Modes section after Overview**

Insert new section after line ~158 (after "输出规格" table). This replaces the current behavior where every step has its own AskUserQuestion:

```markdown
## Execution Modes

**Claude behavior:** At the start of the workflow (before Step 1), detect the user's intent:

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
| Step 7 | Thumbnail method | Remotion-generated |
| Step 9 | Outro animation | Pre-made MP4 (white version, or black if dark theme) |
| Step 12 | Subtitles | Skip (copy video_with_bgm.mp4 as final) |
| Step 14.4 | Satisfaction survey | Skip |
| Step 15 | Cleanup | Auto-clean temp files |

Users can override any default by mentioning it in their initial request:
- "帮我做一个关于AI的视频，要烧字幕" → auto mode + subtitles on
- "用深色主题，AI生成封面" → auto mode + dark theme + imagen thumbnails

### Interactive Mode

Prompts the user at each decision point (current behavior). Activated by:
- "互动模式" / "interactive mode"
- "我想自己选择每个选项"
- User explicitly requests control over specific steps
```

**Step 2: Modify each step to respect execution mode**

For each step that currently has AskUserQuestion, add a mode check pattern:

**Step 3 (Title Position)** — change from:
```
使用 AskUserQuestion 询问用户标题位置偏好
```
to:
```
**Auto mode:** Use `top-center` (default). **Interactive mode:** Ask user to choose.
```

**Step 5 (Media Assets)** — change from:
```
首先询问用户：是否需要使用 imagen skill...
Claude 逐章节询问素材来源
```
to:
```
**Auto mode:** Skip media collection (text-only sections). **Interactive mode:** Ask per-section.
If user mentioned AI images or specific assets in their request, collect those regardless of mode.
```

**Step 7 (Thumbnails)** — change from:
```
询问用户选择封面生成方式
```
to:
```
**Auto mode:** Generate Remotion thumbnails (16:9 + 4:3). **Interactive mode:** Ask user to choose method.
```

**Step 9 (Outro)** — change from:
```
使用 AskUserQuestion 询问用户片尾一键三连的实现方式
```
to:
```
**Auto mode:** Use pre-made MP4 animation (white for light theme, black for dark). **Interactive mode:** Ask user.
```

**Step 9 (Studio Preview)** — KEEP the prompt in both modes (this is the valuable one):
```
**Both modes:** Always launch Studio preview and ask for feedback. This is the only iterative prompt.
```

**Step 12 (Subtitles)** — change from:
```
Ask before skipping: "需要烧录字幕吗？"
```
to:
```
**Auto mode:** Skip subtitles (copy video_with_bgm.mp4 as final_video.mp4). **Interactive mode:** Ask user.
```

**Step 14.4 (Satisfaction)** — change from:
```
验证完成后询问满意度
```
to:
```
**Auto mode:** Skip satisfaction survey, just report verification results. **Interactive mode:** Ask for feedback.
```

**Step 15 (Cleanup)** — change from:
```
Ask before skipping: "要清理临时文件吗？"
```
to:
```
**Auto mode:** Auto-clean temp files, report what was removed. **Interactive mode:** List files and ask for confirmation.
```

**Step 3: Commit**

```bash
git add SKILL.md
git commit -m "feat: add auto/interactive execution modes to reduce interruptions"
```

---

## Task 4: Rewrite SKILL.md — Add Workflow State & Resume

**Files:**
- Modify: `SKILL.md`

**Step 1: Add Workflow State section after Execution Modes**

```markdown
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
    "3": { "status": "completed", "completed_at": "2026-03-16T10:36:00" },
    "4": { "status": "completed", "completed_at": "2026-03-16T10:40:00" },
    "5": { "status": "skipped" },
    "6": { "status": "completed", "completed_at": "2026-03-16T10:41:00" },
    "7": { "status": "completed", "completed_at": "2026-03-16T10:42:00" },
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

Users can also explicitly resume:
- "继续上次的视频" → find latest workflow_state.json, resume
- "从第8步开始" → resume from Step 8 (validate prior steps' outputs exist)
```

**Step 2: Update Progress Tracking section**

Replace the current TaskCreate-only tracking with combined approach:

```markdown
### Progress Tracking

在 Step 1 开始时：
1. Create `videos/{name}/workflow_state.json` with initial state
2. 使用 `TaskCreate` 创建 tasks（同时用于会话内跟踪）
3. Each step completion updates BOTH workflow_state.json AND TaskUpdate
```

**Step 3: Commit**

```bash
git add SKILL.md
git commit -m "feat: add workflow state persistence and auto-resume"
```

---

## Task 5: Trim SKILL.md — Remove Extracted Content

**Files:**
- Modify: `SKILL.md`

**Step 1: Remove sections that were extracted to DESIGN_GUIDE.md**

Remove these sections and replace with a one-line reference:

```markdown
## Visual Design

> **Full design guide:** Read `DESIGN_GUIDE.md` when working on Step 9 (Remotion composition).
> Claude MUST load DESIGN_GUIDE.md before creating or modifying any Remotion components.
```

This replaces:
- "Visual Design Minimums" (lines 176-211)
- "Design Philosophy" (lines 214-226)
- "Quality Checklists" (lines 228-259)
- "Visual Design Reference" (lines 261-300)

**Step 2: Remove sections extracted to TROUBLESHOOTING.md**

Remove and replace with:

```markdown
## Troubleshooting & Preferences

> **Full reference:** Read `TROUBLESHOOTING.md` when encountering errors or when user asks about preferences/BGM.
```

This replaces:
- "Step 9.5: Learn from Modifications" (lines 868-914)
- "Background Music Options" (lines 1124-1128)
- "Preference Commands" (lines 1130-1201)
- "Troubleshooting" (lines 1204-1258)

**Step 3: Remove redundant TTS command examples from Step 8**

Current Step 8 has 7 example commands (lines 661-683) plus an env vars table. Keep only:
- The primary command (auto mode uses user_prefs.tts.backend)
- The `--resume` command
- The `--dry-run` command
- Remove the env vars table (already in CLAUDE.md)

**Step 4: Compact Step 14 and 15**

Merge Steps 14+15 into a single "Verify & Cleanup" section (~20 lines instead of ~70).

**Step 5: Verify final line count**

Run: `wc -l SKILL.md`
Expected: ~500 lines (±50)

**Step 6: Commit**

```bash
git add SKILL.md
git commit -m "refactor: trim SKILL.md to ~500 lines, reference split docs"
```

---

## Task 6: Update CLAUDE.md References

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add references to new files in Architecture section**

Add to the Architecture section:

```markdown
### Documentation Structure

| File | Purpose | When Claude Loads |
|------|---------|-------------------|
| `SKILL.md` | Core workflow (15 steps), execution modes, resume | Always (skill invocation) |
| `DESIGN_GUIDE.md` | Visual minimums, typography, layout patterns, checklists | Step 9 (Remotion composition) |
| `TROUBLESHOOTING.md` | Error fixes, preference commands, BGM options, preference learning | On error or user request |
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add references to split documentation files"
```

---

## Task 7: Final Verification

**Step 1: Verify all 3 files exist and have reasonable sizes**

```bash
echo "=== File sizes ==="
wc -l SKILL.md DESIGN_GUIDE.md TROUBLESHOOTING.md
echo ""
echo "=== Total ==="
cat SKILL.md DESIGN_GUIDE.md TROUBLESHOOTING.md | wc -l
```

Expected:
- SKILL.md: ~450-550 lines
- DESIGN_GUIDE.md: ~170-200 lines
- TROUBLESHOOTING.md: ~180-220 lines
- Total: ~800-970 lines (down from 1258 in single file, but more organized)

**Step 2: Verify no content was lost**

Spot-check that key sections exist in the correct file:
- "Visual Design Minimums" → DESIGN_GUIDE.md
- "Quality Checklists" → DESIGN_GUIDE.md
- "Execution Modes" → SKILL.md
- "Workflow State & Resume" → SKILL.md
- "Troubleshooting" → TROUBLESHOOTING.md
- "Preference Commands" → TROUBLESHOOTING.md

**Step 3: Verify SKILL.md references the other files**

Grep for references:
```bash
grep -n "DESIGN_GUIDE\|TROUBLESHOOTING" SKILL.md
```
Expected: At least 2 references (one for each file)

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify skill UX improvements complete"
```
