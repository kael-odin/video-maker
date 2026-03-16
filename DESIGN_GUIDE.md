# Video Podcast Maker — Design Guide

> **When to load:** Claude loads this file when working on Step 9 (Remotion composition) or when the user asks about visual design.

---

## Visual Design Minimums (MUST follow)

以下是防止文字过小、布局过空的**硬约束**（1080p 设计空间）：

| Constraint | Minimum |
|------------|---------|
| **Any text** | ≥ 24px |
| **Hero title** | ≥ 84px |
| **Section title** | ≥ 72px |
| **Card title** | ≥ 40px |
| **Card / body text** | ≥ 32px |
| **Icon size** | ≥ 56px |
| **Section padding** | ≥ 40px |
| **Card padding** | ≥ 40px 48px |
| **Card border-radius** | ≥ 24px |
| **Grid gap** | ≥ 28px |

### Space Utilization (防止大量留白)

| Rule | Requirement |
|------|-------------|
| **Content width** | 卡片/网格应占据 ≥85% 可用宽度 (maxWidth: 1500-1700px) |
| **Vertical centering** | 所有章节必须使用 `justifyContent: 'center'` 垂直居中 |
| **Grid vs Flex** | 多卡片布局优先使用 `grid` 而非 `flex wrap`，确保卡片大小一致 |
| **Card fill** | 卡片应填充可用空间，不要留下大块空白 |

### Visual Richness (视觉丰富度)

| Element | Requirement |
|---------|-------------|
| **Card borders** | 每个卡片必须有彩色边框 (≥3px) 或彩色左边框 (≥6px) |
| **Shadows** | 卡片必须有阴影: `boxShadow: '0 8px 24px rgba(color, 0.15)'` |
| **Color coding** | 并列元素（如多个特性卡片）应使用不同的主题色 |
| **Gradients** | 卡片背景优先使用渐变而非纯色 |
| **Icons** | 每个卡片/要点应有配套图标，图标大小 ≥56px |

---

## Design Philosophy

Templates (`templates/`) are **starting points, not blueprints**. Claude SHOULD customize the visual design for each video based on its topic:

- **Color palette**: match the subject (tech → cool blues/grays, food → warm tones, finance → dark/gold)
- **Section layouts**: create new component arrangements, don't repeat the same layout for every section
- **Visual variety**: vary section backgrounds, card styles, and emphasis techniques across sections to maintain viewer engagement
- **Typography**: adjust sizes and weights to create clear visual hierarchy per section's content density
- **Animations**: use entrance animations and transitions that fit the video's energy and pacing

**What to keep consistent**: Technical Rules above (4K, safe zones, min sizes), component imports from `./components`, and the `timing.json`-driven timing system.

**What to vary freely**: colors, gradients, backgrounds, layout composition, card styles, icon choices, spacing, animation timing, section visual identity.

---

## Quality Checklists (MUST follow)

### Per-Section Checklist

Claude MUST verify each section meets ALL of these before proceeding:

| # | Check | Requirement |
|---|-------|-------------|
| 1 | **Space utilization** | 内容占据 ≥85% 可用宽度，无大块空白区域 |
| 2 | **Visual depth** | 卡片有阴影 + 彩色边框/渐变背景，至少2层视觉层次 |
| 3 | **Color coding** | 并列卡片使用不同主题色（边框、标题、图标） |
| 4 | **Typography scale** | 标题 ≥72px, 卡片标题 ≥40px, 正文 ≥32px, 图标 ≥56px |
| 5 | **Complete animation** | 所有元素有入场动画，列表项有 stagger delay |
| 6 | **Vertical centering** | 使用 `justifyContent: 'center'` 垂直居中 |

### Video-Level Checklist (before render)

| # | Check | Requirement |
|---|-------|-------------|
| 1 | **Layout variety** | ≥3 different layout types across the video (centered, grid, split, timeline, etc.) |
| 2 | **Background alternation** | No 2 consecutive sections share the same background color |
| 3 | **Unified color scheme** | Primary/secondary/accent colors used consistently throughout |
| 4 | **Thumbnail readability** | Title text readable at ~300px thumbnail width |
| 5 | **Hero impact** | Hero section has visual impact: large text + decorative elements or gradient |

### TTS Quality Guidance

| Technique | How |
|-----------|-----|
| **Section pauses** | Add an empty line before each `[SECTION:xxx]` marker in podcast.txt for natural breathing room |
| **Pacing variation** | Slightly slower intro/outro (TTS_RATE="+0%"), normal middle sections (TTS_RATE="+5%") |
| **Key sentence emphasis** | Use SSML `<emphasis>` tags on important sentences (Azure backend supports this) |

---

## Visual Design Reference (recommended)

以下尺寸来自已验证的生产视频，作为推荐参考。Claude 可根据内容需要灵活调整，但不得低于上方 Minimums。

### Typography Scale (1080p design space)

| Element | Recommended Size | Weight | When to Use |
|---------|-----------------|--------|-------------|
| **Hero Title** | 84–96px | 800 | Opening section, brand moment |
| **Section Title** | 72–80px | 700–800 | Each section's main heading |
| **Large Emphasis** | 48–72px | 600–700 | Key statements, conclusions, quotes |
| **Subtitle / Description** | 36–44px | 500–600 | Under section titles, subheadings |
| **Card Title** | 40–48px | 700 | Feature cards, list group headers |
| **Body Text** | 32–40px | 500–600 | Paragraphs, list items, descriptions |
| **Tags / Pills** | 28–36px | 600 | Labels, badges, categories |
| **Icons** | 56–80px | — | Card icons, decorative elements |

### Layout Patterns (recommended)

| Pattern | Recommended |
|---------|-------------|
| **Card** | `borderRadius: 24–32px`, `padding: 48px 56px`, colored border (3px) + shadow |
| **Section Padding** | `40px 60px` content, `40px 80px` hero |
| **Grid Gap** | `28–40px` |
| **Content Max Width** | `1500–1700px` for grids, `1400px` for centered blocks |
| **Hero / Impact** | Full viewport centered with decorative icon, no excessive whitespace |
| **2-column cards** | Use `display: grid; gridTemplateColumns: 1fr 1fr` with gap 36-56px |
| **4+ items** | Use `display: grid; gridTemplateColumns: repeat(4, 1fr)` or `repeat(2, 1fr)` |
| **Workflow/Steps** | Each step has unique color, circular number badge, colored border |

### Color Coding Examples

| Scenario | Approach |
|----------|----------|
| **Feature cards (4个)** | 绿/紫/橙/粉 - 每个卡片不同主题色的边框和标题 |
| **Workflow steps** | 蓝→紫→绿→橙→粉→青 - 渐变色序列 |
| **Intro cards (2个)** | 绿色系 vs 紫色系 - 对比色搭配 |
| **Outro buttons** | 红/橙/黄/粉 - 每个动作独立配色 |

> **Principle:** 这些是经过验证的参考值。关键是**填满空间、放大元素、丰富配色**，不要留下大块空白。
