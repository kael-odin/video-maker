# Video Podcast Maker 🎬

<div align="center">

**AI驱动的专业视频生成工具 | 免费TTS + Remotion + Vibe-Motion动画**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-%3E%3D3.8-blue.svg)](https://www.python.org/)

[English](README_EN.md) | 简体中文

</div>

---

## 📖 目录

- [✨ 特性](#-特性)
- [🎯 快速开始](#-快速开始)
- [🤖 AI辅助创作流程](#-ai辅助创作流程)
- [🎬 示例项目](#-示例项目)
- [🎨 Vibe-Motion动画集成](#-vibe-motion动画集成)
- [🎙️ TTS引擎选择](#️-tts引擎选择)
- [📁 项目结构](#-项目结构)
- [🔧 故障排除](#-故障排除)
- [🚀 进阶工具推荐](#-进阶工具推荐)

---

## ✨ 特性

- 🎙️ **AI语音合成** - 支持Edge TTS（免费）和多种付费TTS引擎
- 🎬 **Remotion视频框架** - 使用React组件创建专业视频
- 🎨 **Vibe-Motion动画** - AI驱动的专业动画效果
- 🤖 **AI辅助创作** - 从文案到视频的完整AI工作流
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

# 升级edge-tts到最新版本（重要！）
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
npx remotion render MyVideo out/video.mp4 `
  --public-dir projects/my-video/ `
  --codec h264 `
  --quality 70
```

#### 步骤4: 预览和调整

```bash
# 启动Remotion Studio
npx remotion studio --public-dir projects/my-video/
```

在浏览器中打开 http://localhost:3000，实时调整：
- 颜色（主色调、背景色、文字颜色）
- 字体大小
- 动画效果
- 转场效果

---

## 🤖 AI辅助创作流程

### 完整工作流程（推荐）

我们提供了一套完整的AI辅助创作流程，帮助你从零开始创建专业视频：

#### 第一步：AI生成文案

使用AI助手（如Claude、ChatGPT）生成视频脚本：

**提示词模板：**

```
请帮我创建一个关于[主题]的视频脚本，要求：
1. 时长：3-5分钟
2. 风格：专业、引人入胜
3. 结构：
   - 开场（吸引注意力）
   - 核心内容（3-5个要点）
   - 总结与号召
4. 每个章节使用 [SECTION:name] 标记
5. 语言：中文

示例格式：
[SECTION:hero]
开场白...

[SECTION:point1]
第一个要点...

[SECTION:point2]
第二个要点...
```

**示例：科技巨头的故事**

```
[SECTION:hero]
想象一下，如果马斯克、乔布斯、比尔盖茨同时出现在一个房间里
他们会聊些什么？
今天，我要带你穿越时空，见证一场改变世界的对话
三位科技巨头，三段传奇人生，一个共同的主题：创新

[SECTION:musk-story]
埃隆·马斯克，现实版的钢铁侠
从PayPal到特斯拉，从SpaceX到Neuralink
他的人生就像一部科幻电影
2008年，SpaceX连续三次火箭发射失败，濒临破产
但他没有放弃，第四次成功了
现在，SpaceX已经成为全球唯一能回收火箭的公司
马斯克说："当一件事足够重要，即使胜算不大，你也要去做"
这就是改变世界的勇气

[SECTION:jobs-story]
史蒂夫·乔布斯，苹果的灵魂人物
被自己创办的公司开除，却从未停止创新
1997年回归苹果时，公司距离破产只有90天
他砍掉70%的产品线，专注做最好的产品
iPod、iPhone、iPad，每一个都重新定义了行业
乔布斯说："活着就是为了改变世界，难道还有其他原因吗？"
这就是极致的追求

[SECTION:gates-story]
比尔·盖茨，从程序员到世界首富
13岁开始编程，20岁创办微软
Windows系统让电脑走进千家万户
但真正让他伟大的，不是财富，而是慈善
2008年，他全职投入盖茨基金会
致力于消除贫困、改善教育、研发疫苗
盖茨说："如果你生而贫穷，那不是你的错。但如果你死时贫穷，那就是你的错。"
这就是责任与担当

[SECTION:innovation]
三位巨头，三种创新模式
马斯克：颠覆式创新，挑战不可能
乔布斯：设计驱动，追求极致体验
盖茨：技术普及，让每个人受益
他们的共同点？
永不满足现状，永远追求卓越
敢于打破规则，勇于承担风险
最重要的是，他们都相信技术可以改变世界

[SECTION:lesson]
从他们身上，我们学到什么？
第一，失败不是终点，而是起点
马斯克三次失败，乔布斯被开除，盖茨的早期产品也很糟糕
但他们都从失败中学习，变得更强大
第二，专注比什么都重要
乔布斯砍掉70%产品，马斯克只做几件事
专注让你成为领域专家，而不是平庸的全才
第三，要有更大的愿景
不要只想着赚钱，要想着如何改变世界
当你解决了真正的问题，财富自然会来

[SECTION:call-to-action]
现在，轮到你了
你不需要成为下一个马斯克或乔布斯
但你可以在自己的领域，做出改变
也许是一个创新的产品，也许是一个改进的流程
也许只是一个更好的自己
记住，每个伟大的创新，都始于一个小小的想法
你的想法，可能就是下一个改变世界的起点

[SECTION:outro]
感谢观看
如果这个视频激励了你，请点赞收藏关注
评论区告诉我，你最想学习哪位科技巨头的品质
下期我们将深入探讨如何培养创新思维
我们下期再见
```

#### 第二步：生成音频

```bash
# 使用Edge TTS生成音频
python generate_tts.py `
  --input projects/tech-revolution/podcast.txt `
  --output-dir projects/tech-revolution `
  --backend edge
```

#### 第三步：创建视频组件

使用AI助手生成Remotion视频组件：

**提示词模板：**

```
请帮我创建一个Remotion视频组件，要求：
1. 主题：[你的主题]
2. 风格：专业、现代、动画丰富
3. 章节：[列出你的章节]
4. 特效：
   - 粒子背景动画
   - 渐变光球效果
   - 平滑入场动画
   - 数据可视化卡片
5. 颜色方案：深色主题，蓝色/紫色/绿色渐变
```

#### 第四步：渲染视频

```bash
# 复制音频文件到public目录
Copy-Item -Path projects\tech-revolution\podcast_audio.wav -Destination public\
Copy-Item -Path projects\tech-revolution\podcast_audio.srt -Destination public\
Copy-Item -Path projects\tech-revolution\timing.json -Destination public\

# 渲染视频
npx remotion render MyVideo out/tech-revolution.mp4 --public-dir public
```

---

## 🎬 示例项目

### 项目1：科技巨头的故事

**路径**: `projects/tech-revolution/`

**主题**: 马斯克、乔布斯、盖茨的创新故事

**特点**:
- ✨ Vibe-Motion风格动画
- 🎭 故事卡片布局
- 📊 数据可视化展示
- 🌈 动态渐变背景
- 🎯 粒子动画效果

**视频信息**:
- 📹 文件: `out/tech-revolution.mp4`
- 📏 大小: 27.2 MB
- 🎬 分辨率: 1080p (1920x1080)
- ⏱️ 时长: 3分33秒
- 🎙️ TTS: Edge TTS（免费）

**章节结构**:
1. **Hero** (18秒) - 开场引入
2. **Musk Story** (32秒) - 马斯克的故事
3. **Jobs Story** (29秒) - 乔布斯的故事
4. **Gates Story** (32秒) - 盖茨的故事
5. **Innovation** (26秒) - 创新模式对比
6. **Lesson** (37秒) - 课程学习
7. **Call to Action** (24秒) - 行动号召
8. **Outro** (16秒) - 结尾

**查看示例**:
```bash
# 查看脚本
cat projects/tech-revolution/podcast.txt

# 查看时间轴
cat projects/tech-revolution/timing.json

# 播放视频
start out/tech-revolution.mp4
```

---

## 🎨 Vibe-Motion动画集成

### 什么是Vibe-Motion？

[Vibe-Motion](https://github.com/vibe-motion/skills) 是一个AI驱动的动画设计工具，可以：
- 🎨 自动生成专业动画效果
- 🚀 无需After Effects
- ⚡ 实时参数控制
- 🎯 文本到动画的转换

### 安装Vibe-Motion Skills

```bash
# 安装vibe-motion skills
npx skills add vibe-motion/skills
```

**提示**: 这是一个交互式安装脚本，用空格选择要安装的skills，建议全部安装。另外别忘了选择对应的智能体（例如Claude Code）。

### 使用Vibe-Motion创建动画

#### 方法1: 使用内置动画组件

我们的项目已经集成了Vibe-Motion风格的动画组件：

```typescript
// 使用粒子背景
<ParticleField count={50} color={props.primaryColor} />

// 使用渐变光球
<GradientOrb 
  color1="#4f6ef7" 
  color2="#8b5cf6" 
  size={400} 
  x="20%" 
  y="30%" 
  delay={0} 
/>

// 使用平滑入场动画
const { opacity, translateY, scale } = useSmoothEntrance(0);
```

#### 方法2: 自定义动画

创建你自己的动画组件：

```typescript
// src/remotion/components/MyAnimation.tsx
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const MyAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 100], [0, 360]);
  
  return (
    <div style={{
      transform: `rotate(${rotation}deg)`,
      width: 100,
      height: 100,
      background: "linear-gradient(45deg, #4f6ef7, #8b5cf6)",
    }} />
  );
};
```

### Vibe-Motion资源

- 📚 [官方文档](https://www.vibemotion.net/)
- 🎬 [视频教程](https://www.bilibili.com/video/BV1GP9TBGEM1/)
- 💻 [GitHub仓库](https://github.com/vibe-motion/skills)
- 🎨 [我的Fork](https://github.com/kael-odin/vibe-motion-skills)

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
export AZURE_TTS_KEY='your-key'
export AZURE_TTS_REGION='your-region'

python generate_tts.py --input projects/my-video/podcast.txt --output-dir projects/my-video --backend azure
```

#### 3. Google Cloud TTS

**价格**：
- 标准语音：$4/100万字符
- WaveNet：$16/100万字符
- 免费额度：100万字符/月

#### 4. Amazon Polly

**价格**：
- 标准语音：$4/100万字符
- 神经语音：$16/100万字符
- 免费额度：500万字符/月（12个月）

#### 5. ElevenLabs

**优势**：
- 最自然的AI语音
- 声音克隆

**价格**：
- Starter: $5/月（30,000字符）
- Creator: $22/月（100,000字符）
- 免费试用：10,000字符

---

### TTS引擎对比

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

## 📁 项目结构

```
video-podcast-maker/
├── src/remotion/              # Remotion视频项目
│   ├── index.ts              # 入口文件
│   ├── Root.tsx              # 根组件
│   ├── Video.tsx             # 视频组件
│   ├── TechRevolutionVideo.tsx # 科技巨头视频组件
│   ├── Thumbnail.tsx         # 缩略图组件
│   └── components/           # 可复用组件库
│       ├── layouts.tsx       # 布局组件
│       ├── animations.tsx    # 动画组件
│       └── icons.tsx         # 图标组件
├── projects/                  # 视频项目
│   └── tech-revolution/      # 科技巨头示例
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
├── out/                       # 输出目录
│   └── tech-revolution.mp4   # 示例视频
├── render.ps1                 # Windows渲染脚本
├── render.sh                  # Linux/Mac渲染脚本
├── README.md                  # 中文文档
├── README_EN.md               # 英文文档
├── package.json              # Node.js依赖
└── requirements.txt          # Python依赖
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

#### 5. Section名称解析错误
确保section名称使用连字符（如 `musk-story`）而非下划线或其他字符。

---

## 🚀 进阶工具推荐

### 📚 精选 Skills 推荐

我们为你精选了最优质的 Skills，帮助你提升视频创作体验。详见 [SKILLS.md](SKILLS.md)。

#### 必装 Skills

**1. Remotion Official Skills** ⭐⭐⭐⭐⭐

官方推荐，必装！

```bash
npx skills add remotion-dev/skills
```

**包含功能**:
- 🎨 动画技巧（插值、缓动、弹簧）
- 🎬 序列编排（延迟、修剪、限制）
- 🖼️ 媒体处理（图像、视频、音频）
- 📊 图表可视化
- 🗺️ 地图动画（Mapbox）
- 📝 字幕显示与导入
- 🎭 Lottie动画

**2. Vibe-Motion Skills** ⭐⭐⭐⭐⭐

AI驱动，强烈推荐！

```bash
npx skills add vibe-motion/skills
```

**特点**:
- 🎨 AI自动生成专业动画
- 🚀 无需After Effects
- ⚡ 实时参数控制
- 🎯 文本到动画转换

**资源**:
- [官方文档](https://www.vibemotion.net/)
- [GitHub](https://github.com/vibe-motion/skills)
- [我的Fork](https://github.com/kael-odin/vibe-motion-skills)

#### Skills 市场

**3. SkillsMP** ⭐⭐⭐⭐⭐

最大的 Skills 市场！

**网站**: https://skillsmp.com/zh

**统计**:
- 📦 175,906+ 个工具技能
- 📊 75,013+ 个数据与AI技能
- 🎬 46,342+ 个内容与媒体技能

**4. Claudate**

Claude Skills 专业市场

**网站**: https://claudate.com/zh/

**统计**:
- 📦 150,000+ Claude Skills
- 🎯 AI、开发、创作一站式平台

#### 其他优质 Skills

**5. Claude Skills Collection**

综合技能包

```bash
npx skills add alirezarezvani/claude-skills
```

**包含**:
- 🔧 233+ 个技能
- 🎯 工程、产品、营销等领域
- 📦 生产就绪的代码模板

**6. Remotion 最佳实践库**

社区维护的实用技能库

**GitHub**: https://github.com/buainoai/remotion-skills

**包含**:
- 🎨 核心概念（动画、组合、时序）
- 📹 媒体处理（图像、视频、音频）
- 🔧 高级功能（3D、字幕、图表）
- ⚙️ 配置优化（参数化、转场）

---

### 🛠️ 其他推荐工具

#### Remotion

**React视频框架**

- 🎬 使用React创建视频
- 🎨 可视化编辑
- 📱 多格式支持

**资源**：
- [官方文档](https://www.remotion.dev/)
- [GitHub](https://github.com/remotion-dev/remotion)

#### FFmpeg

**音视频处理工具**

- 🎵 音频转换
- 🎬 视频编码
- 📝 字幕处理

**资源**：
- [官方网站](https://ffmpeg.org/)
- [Windows下载](https://www.gyan.dev/ffmpeg/builds/)

#### Higgsfield

**AI视频生成平台**

- 🎨 信息图表动画
- 📊 文本动画
- 🎬 海报动效

**网站**: https://higgsfield.ai/vibe-motion

#### Neon Vibe Motion

**开源AI动效工具**

- 🔓 完全开源
- 🎨 实时控制
- 🚀 快速生成

**GitHub**: https://github.com/S1mpleSonny/neon-vibe-motion

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
- [Vibe-Motion](https://github.com/vibe-motion/skills) - AI动画设计
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
