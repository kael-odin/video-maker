# 🎯 精选 Skills 推荐

本文档列出了与视频制作、动画设计、AI创作相关的优质 Skills，帮助你提升视频创作体验。

---

## 📚 目录

- [视频制作 Skills](#-视频制作-skills)
- [动画设计 Skills](#-动画设计-skills)
- [AI 辅助创作 Skills](#-ai-辅助创作-skills)
- [开发工具 Skills](#-开发工具-skills)
- [设计资源 Skills](#-设计资源-skills)

---

## 🎬 视频制作 Skills

### 1. Remotion Official Skills ⭐⭐⭐⭐⭐

**官方推荐** | **必装**

**仓库**: [remotion-dev/skills](https://github.com/remotion-dev/remotion/tree/main/packages/skills)

**功能**:
- ✅ Remotion 项目最佳实践
- ✅ 动画、时序控制、媒体处理
- ✅ 3D内容、字幕、图表可视化
- ✅ 视频处理工具集

**安装**:
```bash
npx skills add remotion-dev/skills
```

**包含技能**:
- 🎨 动画技巧（插值、缓动、弹簧）
- 🎬 序列编排（延迟、修剪、限制）
- 🖼️ 图像处理（Img组件）
- 🎥 视频处理（修剪、音量、速度）
- 🎵 音频处理（导入、修剪、音调）
- 📊 图表可视化
- 🗺️ 地图动画（Mapbox）
- 📝 字幕显示与导入
- 🎭 Lottie动画
- 🔤 字体加载与文本动画

---

### 2. Vibe-Motion Skills ⭐⭐⭐⭐⭐

**AI驱动** | **强烈推荐**

**仓库**: [vibe-motion/skills](https://github.com/vibe-motion/skills)

**我的 Fork**: [kael-odin/vibe-motion-skills](https://github.com/kael-odin/vibe-motion-skills)

**功能**:
- ✅ AI 自动生成专业动画
- ✅ 无需 After Effects
- ✅ 实时参数控制
- ✅ 文本到动画转换

**安装**:
```bash
npx skills add vibe-motion/skills
```

**特点**:
- 🎨 自动生成动态效果
- ⚡ 快速迭代设计
- 🎯 专业级动画质量
- 🔄 实时预览调整

**资源**:
- [官方文档](https://www.vibemotion.net/)
- [视频教程](https://www.bilibili.com/video/BV1GP9TBGEM1/)

---

### 3. Remotion Skills 最佳实践库 ⭐⭐⭐⭐

**社区维护** | **实用**

**仓库**: [buainoai/remotion-skills](https://github.com/buainoai/remotion-skills)

**功能**:
- ✅ 完整的 Remotion 技能库
- ✅ 详细的代码示例
- ✅ 最佳实践指南

**包含内容**:
- 🎨 核心概念（动画、组合、时序）
- 📹 媒体处理（图像、视频、音频）
- 🔧 高级功能（3D、字幕、图表）
- ⚙️ 配置优化（参数化、转场）

---

## 🎨 动画设计 Skills

### 4. Lottie Animation Skills

**功能**: 在 Remotion 中嵌入 Lottie 动画

**使用场景**:
- 矢量动画
- 图标动画
- 复杂动画效果

**集成方式**:
```typescript
import { Lottie } from "@remotion/lottie";
import animationData from "./animation.json";

export const MyLottieAnimation = () => {
  return <Lottie animationData={animationData} />;
};
```

---

### 5. React Three Fiber Skills

**功能**: 在 Remotion 中创建 3D 内容

**使用场景**:
- 3D 产品展示
- 3D 数据可视化
- 沉浸式动画

**集成方式**:
```typescript
import { ThreeCanvas } from "@remotion/three";

export const My3DScene = () => {
  return (
    <ThreeCanvas>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </ThreeCanvas>
  );
};
```

---

## 🤖 AI 辅助创作 Skills

### 6. Claude Code Skills Collection ⭐⭐⭐⭐

**综合技能包** | **推荐**

**仓库**: [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)

**功能**:
- ✅ 233+ 个 Claude Code 技能
- ✅ 涵盖工程、产品、营销等领域
- ✅ 生产就绪的代码模板

**包含类别**:
- 🔧 工程（37个核心技能）
- 🎭 Playwright Pro（12个技能）
- 🧠 自改进代理（7个技能）
- 🎯 产品（15个技能）
- 📣 营销（44个技能）
- 📋 项目管理（9个技能）

**安装**:
```bash
npx skills add alirezarezvani/claude-skills
```

---

### 7. AI Content Generation Skills

**功能**: AI 辅助内容生成

**使用场景**:
- 文案生成
- 视频脚本创作
- SEO 优化内容

**推荐工具**:
- Claude Code（文案生成）
- ChatGPT（脚本创作）
- Gemini（多模态内容）

---

## 🛠️ 开发工具 Skills

### 8. SkillsMP Marketplace ⭐⭐⭐⭐⭐

**最大的 Skills 市场**

**网站**: [skillsmp.com](https://skillsmp.com/zh)

**统计**:
- 📦 175,906+ 个工具技能
- 📊 75,013+ 个数据与AI技能
- 🎬 46,342+ 个内容与媒体技能

**分类**:
- 工具（175,906）
- 商业（129,150）
- 开发（117,662）
- 数据与AI（75,013）
- 测试与安全（74,664）
- DevOps（61,599）
- 文档（49,668）
- 内容与媒体（46,342）

**使用方式**:
访问网站搜索所需技能，按提示安装。

---

### 9. Claudate Skills Market

**Claude Skills 专业市场**

**网站**: [claudate.com](https://claudate.com/zh/)

**统计**:
- 📦 150,000+ Claude Skills
- 🎯 AI、开发、创作一站式平台

**特点**:
- 全球最大的 Claude Skills 平台
- 自动更新目录
- 按类别浏览
- 按热度排序

---

## 🎨 设计资源 Skills

### 10. TailwindCSS for Remotion

**功能**: 在 Remotion 中使用 TailwindCSS

**安装**:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**使用**:
```typescript
export const MyComponent = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <h1 className="text-4xl font-bold text-white">
        Hello TailwindCSS!
      </h1>
    </div>
  );
};
```

---

### 11. Lucide Icons

**功能**: React 图标库

**安装**:
```bash
npm install lucide-react
```

**使用**:
```typescript
import { Rocket, Sparkles, Zap } from "lucide-react";

export const MyIcons = () => {
  return (
    <div>
      <Rocket size={48} />
      <Sparkles size={48} />
      <Zap size={48} />
    </div>
  );
};
```

---

## 📊 Skills 对比表

| Skill | 类型 | 难度 | 推荐度 | 适用场景 |
|-------|------|------|--------|---------|
| Remotion Official | 官方 | ⭐⭐ | ⭐⭐⭐⭐⭐ | 所有 Remotion 项目 |
| Vibe-Motion | AI动画 | ⭐ | ⭐⭐⭐⭐⭐ | 专业动画效果 |
| Remotion Best Practices | 社区 | ⭐⭐ | ⭐⭐⭐⭐ | 学习参考 |
| Claude Skills Collection | 综合 | ⭐⭐ | ⭐⭐⭐⭐ | 开发、产品、营销 |
| SkillsMP | 市场 | ⭐ | ⭐⭐⭐⭐⭐ | 查找各种技能 |
| Claudate | 市场 | ⭐ | ⭐⭐⭐⭐ | Claude 专用技能 |

---

## 🚀 快速开始

### 推荐安装顺序

1. **安装 Remotion 官方 Skills**（必装）
   ```bash
   npx skills add remotion-dev/skills
   ```

2. **安装 Vibe-Motion Skills**（强烈推荐）
   ```bash
   npx skills add vibe-motion/skills
   ```

3. **浏览 SkillsMP 市场**（按需）
   - 访问 https://skillsmp.com/zh
   - 搜索所需技能
   - 按提示安装

4. **安装 Claude Skills Collection**（可选）
   ```bash
   npx skills add alirezarezvani/claude-skills
   ```

---

## 💡 使用技巧

### 1. 组合使用多个 Skills

不同的 Skills 可以组合使用，发挥更大威力：

```typescript
// 结合 Remotion + Vibe-Motion + TailwindCSS
import { useSmoothEntrance } from "./vibe-motion-animations";
import { Rocket } from "lucide-react";

export const MyComponent = () => {
  const { opacity, translateY } = useSmoothEntrance(0);
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <Rocket size={48} className="animate-bounce" />
      <h1 style={{ opacity, transform: `translateY(${translateY}px)` }}>
        组合使用多个 Skills
      </h1>
    </div>
  );
};
```

### 2. 定期更新 Skills

Skills 会不断更新，建议定期检查更新：

```bash
# 更新所有 skills
npx skills update

# 更新特定 skill
npx skills update remotion-dev/skills
```

### 3. 创建自定义 Skills

根据项目需求，创建自己的 Skills：

```markdown
<!-- SKILL.md -->
---
name: my-custom-skill
description: 我的自定义技能
version: 1.0.0
---

# My Custom Skill

## 功能描述
...

## 使用方法
...
```

---

## 🔗 相关资源

### 官方文档
- [Remotion 官方文档](https://www.remotion.dev/docs/)
- [Vibe-Motion 官网](https://www.vibemotion.net/)
- [SkillsMP 市场](https://skillsmp.com/zh)

### GitHub 仓库
- [Remotion 官方 Skills](https://github.com/remotion-dev/remotion/tree/main/packages/skills)
- [Vibe-Motion Skills](https://github.com/vibe-motion/skills)
- [我的 Vibe-Motion Fork](https://github.com/kael-odin/vibe-motion-skills)
- [Remotion 最佳实践](https://github.com/buainoai/remotion-skills)
- [Claude Skills Collection](https://github.com/alirezarezvani/claude-skills)

### 教程资源
- [Remotion Skills 完全指南](https://jishuzhan.net/article/2016666673198710785)
- [Vibe-Motion 视频教程](https://www.bilibili.com/video/BV1GP9TBGEM1/)
- [Claude Code Skills 指南](https://zhuanlan.zhihu.com/p/2023169340644573385)

---

## 🤝 贡献

如果你发现其他优质的 Skills，欢迎提交 PR 添加到本列表！

---

## 📄 许可证

本文档采用 CC BY 4.0 许可证。

---

<div align="center">

**持续更新中...**

Made with ❤️ by kael-odin

</div>
