# Video Podcast Maker — Troubleshooting & Reference

> **When to load:** Claude loads this file when encountering errors, when user asks about preferences, or when user asks about BGM options.

## Troubleshooting (常见问题)

### TTS: Azure API 密钥错误

**症状**: `Error: Authentication failed`, `HTTP 401 Unauthorized`

**解决方案**:
```bash
# 检查环境变量
echo $AZURE_SPEECH_KEY
echo $AZURE_SPEECH_REGION

# 设置环境变量
export AZURE_SPEECH_KEY="your-key-here"
export AZURE_SPEECH_REGION="eastasia"
```

---

### FFmpeg: BGM 混音问题

**症状**: BGM 音量过大盖住人声，BGM 结尾突然中断

**解决方案**:
```bash
# 基础混音（人声为主，BGM 降低）
ffmpeg -i voice.mp3 -i bgm.mp3 \
  -filter_complex "[0:a]volume=1.0[voice];[1:a]volume=0.15[bgm];[voice][bgm]amix=inputs=2:duration=first" \
  -ac 2 output.mp3

# 带淡入淡出的混音
ffmpeg -i voice.mp3 -i bgm.mp3 \
  -filter_complex "
    [0:a]volume=1.0[voice];
    [1:a]volume=0.15,afade=t=in:st=0:d=2,afade=t=out:st=58:d=2[bgm];
    [voice][bgm]amix=inputs=2:duration=first
  " output.mp3
```

---

### 快速检查清单

**渲染前检查**:
- [ ] 所有素材文件存在
- [ ] timing.json 格式正确
- [ ] 音频时长与 timing 匹配
- [ ] 环境变量已设置
- [ ] 磁盘空间充足 (>20GB for 4K)

**渲染后检查**:
- [ ] 视频时长正确
- [ ] 音画同步
- [ ] 字幕显示正常
- [ ] 无黑屏/空白帧

---

## Background Music Options

### Included Tracks

Available at `~/.claude/skills/video-podcast-maker/assets/`:

| Track | Mood | Best For |
|-------|------|----------|
| `perfect-beauty-191271.mp3` | Upbeat, positive | Tech demos, product intros, tutorials |
| `snow-stevekaldes-piano-397491.mp3` | Calm piano | Reflective topics, analysis, comparisons |

### Using Custom BGM

Users can provide their own BGM:
```bash
# Copy user's BGM file
cp /path/to/my-bgm.mp3 videos/{name}/bgm.mp3
```

If user says "用我自己的BGM" or provides a file path, skip the default BGM copy in Step 11.

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

**Claude behavior:** In auto mode, select the most appropriate included track based on topic type. In interactive mode, ask user to choose.

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
cp ~/.claude/skills/video-podcast-maker/user_prefs.template.json ~/.claude/skills/video-podcast-maker/user_prefs.json
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

## Preference Learning

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

学习到新偏好后，更新 `user_prefs.json` 并添加 `learning_history` 记录：

```json
{
  "date": "2026-03-15",
  "source": "implicit",
  "change": { "path": "global.visual.typography.heroTitle", "from": 80, "to": 96 },
  "context": "用户在 Studio 中连续 3 次调大标题"
}
```
