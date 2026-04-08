/**
 * Tech Revolution Video - 科技巨头故事
 * 
 * 使用 vibe-motion 风格的专业动画效果
 * 讲述马斯克、乔布斯、盖茨的创新故事
 */

import React from "react";
import {
  Audio,
  staticFile,
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import type { VideoProps } from "./Root";
import { useTiming } from "./components";

// ============================================
// 动画工具函数
// ============================================

const useSmoothEntrance = (delay: number = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 20,
      stiffness: 100,
      mass: 0.8,
    },
  });
  
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    translateY: interpolate(progress, [0, 1], [50, 0]),
    scale: interpolate(progress, [0, 1], [0.9, 1]),
  };
};

const useTypewriter = (text: string, startFrame: number, speed: number = 2) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor((frame - startFrame) / speed);
  return text.slice(0, Math.max(0, charsToShow));
};

const usePulse = (frequency: number = 0.1) => {
  const frame = useCurrentFrame();
  return Math.sin(frame * frequency) * 0.5 + 0.5;
};

const useFloating = (amplitude: number = 10, frequency: number = 0.05) => {
  const frame = useCurrentFrame();
  return Math.sin(frame * frequency) * amplitude;
};

// ============================================
// 装饰组件
// ============================================

const ParticleField: React.FC<{ count: number; color: string }> = ({ count, color }) => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.sin(i * 137.5) * 50 + 50,
    y: (frame * 0.1 + i * 20) % 120 - 10,
    size: 3 + Math.sin(i) * 2,
    opacity: 0.1 + Math.sin(frame * 0.02 + i) * 0.1,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

