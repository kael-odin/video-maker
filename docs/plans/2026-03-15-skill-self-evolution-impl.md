# Skill Self-Evolution Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable video-podcast-maker skill to learn and apply user preferences automatically.

**Architecture:** File-based preference storage (`user_prefs.json`) with preference extraction from user feedback, topic-based matching, and transparent application during video creation workflow.

**Tech Stack:** JSON for storage, SKILL.md for workflow integration, Root.tsx for Remotion props override.

---

## Task 1: Create Preference Schema

**Files:**
- Create: `prefs_schema.json`

**Step 1: Create the schema file**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "UserPreferences",
  "description": "Video Podcast Maker user preference schema",
  "type": "object",
  "properties": {
    "version": { "type": "string", "default": "1.0" },
    "updated_at": { "type": "string", "format": "date-time" },
    "global": {
      "type": "object",
      "properties": {
        "visual": {
          "type": "object",
          "properties": {
            "theme": { "enum": ["light", "dark", "auto"], "default": "light" },
            "primaryColor": { "type": "string", "default": "#4f6ef7" },
            "backgroundColor": { "type": "string", "default": "#ffffff" },
            "accentColor": { "type": "string", "default": "#FF6B6B" },
            "preferredComponents": { "type": "array", "items": { "type": "string" } },
            "titlePosition": { "enum": ["top-center", "top-left", "center"], "default": "top-center" },
            "progressBar": { "type": "boolean", "default": true },
            "typography": {
              "type": "object",
              "properties": {
                "heroTitle": { "type": "number", "default": 96 },
                "sectionTitle": { "type": "number", "default": 80 },
                "cardTitle": { "type": "number", "default": 38 },
                "bodyText": { "type": "number", "default": 32 },
                "caption": { "type": "number", "default": 24 },
                "scalePreference": { "type": "number", "default": 1.0 }
              }
            },
            "layout": {
              "type": "object",
              "properties": {
                "textAlign": { "enum": ["center", "left"], "default": "center" },
                "contentWidth": { "type": "number", "default": 0.9 },
                "cardPadding": { "type": "number", "default": 36 }
              }
            },
            "spacing": {
              "type": "object",
              "properties": {
                "sectionPadding": { "type": "number", "default": 60 },
                "itemGap": { "type": "number", "default": 28 },
                "marginBottom": { "type": "number", "default": 100 }
              }
            }
          }
        },
        "tts": {
          "type": "object",
          "properties": {
            "backend": { "enum": ["azure", "cosyvoice", "edge"], "default": "azure" },
            "rate": { "type": "string", "default": "+5%" },
            "voice": { "type": "string", "default": "zh-CN-XiaoxiaoNeural" }
          }
        },
        "content": {
          "type": "object",
          "properties": {
            "tone": { "enum": ["professional", "casual", "energetic"], "default": "professional" },
            "verbosity": { "enum": ["concise", "balanced", "detailed"], "default": "balanced" },
            "sectionCount": { "type": "number", "default": 5 },
            "outroStyle": { "enum": ["standard", "minimal"], "default": "standard" }
          }
        }
      }
    },
    "topic_patterns": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "visual": { "type": "object" },
          "tts": { "type": "object" },
          "content": { "type": "object" }
        }
      }
    },
    "learning_history": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": { "type": "string" },
          "source": { "enum": ["explicit", "implicit", "feedback"] },
          "change": {
            "type": "object",
            "properties": {
              "path": { "type": "string" },
              "from": {},
              "to": {}
            }
          },
          "context": { "type": "string" }
        }
      }
    }
  }
}
```

**Step 2: Verify JSON validity**

Run: `python3 -c "import json; json.load(open('prefs_schema.json'))"`
Expected: No output (valid JSON)

**Step 3: Commit**

```bash
git add prefs_schema.json
git commit -m "feat: add user preference schema definition"
```

---

## Task 2: Create Default Preferences Template

**Files:**
- Create: `user_prefs.template.json`

**Step 1: Create template with sensible defaults**

```json
{
  "version": "1.0",
  "updated_at": null,
  "global": {
    "visual": {
      "theme": "light",
      "primaryColor": "#4f6ef7",
      "backgroundColor": "#ffffff",
      "accentColor": "#FF6B6B",
      "preferredComponents": [],
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
        "textAlign": "center",
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
      "backend": "azure",
      "rate": "+5%",
      "voice": "zh-CN-XiaoxiaoNeural"
    },
    "content": {
      "tone": "professional",
      "verbosity": "balanced",
      "sectionCount": 5,
      "outroStyle": "standard"
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
    "education": {
      "visual": { "primaryColor": "#22c55e", "theme": "light" },
      "content": { "tone": "casual" }
    },
    "lifestyle": {
      "visual": { "primaryColor": "#FF6B6B", "theme": "light" },
      "content": { "tone": "casual" }
    },
    "news": {
      "visual": { "primaryColor": "#dc2626", "theme": "light" },
      "content": { "tone": "professional", "verbosity": "concise" }
    }
  },
  "learning_history": []
}
```

**Step 2: Verify JSON validity**

Run: `python3 -c "import json; json.load(open('user_prefs.template.json'))"`
Expected: No output (valid JSON)

**Step 3: Commit**

```bash
git add user_prefs.template.json
git commit -m "feat: add default user preferences template"
```

---

## Task 3: Create Preference Keywords Mapping

**Files:**
- Create: `pref_keywords.json`

**Step 1: Create keyword-to-preference mapping**

```json
{
  "visual.theme": {
    "dark": ["深色", "暗色", "黑色主题", "dark", "夜间模式"],
    "light": ["浅色", "亮色", "白色主题", "light", "明亮"]
  },
  "visual.typography.scalePreference": {
    "increase": ["文字太小", "看不清", "字太小", "放大字体", "字号大一点", "标题太小"],
    "decrease": ["文字太大", "字太大", "字号小一点"]
  },
  "tts.rate": {
    "increase": ["语速快一点", "说话太慢", "加快语速", "快一点"],
    "decrease": ["语速慢一点", "说话太快", "慢一点"]
  },
  "content.tone": {
    "professional": ["正式一点", "专业一点", "严肃一点"],
    "casual": ["轻松一点", "口语化", "随意一点"],
    "energetic": ["有活力", "激动一点", "热情一点"]
  },
  "layout.textAlign": {
    "left": ["靠左对齐", "左对齐", "文字靠左"],
    "center": ["居中对齐", "居中", "文字居中"]
  },
  "layout.titlePosition": {
    "top-center": ["标题居中", "标题放中间"],
    "top-left": ["标题靠左", "标题放左边"],
    "center": ["标题全屏居中", "大标题居中"]
  },
  "save_pattern": ["以后都用", "保存为默认", "记住这个", "下次也用"],
  "save_topic_pattern": ["科技类", "金融类", "教育类", "生活类", "新闻类"],
  "show_prefs": ["显示偏好", "我的设置", "查看偏好"],
  "reset_prefs": ["重置偏好", "清除学习", "恢复默认"]
}
```

**Step 2: Verify JSON validity**

Run: `python3 -c "import json; json.load(open('pref_keywords.json'))"`
Expected: No output (valid JSON)

**Step 3: Commit**

```bash
git add pref_keywords.json
git commit -m "feat: add preference keyword mapping for NLU"
```

---

## Task 4: Update SKILL.md - Add Step 0 (Load Preferences)

**Files:**
- Modify: `SKILL.md` (add after line ~335, before Step 1)

**Step 1: Add Step 0 section**

Insert after "Progress Tracking" section and before "## Step 1":

```markdown
---

## Step 0: Load User Preferences

**Claude behavior:** 自动执行，无需用户干预

1. 检查 `user_prefs.json` 是否存在于 skill 目录
2. 如果不存在，从 `user_prefs.template.json` 复制创建
3. 读取用户偏好并在后续步骤中应用

```bash
SKILL_DIR="$(dirname "$0")"
PREFS_FILE="$SKILL_DIR/user_prefs.json"
TEMPLATE_FILE="$SKILL_DIR/user_prefs.template.json"

if [ ! -f "$PREFS_FILE" ]; then
  cp "$TEMPLATE_FILE" "$PREFS_FILE"
  echo "✓ 首次使用，已创建默认偏好配置"
fi
```

4. 在 Step 1 开始时，告知用户当前应用的偏好（如有）：

```
"根据您的偏好设置：
 - 主题: [theme]
 - 字号偏好: [scalePreference]x
 - 语速: [tts.rate]

如需调整请随时告诉我，或说「显示偏好设置」查看详情。"
```

---
```

**Step 2: Commit**

```bash
git add SKILL.md
git commit -m "feat: add Step 0 for loading user preferences"
```

---

## Task 5: Update SKILL.md - Add Step 9.5 (Learn from Modifications)

**Files:**
- Modify: `SKILL.md` (add after Step 9, before Step 10)

**Step 1: Add Step 9.5 section**

Insert after "## Step 9" section:

```markdown
---

## Step 9.5: Learn from Modifications

**Claude behavior:** Studio 预览迭代完成后执行

### 9.5.1 检测修改

对比 Studio 预览开始时和结束时的值，识别用户手动调整：

| 属性类别 | 检测项 |
|---------|--------|
| 字体 | titleSize, subtitleSize, bodySize 变化 |
| 颜色 | primaryColor, backgroundColor 变化 |
| 布局 | 进度条开关、转场效果变化 |

### 9.5.2 渐进学习

- **首次修改**：仅当前视频生效，不更新全局偏好
- **重复修改**（≥2次相同方向）：询问用户是否设为默认

```
"检测到您连续 [N] 次调大标题字号（从 80 到 96），是否将 96px 设为默认值？"
- 是（推荐）→ 更新 user_prefs.json
- 否 → 仅当前视频使用
```

### 9.5.3 显式偏好捕获

在对话中检测以下表达并学习：

| 用户表达模式 | 学习动作 |
|-------------|---------|
| "以后都用这个颜色" | 保存当前 primaryColor 到 global |
| "科技类视频用这个风格" | 保存到 topic_patterns.tech |
| "记住这个设置" | 保存当前所有修改到 global |

### 9.5.4 更新偏好文件

学习到新偏好后：

```bash
# Claude 更新 user_prefs.json
# 添加 learning_history 记录
{
  "date": "2026-03-15",
  "source": "implicit",
  "change": { "path": "global.visual.typography.heroTitle", "from": 80, "to": 96 },
  "context": "用户在 Studio 中连续 3 次调大标题"
}
```

---
```

**Step 2: Commit**

```bash
git add SKILL.md
git commit -m "feat: add Step 9.5 for learning from user modifications"
```

---

## Task 6: Update SKILL.md - Add Preference Commands

**Files:**
- Modify: `SKILL.md` (add new section after Troubleshooting)

**Step 1: Add Preference Commands section**

Append before final `---`:

```markdown
---

## Preference Commands

用户可在对话中随时使用以下命令管理偏好：

### 查看偏好

```
用户: "显示我的偏好设置"
```

Claude 输出：

```
=== 当前偏好设置 ===

【视觉】
  主题: light
  主色: #4f6ef7
  字号缩放: 1.0x
  标题位置: top-center

【TTS】
  后端: azure
  语速: +5%
  声音: XiaoxiaoNeural

【内容】
  风格: professional
  详细度: balanced
  章节数: 5

【主题模板】
  tech: 蓝色专业风
  finance: 深色专业风
  lifestyle: 粉红轻松风

学习记录: 3 条
```

### 重置偏好

```
用户: "重置偏好" / "清除学习记录"
```

Claude 确认后执行：

```bash
cp user_prefs.template.json user_prefs.json
echo "✓ 偏好已重置为默认值"
```

### 保存当前设置

```
用户: "把这个视频的设置保存为科技类默认"
```

Claude 提取当前视频的 visual/tts/content 设置，更新 `topic_patterns.tech`。

### 手动设置偏好

```
用户: "把默认语速设为 +10%"
用户: "以后标题都用 100px"
用户: "深色主题设为默认"
```

Claude 直接更新 `user_prefs.json` 对应字段。

---
```

**Step 2: Commit**

```bash
git add SKILL.md
git commit -m "feat: add preference management commands documentation"
```

---

## Task 7: Update SKILL.md - Integrate Preferences in Existing Steps

**Files:**
- Modify: `SKILL.md` (update Steps 1, 4, 8, 9, 14)

**Step 1: Update Step 1 - Add topic detection**

In Step 1 section, add after topic definition:

```markdown
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
```

**Step 2: Update Step 4 - Apply content preferences**

In Step 4 section, add note:

```markdown
**偏好应用:** 根据 `user_prefs.content` 调整脚本风格：
- `tone: professional` → 使用正式用语，避免口语化
- `tone: casual` → 轻松口语，可加入语气词
- `verbosity: concise` → 每段 50-80 字
- `verbosity: detailed` → 每段 100-150 字
```

**Step 3: Update Step 8 - Apply TTS preferences**

In Step 8 section, add note:

```markdown
**偏好应用:** 从 `user_prefs.tts` 读取：
- `backend` → 设置 TTS_BACKEND 环境变量
- `rate` → 设置 TTS_RATE 环境变量
- `voice` → 设置 EDGE_TTS_VOICE（如使用 edge 后端）
```

**Step 4: Update Step 9 - Apply visual preferences**

In Step 9 section, add note:

```markdown
**偏好应用:** 从 `user_prefs.visual` 覆盖 `defaultVideoProps`：
- `typography.*` × `scalePreference` → 应用字号缩放
- `theme: dark` → 交换 backgroundColor/textColor
- `primaryColor`, `accentColor` → 直接覆盖
```

**Step 5: Update Step 14 - Add satisfaction feedback**

In Step 14 section, add:

```markdown
### 14.4 满意度反馈

**Claude behavior:** 验证完成后询问：

> "这个视频的整体效果满意吗？"
>
> - **满意** → 记录正向反馈，强化当前偏好
> - **需要调整** → 收集具体反馈，更新偏好

如用户反馈"文字还是有点小"，增加 `scalePreference` 并记录到 `learning_history`。
```

**Step 6: Commit**

```bash
git add SKILL.md
git commit -m "feat: integrate preference application into workflow steps"
```

---

## Task 8: Update CLAUDE.md - Document Preference System

**Files:**
- Modify: `CLAUDE.md` (add new section)

**Step 1: Add Preference System section**

Add after "Environment Variables" section:

```markdown
## User Preference System

Skill learns and applies user preferences automatically.

### Storage

- `user_prefs.json` — learned preferences (auto-created from template)
- `user_prefs.template.json` — default values
- `pref_keywords.json` — NLU keyword mapping
- `prefs_schema.json` — JSON schema definition

### Preference Priority

```
Final = merge(
  Root.tsx defaults < global < topic_patterns[type] < current instructions
)
```

### Commands

| Command | Effect |
|---------|--------|
| "显示偏好设置" | Show current preferences |
| "重置偏好" | Reset to defaults |
| "保存为 X 类默认" | Save to topic_patterns |

### Learning Triggers

- Explicit: "我喜欢深色主题", "语速快一点"
- Implicit: ≥2 same-direction Studio modifications
- Feedback: Post-completion satisfaction survey
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add user preference system documentation"
```

---

## Task 9: Final Verification

**Step 1: Verify all new files exist**

```bash
ls -la prefs_schema.json user_prefs.template.json pref_keywords.json
```

Expected: 3 files listed

**Step 2: Verify JSON validity**

```bash
python3 -c "
import json
for f in ['prefs_schema.json', 'user_prefs.template.json', 'pref_keywords.json']:
    json.load(open(f))
    print(f'✓ {f}')
"
```

Expected:
```
✓ prefs_schema.json
✓ user_prefs.template.json
✓ pref_keywords.json
```

**Step 3: Verify SKILL.md has new sections**

```bash
grep -n "Step 0:" SKILL.md && grep -n "Step 9.5:" SKILL.md && grep -n "Preference Commands" SKILL.md
```

Expected: 3 line numbers showing sections exist

**Step 4: Final commit**

```bash
git add -A
git status
git commit -m "feat: complete user preference self-evolution system"
```

---

## Summary

| Task | Files | Description |
|------|-------|-------------|
| 1 | prefs_schema.json | JSON schema for preferences |
| 2 | user_prefs.template.json | Default preference values |
| 3 | pref_keywords.json | NLU keyword mapping |
| 4 | SKILL.md | Step 0: Load preferences |
| 5 | SKILL.md | Step 9.5: Learn from modifications |
| 6 | SKILL.md | Preference commands section |
| 7 | SKILL.md | Integrate into existing steps |
| 8 | CLAUDE.md | Document preference system |
| 9 | - | Final verification |

**Total: 9 tasks, ~30 minutes estimated**
