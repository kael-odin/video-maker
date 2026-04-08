# Video Podcast Maker 🎬

<div align="center">

**一键生成专业视频播客 | AI语音合成 + Remotion视频框架**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-%3E%3D3.8-blue.svg)](https://www.python.org/)

[English](README_EN.md) | 简体中文

</div>

---

## ✨ 特性

- 🎙️ **AI语音合成** - 支持Edge TTS（免费）和多种付费TTS引擎
- 🎬 **Remotion视频框架** - 使用React组件创建专业视频
- 🎨 **可视化编辑** - 在Remotion Studio中实时调整样式
- 📱 **多格式支持** - 横屏（16:9）、竖屏（9:16）、多平台缩略图
- 📝 **自动字幕** - 自动生成SRT字幕文件
- 🚀 **开箱即用** - 完整示例项目，快速上手

---

## 🎯 快速开始

### 环境要求

- **Node.js** >= 18
- **Python** >= 3.8
- **FFmpeg**（用于音频处理）

### 安装

```bash
# 克隆仓库
git clone https://github.com/kael-odin/video-maker.git
cd video-maker

# 安装Node.js依赖
npm install

# 安装Python依赖
pip install -r requirements.txt

# 升级edge-tts到最新版本
pip install --upgrade edge-tts
```

### 创建第一个视频

#### 步骤1: 准备内容

在 `projects/` 目录下创建新项目：

```bash
mkdir projects/my-video
```

创建 `podcast.txt` 文件：

```
[SECTION:hero]
你的开场白...

[SECTION:main]
主要内容...

[SECTION:summary]
总结...

[SECTION:outro]
结尾号召...
```

#### 步骤2: 生成音频

```bash
# 设置代理（如果需要）
$env:HTTP_PROXY='http://127.0.0.1:7899'
$env:HTTPS_PROXY='http://127.0.0.1:7899'

# 使用Edge TTS生成音频（免费）
python generate_tts.py `
  --input projects/my-video/podcast.txt `
  --output-dir projects/my-video `
  --backend edge
```

这将生成：
- `podcast_audio.wav` - 音频文件
- `podcast_audio.srt` - 字幕文件
- `timing.json` - 时间轴数据

#### 步骤3: 渲染视频

**选项A: 使用渲染脚本（推荐）**

```bash
# Windows
.\render.ps1 preview   # 快速预览（1-2分钟）
.\render.ps1 standard # 标准质量（5-10分钟）
.\render.ps1 high     # 高质量（15-30分钟）

# Linux/Mac
chmod +x render.sh
./render.sh preview
```

**选项B: 手动渲染**

```bash
# 渲染1080p视频
npx remotion render src/remotion/index.ts MyVideo out/video.mp4 `
  --public-dir projects/my-video/ `
  --codec h264 `
  --quality 70
```

#### 步骤4: 预览和调整

```bash
# 启动Remotion Studio
npx remotion studio src/remotion/index.ts --public-dir projects/my-video/
```

在浏览器中打开 http://localhost:3000，实时调整：
- 颜色（主色调、背景色、文字颜色）
- 字体大小
- 动画效果
- 转场效果

---

## 🎙️ TTS引擎选择

### 免费选项

#### 1. Edge TTS（推荐）✨

**优势**：
- ✅ 完全免费
- ✅ 高质量中文语音
- ✅ 生成速度快
- ✅ 无使用限制

**使用方法**：
```bash
python generate_tts.py --input projects/my-video/podcast.txt --output-dir projects/my-video --backend edge
```

**代理配置**（如需要）：
```bash
# Windows PowerShell
$env:HTTP_PROXY='http://127.0.0.1:7899'
$env:HTTPS_PROXY='http://127.0.0.1:7899'

# Linux/Mac
export HTTP_PROXY='http://127.0.0.1:7899'
export HTTPS_PROXY='http://127.0.0.1:7899'
```

**故障排除**：
- **403错误**：升级edge-tts → `pip install --upgrade edge-tts`
- **WebSocket问题**：使用系统代理模式而非TUN模式
- **推荐节点**：台湾、香港、日本、新加坡

---

### 付费选项（更高质量）

#### 2. Azure Cognitive Services

**优势**：
- 更自然的语音
- 更多声音选择
- SSML支持

**价格**：
- 标准语音：$4/100万字符
- 神经语音：$16/100万字符
- 免费额度：50万字符/月

**配置**：
```bash
# 设置环境变量
export AZURE_TTS_KEY='your-key'
export AZURE_TTS_REGION='your-region'

# 生成音频
python generate_tts.py --input projects/my-video/podcast.txt --output-dir projects/my-video --backend azure
```

#### 3. Google Cloud TTS

**优势**：
- WaveNet高质量语音
- 多语言支持
- 自定义声音

**价格**：
- 标准语音：$4/100万字符
- WaveNet：$16/100万字符
- 免费额度：100万字符/月

**配置**：
```bash
export GOOGLE_APPLICATION_CREDENTIALS='path/to/credentials.json'

python generate_tts.py --input projects/my-video/podcast.txt --output-dir projects/my-video --backend google
```

#### 4. Amazon Polly

**优势**：
- 神经语音
- 实时流式传输
- SSML支持

**价格**：
- 标准语音：$4/100万字符
- 神经语音：$16/100万字符
- 免费额度：500万字符/月（12个月）

**配置**：
```bash
export AWS_ACCESS_KEY_ID='your-key'
export AWS_SECRET_ACCESS_KEY='your-secret'
export AWS_DEFAULT_REGION='us-east-1'

python generate_tts.py --input projects/my-video/podcast.txt --output-dir projects/my-video --backend aws
```

#### 5. ElevenLabs

**优势**：
- 最自然的AI语音
- 声音克隆
- 多语言支持

**价格**：
- Starter: $5/月（30,000字符）
- Creator: $22/月（100,000字符）
- 免费试用：10,000字符

**配置**：
```bash
export ELEVENLABS_API_KEY='your-key'

python generate_tts.py --input projects/my-video/podcast.txt --output-dir projects/my-video --backend elevenlabs
```

---

## 📊 TTS引擎对比

| TTS引擎 | 价格 | 质量 | 速度 | 中文支持 | 推荐场景 |
|---------|------|------|------|---------|---------|
| Edge TTS | 免费 | ⭐⭐⭐⭐ | 快 | ✅ 优秀 | 个人项目、测试 |
| Azure | $16/100万 | ⭐⭐⭐⭐⭐ | 快 | ✅ 优秀 | 商业项目 |
| Google | $16/100万 | ⭐⭐⭐⭐⭐ | 快 | ✅ 优秀 | 商业项目 |
| Amazon | $16/100万 | ⭐⭐⭐⭐ | 快 | ✅ 良好 | 商业项目 |
| ElevenLabs | $5-22/月 | ⭐⭐⭐⭐⭐ | 中 | ✅ 优秀 | 高质量需求 |

**推荐**：
- 🆓 **免费使用**：Edge TTS
- 💰 **商业项目**：Azure或Google
- 🎯 **最高质量**：ElevenLabs

---

## 🎨 自定义视频

### 可编辑属性

在Remotion Studio中实时调整：

#### 颜色设置
- `primaryColor` - 主色调（默认: `#4f6ef7`）
- `backgroundColor` - 背景色（默认: `#ffffff`）
- `textColor` - 文字颜色（默认: `#1a1a1a`）
- `accentColor` - 强调色（默认: `#FF6B6B`）

#### 字体设置
- `titleSize` - 标题字号（默认: 80）
- `subtitleSize` - 副标题字号（默认: 40）
- `bodySize` - 正文字号（默认: 28）

#### 进度条设置
- `showProgressBar` - 显示进度条（默认: true）
- `progressBarHeight` - 进度条高度（默认: 130）

#### 动画设置
- `enableAnimations` - 启用动画（默认: true）
- `transitionType` - 转场效果（fade/slide/wipe/none）
- `transitionDuration` - 转场时长（默认: 15帧）

### 自定义章节内容

编辑 `src/remotion/Video.tsx`：

```typescript
case "hero":
  return (
    <FullBleedLayout bg={props.backgroundColor}>
      <h1>你的自定义标题</h1>
      <p>你的自定义副标题</p>
    </FullBleedLayout>
  );
```

---

## 📁 项目结构

```
video-podcast-maker/
├── src/remotion/              # Remotion视频项目
│   ├── index.ts              # 入口文件
│   ├── Root.tsx              # 根组件
│   ├── Video.tsx             # 视频组件
│   ├── Thumbnail.tsx         # 缩略图组件
│   └── components/           # 可复用组件库
├── projects/                  # 视频项目
│   └── how-to-learn-programming/
│       ├── podcast.txt       # 文案
│       ├── podcast_audio.wav # 音频
│       ├── podcast_audio.srt # 字幕
│       └── timing.json       # 时间轴
├── tts/                       # TTS后端
│   └── backends/
│       ├── edge.py           # Edge TTS
│       ├── azure.py          # Azure TTS
│       ├── google.py         # Google TTS
│       ├── aws.py            # Amazon Polly
│       └── elevenlabs.py     # ElevenLabs
├── render.ps1                 # Windows渲染脚本
├── render.sh                  # Linux/Mac渲染脚本
├── README.md                  # 中文文档
├── README_EN.md               # 英文文档
├── package.json              # Node.js依赖
└── requirements.txt          # Python依赖
```

---

## 📤 输出格式

### 视频
- **1080p横屏**：1920x1080（YouTube、B站）
- **竖屏**：1080x1920（短视频、抖音）

### 缩略图
- **16:9**：1920x1080（YouTube、B站封面）
- **4:3**：1200x900（B站推荐流）
- **3:4**：1080x1440（小红书）
- **9:16**：1080x1920（短视频封面）

---

## 🎬 示例项目

查看 `projects/how-to-learn-programming/` 完整示例：

- **主题**：如何高效学习编程
- **时长**：4分23秒
- **章节**：5个章节
- **音频**：Edge TTS生成
- **视频**：已渲染完成（16.2 MB）

**渲染时间**：
- Preview质量：1-2分钟
- Standard质量：5-10分钟
- High质量：15-30分钟

---

## ⚙️ 高级配置

### 添加背景音乐

1. 将音乐文件放入项目目录：`projects/my-video/bgm.mp3`
2. 修改 `src/remotion/Root.tsx`：

```typescript
bgmVolume: 0.05,  // 背景音乐音量（0-0.3）
```

### 自定义分辨率

编辑 `src/remotion/Root.tsx`：

```typescript
<Composition
  id={VIDEO_ID}
  width={3840}   // 宽度
  height={2160}  // 高度
  fps={30}       // 帧率
/>
```

### 添加自定义组件

在 `src/remotion/components/` 创建新组件：

```typescript
// MyCustomCard.tsx
export const MyCustomCard = ({ title, description }) => (
  <div style={{ padding: 20 }}>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);
```

---

## 🔧 故障排除

### 常见问题

#### 1. Edge TTS 403错误
```bash
# 升级edge-tts
pip install --upgrade edge-tts
```

#### 2. FFmpeg未找到
```bash
# Windows
winget install --id Gyan.FFmpeg -e

# 刷新PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

#### 3. 内存不足
- 关闭其他应用程序
- 降低渲染质量
- 渲染较短片段测试

#### 4. Remotion Studio无法启动
```bash
# 重新安装依赖
npm install

# 检查Node.js版本
node --version  # 需要 >= 18
```

---

## 📊 性能优化

### 渲染速度

| 分辨率 | 质量 | 预计时间 | 文件大小 |
|--------|------|---------|---------|
| 1080p | 60 | 3-5分钟 | ~50MB |
| 1080p | 70 | 5-10分钟 | ~100MB |
| 1080p | 85 | 10-15分钟 | ~150MB |

### 优化建议

1. **预览先行**：先用低质量预览，满意后再高质量渲染
2. **关闭应用**：渲染时关闭其他应用释放内存
3. **使用代理**：Edge TTS建议使用代理加速连接

---

## 🤝 贡献

欢迎贡献代码！请提交Pull Request。

### 开发指南

```bash
# 克隆仓库
git clone https://github.com/kael-odin/video-maker.git

# 安装依赖
npm install
pip install -r requirements.txt

# 创建分支
git checkout -b feature/your-feature

# 提交更改
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 👥 作者

**kael-odin**
- Email: kael@thordata.com
- GitHub: https://github.com/kael-odin/video-maker

---

## 🙏 致谢

- [Remotion](https://www.remotion.dev/) - React视频框架
- [Edge TTS](https://github.com/rany2/edge-tts) - 微软Edge TTS API
- [FFmpeg](https://ffmpeg.org/) - 音视频处理
- [Lucide](https://lucide.dev/) - 图标库

---

## 📈 项目状态

![GitHub stars](https://img.shields.io/github/stars/kael-odin/video-maker?style=social)
![GitHub forks](https://img.shields.io/github/forks/kael-odin/video-maker?style=social)
![GitHub issues](https://img.shields.io/github/issues/kael-odin/video-maker)

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ by kael-odin

</div>