const GradientOrb: React.FC<{
  color1: string;
  color2: string;
  size: number;
  x: string;
  y: string;
  delay: number;
}> = ({ color1, color2, size, x, y, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  
  const floatY = useFloating(15, 0.03);
  const pulse = usePulse(0.05);
  
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: `calc(${y} + ${floatY}px)`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color1}, ${color2})`,
        opacity: progress * (0.3 + pulse * 0.2),
        filter: "blur(40px)",
        transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
      }}
    />
  );
};

// ============================================
// Hero Section - 开场
// ============================================

const HeroSection: React.FC<{ props: VideoProps }> = ({ props }) => {
  const titleAnim = useSmoothEntrance(0);
  const subtitleAnim = useSmoothEntrance(15);
  const ctaAnim = useSmoothEntrance(30);
  const v = props.orientation === "vertical";
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* 背景装饰 */}
      <ParticleField count={50} color={props.primaryColor} />
      <GradientOrb color1="#4f6ef7" color2="#8b5cf6" size={400} x="20%" y="30%" delay={0} />
      <GradientOrb color1="#10b981" color2="#3b82f6" size={300} x="70%" y="60%" delay={10} />
      
      {/* 主内容 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: v ? "0 40px" : 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.translateY}px) scale(${titleAnim.scale})`,
          }}
        >
          <h1
            style={{
              fontSize: v ? 64 : 90,
              fontWeight: 900,
              background: "linear-gradient(135deg, #4f6ef7, #8b5cf6, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 30,
              letterSpacing: "-2px",
            }}
          >
            科技巨头的故事
          </h1>
        </div>
        
        <div
          style={{
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.translateY}px)`,
            maxWidth: v ? "100%" : "1000px",
          }}
        >
          <p
            style={{
              fontSize: v ? 32 : 42,
              color: "#e5e7eb",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            想象一下，如果马斯克、乔布斯、比尔盖茨同时出现在一个房间里
          </p>
          <p
            style={{
              fontSize: v ? 28 : 36,
              color: "#9ca3af",
              marginTop: 20,
            }}
          >
            他们会聊些什么？
          </p>
        </div>
        
        <div
          style={{
            opacity: ctaAnim.opacity,
            marginTop: 60,
          }}
        >
          <div
            style={{
              fontSize: v ? 24 : 28,
              color: props.primaryColor,
              fontWeight: 600,
              padding: "20px 40px",
              border: `2px solid ${props.primaryColor}`,
              borderRadius: 50,
              background: `${props.primaryColor}10`,
            }}
          >
            今天，我将带你见证一场改变世界的对话
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Story Card - 故事卡片
// ============================================

interface StoryCardProps {
  name: string;
  title: string;
  quote: string;
  story: string[];
  avatar: string;
  color: string;
  delay: number;
  props: VideoProps;
}

const StoryCard: React.FC<StoryCardProps> = ({
  name,
  title,
  quote,
  story,
  avatar,
  color,
  delay,
  props,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = props.orientation === "vertical";
  
  const cardAnim = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  
  const progress = interpolate(cardAnim, [0, 1], [0, 1]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <ParticleField count={30} color={color} />
      <GradientOrb color1={color} color2="#8b5cf6" size={500} x="60%" y="40%" delay={0} />
      
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: v ? "80px 50px" : "100px 120px",
          display: "flex",
          flexDirection: v ? "column" : "row",
          gap: v ? 40 : 80,
          alignItems: v ? "flex-start" : "center",
          zIndex: 10,
        }}
      >
        {/* 左侧：人物信息 */}
        <div
          style={{
            flex: v ? "none" : "0 0 400px",
            opacity: progress,
            transform: `translateX(${interpolate(progress, [0, 1], [-50, 0])}px)`,
          }}
        >
          {/* 头像 */}
          <div
            style={{
              width: v ? 200 : 280,
              height: v ? 200 : 280,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${color}, ${color}80)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: v ? 80 : 120,
              marginBottom: 30,
              boxShadow: `0 0 60px ${color}40`,
            }}
          >
            {avatar}
          </div>
          
          <h2
            style={{
              fontSize: v ? 48 : 64,
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: 10,
            }}
          >
            {name}
          </h2>
          
          <p
            style={{
              fontSize: v ? 24 : 32,
              color: color,
              fontWeight: 600,
              marginBottom: 30,
            }}
          >
            {title}
          </p>
          
          {/* 名言 */}
          <div
            style={{
              background: `${color}15`,
              borderLeft: `4px solid ${color}`,
              padding: "20px 30px",
              borderRadius: 8,
            }}
          >
            <p
              style={{
                fontSize: v ? 20 : 24,
                color: "#e5e7eb",
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
            >
              "{quote}"
            </p>
          </div>
        </div>
        
        {/* 右侧：故事内容 */}
        <div
          style={{
            flex: 1,
            opacity: progress,
            transform: `translateX(${interpolate(progress, [0, 1], [50, 0])}px)`,
          }}
        >
          {story.map((paragraph, i) => {
            const textProgress = spring({
              frame: frame - delay - 20 - i * 15,
              fps,
              config: { damping: 20, stiffness: 80 },
            });
            
            return (
              <p
                key={i}
                style={{
                  fontSize: v ? 24 : 32,
                  color: "#d1d5db",
                  lineHeight: 1.8,
                  marginBottom: 25,
                  opacity: textProgress,
                  transform: `translateY(${interpolate(textProgress, [0, 1], [20, 0])}px)`,
                }}
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Innovation Section - 创新模式对比
// ============================================

const InnovationSection: React.FC<{ props: VideoProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = props.orientation === "vertical";
  
  const titleAnim = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  
  const innovators = [
    {
      name: "马斯克",
      type: "颠覆式创新",
      desc: "挑战不可能",
      color: "#ef4444",
      icon: "🚀",
    },
    {
      name: "乔布斯",
      type: "设计驱动",
      desc: "追求极致体验",
      color: "#8b5cf6",
      icon: "🎨",
    },
    {
      name: "盖茨",
      type: "技术普及",
      desc: "让每个人受益",
      color: "#10b981",
      icon: "💻",
    },
  ];
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <ParticleField count={40} color="#8b5cf6" />
      
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: v ? "80px 50px" : "100px 120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <h2
          style={{
            fontSize: v ? 56 : 72,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            marginBottom: 60,
            opacity: titleAnim,
            transform: `translateY(${interpolate(titleAnim, [0, 1], [-30, 0])}px)`,
          }}
        >
          三位巨头，三种创新模式
        </h2>
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: v ? "1fr" : "repeat(3, 1fr)",
            gap: v ? 30 : 50,
          }}
        >
          {innovators.map((person, i) => {
            const cardProgress = spring({
              frame: frame - 20 - i * 15,
              fps,
              config: { damping: 20, stiffness: 80 },
            });
            
            return (
              <div
                key={i}
                style={{
                  background: `linear-gradient(135deg, ${person.color}15, ${person.color}05)`,
                  border: `2px solid ${person.color}30`,
                  borderRadius: 24,
                  padding: v ? "40px 30px" : "50px 40px",
                  opacity: cardProgress,
                  transform: `translateY(${interpolate(cardProgress, [0, 1], [30, 0])}px)`,
                }}
              >
                <div style={{ fontSize: v ? 60 : 80, marginBottom: 20, textAlign: "center" }}>
                  {person.icon}
                </div>
                <h3
                  style={{
                    fontSize: v ? 36 : 44,
                    fontWeight: 700,
                    color: person.color,
                    marginBottom: 15,
                    textAlign: "center",
                  }}
                >
                  {person.name}
                </h3>
                <p
                  style={{
                    fontSize: v ? 24 : 28,
                    color: "#ffffff",
                    fontWeight: 600,
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  {person.type}
                </p>
                <p
                  style={{
                    fontSize: v ? 20 : 24,
                    color: "#9ca3af",
                    textAlign: "center",
                  }}
                >
                  {person.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Lesson Section - 课程学习
// ============================================

const LessonSection: React.FC<{ props: VideoProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = props.orientation === "vertical";
  
  const titleAnim = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  
  const lessons = [
    {
      title: "失败不是终点，而是起点",
      desc: "马斯克三次失败，乔布斯被开除，盖茨的早期产品也很糟糕。但他们都从失败中学习，变得更强大。",
      icon: "💪",
    },
    {
      title: "专注比什么都重要",
      desc: "乔布斯砍掉70%产品，马斯克只做几件事。专注让你成为领域专家，而不是平庸的全才。",
      icon: "🎯",
    },
    {
      title: "要有更大的愿景",
      desc: "不要只想着赚钱，要想着如何改变世界。当你解决了真正的问题，财富自然会来。",
      icon: "🌟",
    },
  ];
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <ParticleField count={35} color="#10b981" />
      <GradientOrb color1="#10b981" color2="#3b82f6" size={400} x="50%" y="50%" delay={0} />
      
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: v ? "80px 50px" : "100px 120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <h2
          style={{
            fontSize: v ? 56 : 72,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            marginBottom: 60,
            opacity: titleAnim,
          }}
        >
          从他们身上，我们学到什么？
        </h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {lessons.map((lesson, i) => {
            const lessonProgress = spring({
              frame: frame - 20 - i * 20,
              fps,
              config: { damping: 20, stiffness: 80 },
            });
            
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 30,
                  opacity: lessonProgress,
                  transform: `translateX(${interpolate(lessonProgress, [0, 1], [-30, 0])}px)`,
                }}
              >
                <div style={{ fontSize: v ? 50 : 60, flexShrink: 0 }}>{lesson.icon}</div>
                <div>
                  <h3
                    style={{
                      fontSize: v ? 32 : 40,
                      fontWeight: 700,
                      color: props.primaryColor,
                      marginBottom: 12,
                    }}
                  >
                    第{i + 1}点：{lesson.title}
                  </h3>
                  <p
                    style={{
                      fontSize: v ? 22 : 28,
                      color: "#d1d5db",
                      lineHeight: 1.7,
                    }}
                  >
                    {lesson.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Call to Action Section
// ============================================

const CallToActionSection: React.FC<{ props: VideoProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = props.orientation === "vertical";
  
  const mainAnim = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  
  const pulse = usePulse(0.08);
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <ParticleField count={50} color="#8b5cf6" />
      <GradientOrb color1="#4f6ef7" color2="#8b5cf6" size={600} x="50%" y="50%" delay={0} />
      
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: v ? "0 50px" : 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            opacity: mainAnim,
            transform: `scale(${interpolate(mainAnim, [0, 1], [0.8, 1])})`,
          }}
        >
          <h2
            style={{
              fontSize: v ? 56 : 80,
              fontWeight: 800,
              background: "linear-gradient(135deg, #4f6ef7, #8b5cf6, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 40,
            }}
          >
            现在，轮到你了
          </h2>
          
          <p
            style={{
              fontSize: v ? 28 : 36,
              color: "#e5e7eb",
              lineHeight: 1.8,
              maxWidth: v ? "100%" : "900px",
              marginBottom: 50,
            }}
          >
            你不需要成为下一个马斯克或乔布斯
            <br />
            但你可以在自己的领域，做出改变
          </p>
          
          <div
            style={{
              fontSize: v ? 32 : 42,
              fontWeight: 700,
              color: props.primaryColor,
              padding: "30px 60px",
              border: `3px solid ${props.primaryColor}`,
              borderRadius: 60,
              background: `${props.primaryColor}20`,
              boxShadow: `0 0 ${40 + pulse * 20}px ${props.primaryColor}40`,
            }}
          >
            每个伟大的创新，都始于一个小小的想法
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Outro Section
// ============================================

const OutroSection: React.FC<{ props: VideoProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = props.orientation === "vertical";
  
  const mainAnim = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <ParticleField count={60} color="#4f6ef7" />
      
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div style={{ opacity: mainAnim }}>
          <h2
            style={{
              fontSize: v ? 64 : 90,
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: 60,
            }}
          >
            感谢观看
          </h2>
          
          <div
            style={{
              display: "flex",
              gap: v ? 30 : 50,
              marginBottom: 50,
              flexDirection: v ? "column" : "row",
            }}
          >
            {[
              { icon: "👍", text: "点赞", color: "#ef4444" },
              { icon: "⭐", text: "收藏", color: "#f59e0b" },
              { icon: "🔔", text: "关注", color: "#3b82f6" },
            ].map((item, i) => {
              const itemProgress = spring({
                frame: frame - 20 - i * 10,
                fps,
                config: { damping: 15, stiffness: 100 },
              });
              
              return (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    opacity: itemProgress,
                    transform: `translateY(${interpolate(itemProgress, [0, 1], [20, 0])}px)`,
                  }}
                >
                  <div style={{ fontSize: v ? 60 : 80, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ fontSize: v ? 24 : 28, color: item.color, fontWeight: 600 }}>
                    {item.text}
                  </div>
                </div>
              );
            })}
          </div>
          
          <p
            style={{
              fontSize: v ? 32 : 40,
              color: props.primaryColor,
              fontWeight: 600,
            }}
          >
            下期我们将深入探讨如何培养创新思维
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Main Video Component
// ============================================

export const TechRevolutionVideo: React.FC<VideoProps> = (props) => {
  const { fps } = useVideoConfig();
  const timing = useTiming();
  const sections = timing.sections;
  
  // 时间轴配置（每个 section 的持续时间，单位：秒）
  const sectionComponents = [
    { name: "hero", Component: HeroSection },
    { name: "musk-story", Component: () => (
      <StoryCard
        name="埃隆·马斯克"
        title="现实版的钢铁侠"
        quote="当一件事足够重要，即使胜算不大，你也要去做"
        story={[
          "从PayPal到特斯拉，从SpaceX到Neuralink，他的人生就像一部科幻电影。",
          "2008年，SpaceX连续三次火箭发射失败，濒临破产。但他没有放弃，第四次成功了。",
          "现在，SpaceX已经成为全球唯一能回收火箭的公司。",
          "这就是改变世界的勇气。"
        ]}
        avatar="🚀"
        color="#ef4444"
        delay={0}
        props={props}
      />
    )},
    { name: "jobs-story", Component: () => (
      <StoryCard
        name="史蒂夫·乔布斯"
        title="苹果的灵魂人物"
        quote="活着就是为了改变世界，难道还有其他原因吗？"
        story={[
          "被自己创办的公司开除，却从未停止创新。",
          "1997年回归苹果时，公司距离破产只有90天。他砍掉70%的产品线，专注做最好的产品。",
          "iPod、iPhone、iPad，每一个都重新定义了行业。",
          "这就是极致的追求。"
        ]}
        avatar="🍎"
        color="#8b5cf6"
        delay={0}
        props={props}
      />
    )},
    { name: "gates-story", Component: () => (
      <StoryCard
        name="比尔·盖茨"
        title="从程序员到世界首富"
        quote="如果你生而贫穷，那不是你的错。但如果你死时贫穷，那就是你的错。"
        story={[
          "13岁开始编程，20岁创办微软。Windows系统让电脑走进千家万户。",
          "但真正让他伟大的，不是财富，而是慈善。",
          "2008年，他全职投入盖茨基金会，致力于消除贫困、改善教育、研发疫苗。",
          "这就是责任与担当。"
        ]}
        avatar="💻"
        color="#10b981"
        delay={0}
        props={props}
      />
    )},
    { name: "innovation", Component: InnovationSection },
    { name: "lesson", Component: LessonSection },
    { name: "call-to-action", Component: CallToActionSection },
    { name: "outro", Component: OutroSection },
  ];
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {sections.map((section, i) => {
        const sectionConfig = sectionComponents.find(s => s.name === section.name);
        if (!sectionConfig) return null;
        
        return (
          <Sequence
            key={section.name}
            from={section.start_frame}
            durationInFrames={section.duration_frames}
          >
            <sectionConfig.Component props={props} />
          </Sequence>
        );
      })}
      
      <Audio src={staticFile("podcast_audio.wav")} />
    </AbsoluteFill>
  );
};

export default TechRevolutionVideo;
