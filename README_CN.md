# Video Podcast Maker

基于AI语音合成和Remotion的自动化视频播客生成工具。

## 功能特性

- **AI语音合成**: 支持Edge TTS（微软Azure神经语音），高质量中文语音
- **Remotion集成**: 使用React组件创建4K视频
- **可视化编辑**: 在Remotion Studio中实时调整样式
- **多格式支持**: 支持横屏（16:9）和竖屏（9:16）视频
- **自动字幕**: 自动生成SRT字幕文件
- **缩略图生成**: 为多个平台生成封面图

## 快速开始

### 环境要求

- Node.js >= 18
- Python >= 3.8
- FFmpeg（用于音频处理）

### 安装

```bash
# 安装Node.js依赖
npm install

# 安装Python依赖
pip install -r requirements.txt

# 升级edge-tts到最新版本
pip install --upgrade edge-tts
```

### 创建第一个视频

#### 步骤1: 准备内容

在`projects/`目录下创建新项目：

```bash
mkdir projects/my-video
```

创建`podcast.txt`文件，写入内容：

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

# 使用Edge TTS生成音频
python generate_tts.py `
  --input projects/my-video/podcast.txt `
  --output-dir projects/my-video `
  --backend edge
```

这将生成：
- `podcast_audio.wav` - 音频文件
- `podcast_audio.srt` - 字幕文件
- `timing.json` - 时间轴数据

#### 步骤3: 预览视频

```bash
# 启动Remotion Studio
npx remotion studio src/remotion/index.ts --public-dir projects/my-video/
```

打开 http://localhost:3000，你可以：
- 实时预览视频
- 在右侧面板调整样式（颜色、字体、动画）
- 测试不同分辨率（4K/竖屏）

#### 步骤4: 渲染视频

```bash
# 渲染4K横屏视频
npx remotion render src/remotion/index.ts MyVideo out/video-4k.mp4 `
  --public-dir projects/my-video/ `
  --codec h264 `
  --quality 100 `
  --crf 18

# 渲染竖屏视频（用于短视频）
npx remotion render src/remotion/index.ts MyVideoVertical out/video-vertical.mp4 `
  --public-dir projects/my-video/ `
  --codec h264 `
  --quality 100
```

#### 步骤5: 生成缩略图

```bash
# YouTube/B站封面（16:9）
npx remotion render src/remotion/index.ts Thumbnail16x9 out/thumbnail-16x9.png `
  --public-dir projects/my-video/

# 小红书封面（3:4）
npx remotion render src/remotion/index.ts Thumbnail3x4 out/thumbnail-3x4.png `
  --public-dir projects/my-video/
```

## 项目结构

```
video-podcast-maker/
├── src/remotion/              # Remotion视频项目
│   ├── index.ts              # 入口文件
│   ├── Root.tsx              # 根组件（可编辑属性）
│   ├── Video.tsx             # 视频组件
│   ├── Thumbnail.tsx         # 缩略图组件
│   └── components/           # 可复用组件库
├── projects/                  # 你的视频项目
│   └── how-to-learn-programming/
│       ├── podcast.txt       # 文案
│       ├── podcast_audio.wav # 生成的音频
│       ├── podcast_audio.srt # 生成的字幕
│       └── timing.json       # 生成的时间轴
├── tts/                       # TTS后端
│   └── backends/
│       └── edge.py           # Edge TTS实现
├── templates/                 # 项目模板
├── remotion.config.ts        # Remotion配置
├── package.json              # Node.js依赖
└── requirements.txt          # Python依赖
```

## 自定义视频

### 可编辑属性（在Remotion Studio中）

打开Remotion Studio，使用右侧面板调整：

#### 颜色设置
- `primaryColor` - 主色调（标题、强调元素）
- `backgroundColor` - 背景色
- `textColor` - 文字颜色
- `accentColor` - 强调色（CTA、高亮）

#### 字体设置
- `titleSize` - 标题字号
- `subtitleSize` - 副标题字号
- `bodySize` - 正文字号

#### 进度条设置
- `showProgressBar` - 显示/隐藏进度条
- `progressBarHeight` - 进度条高度
- `progressFontSize` - 进度条文字大小

#### 音频设置
- `bgmVolume` - 背景音乐音量（0-0.3）

#### 动画设置
- `enableAnimations` - 启用入场动画
- `transitionType` - 章节转场效果（fade/slide/wipe/none）
- `transitionDuration` - 转场时长（帧数）

### 自定义章节内容

编辑`src/remotion/Video.tsx`来自定义每个章节：

```typescript
case "hero":
  return (
    <FullBleedLayout bg={props.backgroundColor}>
      <h1>你的自定义标题</h1>
      <p>你的自定义副标题</p>
    </FullBleedLayout>
  );
```

## TTS配置

### Edge TTS（推荐）

**优势**：
- 高质量中文语音
- 免费使用
- 生成速度快

**代理配置**（如需要）：
```bash
# PowerShell
$env:HTTP_PROXY='http://127.0.0.1:7899'
$env:HTTPS_PROXY='http://127.0.0.1:7899'

# Bash/Linux
export HTTP_PROXY='http://127.0.0.1:7899'
export HTTPS_PROXY='http://127.0.0.1:7899'
```

**故障排除**：
- 如果遇到403错误，升级edge-tts：`pip install --upgrade edge-tts`
- WebSocket连接问题，使用系统代理模式而非TUN模式
- 推荐节点：台湾、香港、日本、新加坡

## 示例项目

查看`projects/how-to-learn-programming/`完整示例：

- **主题**：如何高效学习编程
- **时长**：4分23秒
- **章节**：5个章节
- **音频**：使用Edge TTS生成
- **状态**：已就绪，可预览和渲染

## 输出格式

### 视频
- **4K横屏**：3840x2160（YouTube、B站）
- **竖屏**：2160x3840（短视频、抖音）

### 缩略图
- **16:9**：1920x1080（YouTube、B站封面）
- **4:3**：1200x900（B站推荐流）
- **3:4**：1080x1440（小红书）
- **9:16**：1080x1920（短视频封面）

## 技术栈

- **TTS引擎**：Edge TTS 7.2.8（微软Azure神经语音）
- **视频框架**：Remotion 4.0（基于React）
- **音频处理**：FFmpeg 8.1
- **编程语言**：TypeScript, Python

## 常见问题

### FFmpeg未找到
```bash
# Windows: 刷新PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 或通过winget安装
winget install --id Gyan.FFmpeg -e
```

### Remotion Studio无法启动
```bash
# 重新安装依赖
npm install

# 检查Node.js版本（需要 >= 18）
node --version
```

### 音频生成失败
1. 检查代理设置
2. 升级edge-tts：`pip install --upgrade edge-tts`
3. 尝试不同的代理节点
4. 检查PowerShell编码：`$env:PYTHONIOENCODING='utf-8'`

## 贡献

欢迎贡献代码！请随时提交Pull Request。

## 许可证

MIT许可证 - 详见[LICENSE](LICENSE)文件。

## 作者

- **kael-odin**
- 邮箱：kael@thordata.com
- GitHub：https://github.com/kael-odin/video-maker

## 致谢

- [Remotion](https://www.remotion.dev/) - 基于React的视频创建框架
- [Edge TTS](https://github.com/rany2/edge-tts) - 微软Edge的TTS API
- [FFmpeg](https://ffmpeg.org/) - 音视频处理工具
