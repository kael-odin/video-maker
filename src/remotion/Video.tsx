/**
 * Remotion Video Component - AI未来主题
 * 
 * 优化的视觉效果和更丰富的内容展示
 */

import React from "react";
import { Audio, staticFile, AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import type { VideoProps } from "./Root";

import {
  Scale4K,
  FullBleedLayout,
  PaddedLayout,
  useEntrance,
  getPresentation,
  ChapterProgressBar,
  Subtitles,
  IconCard,
  Icon,
  useTiming,
  ComparisonCard,
  DataBar,
  StatCounter,
} from "./components";
import type { TimingSection } from "./components";

// Section renderer - 优化的视觉效果
const SectionComponent = ({
  section,
  props,
}: {
  section: TimingSection;
  props: VideoProps;
}) => {
  const { opacity, translateY, scale } = useEntrance(props.enableAnimations);
  const animStyle = { opacity, transform: `translateY(${translateY}px) scale(${scale})` };
  const v = props.orientation === "vertical";
  const frame = useCurrentFrame();
  const sectionPadding = v ? "120px 60px 160px" : "60px 100px 120px";

  switch (section.name) {
    case "hero":
      return (
        <FullBleedLayout bg={props.backgroundColor}>
          {/* 动态渐变背景 */}
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(ellipse at 30% 20%, ${props.primaryColor}15 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, ${props.accentColor}10 0%, transparent 50%)
            `,
          }} />
          
          {/* 装饰元素 */}
          <div style={{
            position: "absolute", top: 80, right: 120,
            width: 300, height: 300, borderRadius: "50%",
            background: `linear-gradient(135deg, ${props.primaryColor}20, ${props.accentColor}20)`,
            filter: "blur(60px)",
          }} />
          
          <div style={{
            position: "absolute", bottom: 100, left: 100,
            width: 200, height: 200, borderRadius: "50%",
            background: `${props.accentColor}15`,
            filter: "blur(40px)",
          }} />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: v ? "0 60px" : 0,
              ...animStyle,
            }}
          >
            {/* 图标装饰 */}
            <div style={{ marginBottom: 40, display: "flex", gap: 20 }}>
              <Icon name="brain" size={v ? 80 : 100} color={props.primaryColor} animate="pulse" delay={0} />
              <Icon name="sparkles" size={v ? 80 : 100} color={props.accentColor} animate="pulse" delay={5} />
              <Icon name="rocket" size={v ? 80 : 100} color={props.primaryColor} animate="pulse" delay={10} />
            </div>

            <h1
              style={{
                fontSize: props.titleSize,
                fontWeight: 800,
                color: props.primaryColor,
                lineHeight: v ? 1.3 : 1.1,
                textShadow: `0 4px 24px ${props.primaryColor}20`,
                marginBottom: 30,
              }}
            >
              人工智能正在改变世界
            </h1>
            <p
              style={{
                fontSize: props.subtitleSize,
                color: props.textColor,
                opacity: 0.7,
                fontWeight: 500,
                maxWidth: v ? "100%" : "900px",
                lineHeight: 1.6,
              }}
            >
              从ChatGPT到自动驾驶，AI已经渗透到我们生活的方方面面
            </p>
            <p
              style={{
                fontSize: props.subtitleSize * 0.9,
                color: props.primaryColor,
                marginTop: 20,
                fontWeight: 600,
              }}
            >
              今天，我将带你深入了解AI的三大核心应用领域
            </p>
          </div>
        </FullBleedLayout>
      );

    case "ai-chatgpt":
      return (
        <PaddedLayout bg="#fafafa" orientation={props.orientation}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: sectionPadding,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              ...animStyle,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
              <Icon name="message-circle" size={v ? 60 : 80} color={props.primaryColor} animate="bounce" />
              <h2
                style={{
                  fontSize: v ? 64 : 72,
                  fontWeight: 700,
                  marginLeft: 20,
                  color: props.primaryColor,
                }}
              >
                对话式AI
              </h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: v ? "1fr" : "1fr 1fr",
              gap: v ? 24 : 30,
              marginBottom: 30,
            }}>
              <IconCard 
                props={props} 
                icon="zap" 
                title="智能问答" 
                description="理解上下文，多轮对话" 
                delay={0} 
              />
              <IconCard 
                props={props} 
                icon="code" 
                title="代码生成" 
                description="自动编写，提高效率" 
                delay={3} 
              />
              <IconCard 
                props={props} 
                icon="edit" 
                title="内容创作" 
                description="文章、报告、创意文案" 
                delay={6} 
              />
              <IconCard 
                props={props} 
                icon="users" 
                title="客户服务" 
                description="24小时智能客服" 
                delay={9} 
              />
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${props.primaryColor}08, ${props.accentColor}08)`,
              borderRadius: 20,
              padding: v ? "30px 40px" : "40px 50px",
              border: `2px solid ${props.primaryColor}15`,
            }}>
              <p style={{ fontSize: props.bodySize, color: props.textColor, lineHeight: 1.7 }}>
                <strong style={{ color: props.primaryColor }}>未来展望：</strong>
                对话式AI将成为每个人的智能助理，让工作效率提升<span style={{ color: props.accentColor, fontWeight: 700 }}>十倍</span>
              </p>
            </div>
          </div>
        </PaddedLayout>
      );

    case "ai-image":
      return (
        <PaddedLayout bg={props.backgroundColor} orientation={props.orientation}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: sectionPadding,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              ...animStyle,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
              <Icon name="image" size={v ? 60 : 80} color={props.accentColor} animate="bounce" />
              <h2
                style={{
                  fontSize: v ? 64 : 72,
                  fontWeight: 700,
                  marginLeft: 20,
                  color: props.primaryColor,
                }}
              >
                AI图像生成
              </h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: v ? "1fr" : "repeat(3, 1fr)",
              gap: v ? 20 : 30,
              marginBottom: 30,
            }}>
              {[
                { title: "Midjourney", desc: "艺术创作神器", color: "#FF6B6B" },
                { title: "DALL-E", desc: "OpenAI图像生成", color: "#4f6ef7" },
                { title: "Stable Diffusion", desc: "开源图像模型", color: "#10b981" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: `linear-gradient(135deg, ${item.color}10, ${item.color}05)`,
                  borderRadius: 16,
                  padding: v ? "24px 30px" : "30px 40px",
                  border: `2px solid ${item.color}20`,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: v ? 32 : 40, fontWeight: 700, color: item.color, marginBottom: 10 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: props.bodySize * 0.9, color: props.textColor, opacity: 0.7 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${props.accentColor}08, ${props.primaryColor}08)`,
              borderRadius: 20,
              padding: v ? "30px 40px" : "40px 50px",
            }}>
              <p style={{ fontSize: props.bodySize, color: props.textColor, lineHeight: 1.7, textAlign: "center" }}>
                <Icon name="sparkles" size={32} color={props.accentColor} />{" "}
                <strong>只需输入文字描述，AI就能生成惊艳的图像</strong>
              </p>
            </div>
          </div>
        </PaddedLayout>
      );

    case "ai-automation":
      return (
        <PaddedLayout bg="#fafafa" orientation={props.orientation}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: sectionPadding,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              ...animStyle,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
              <Icon name="settings" size={v ? 60 : 80} color={props.primaryColor} animate="rotate" />
              <h2
                style={{
                  fontSize: v ? 64 : 72,
                  fontWeight: 700,
                  marginLeft: 20,
                  color: props.primaryColor,
                }}
              >
                AI自动化
              </h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: v ? "1fr" : "repeat(3, 1fr)",
              gap: v ? 20 : 30,
              marginBottom: 30,
            }}>
              {[
                { icon: "factory", title: "制造业", desc: "24小时不间断生产", stat: "效率+300%" },
                { icon: "trending-up", title: "金融", desc: "高频交易与风控", stat: "准确率95%" },
                { icon: "heart-pulse", title: "医疗", desc: "AI辅助诊断", stat: "准确率98%" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: props.backgroundColor,
                  borderRadius: 16,
                  padding: v ? "24px 30px" : "30px 40px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  border: `1px solid ${props.primaryColor}10`,
                }}>
                  <Icon name={item.icon} size={v ? 48 : 60} color={props.primaryColor} />
                  <div style={{ fontSize: v ? 28 : 32, fontWeight: 700, color: props.textColor, marginTop: 15, marginBottom: 8 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: props.bodySize * 0.9, color: props.textColor, opacity: 0.6, marginBottom: 12 }}>
                    {item.desc}
                  </div>
                  <div style={{ fontSize: v ? 24 : 28, fontWeight: 700, color: props.accentColor }}>
                    {item.stat}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${props.primaryColor}10, ${props.accentColor}10)`,
              borderRadius: 20,
              padding: v ? "30px 40px" : "40px 50px",
              textAlign: "center",
            }}>
              <p style={{ fontSize: v ? 28 : 32, fontWeight: 700, color: props.primaryColor, marginBottom: 10 }}>
                到2030年，AI自动化将为全球经济贡献
              </p>
              <p style={{ fontSize: v ? 48 : 56, fontWeight: 800, color: props.accentColor }}>
                15.7万亿美元
              </p>
            </div>
          </div>
        </PaddedLayout>
      );

    case "summary":
      return (
        <FullBleedLayout bg={props.backgroundColor}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: sectionPadding,
              ...animStyle,
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${props.primaryColor}08, ${props.accentColor}08)`,
                borderRadius: 28,
                padding: v ? "50px 60px" : "60px 80px",
                textAlign: "center",
                width: v ? "100%" : "auto",
                maxWidth: v ? "100%" : "1200px",
                border: `2px solid ${props.primaryColor}15`,
                boxShadow: `0 8px 32px ${props.primaryColor}10`,
              }}
            >
              <h2
                style={{
                  fontSize: v ? 56 : 64,
                  fontWeight: 700,
                  color: props.primaryColor,
                  marginBottom: 40,
                }}
              >
                总结
              </h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: v ? "1fr" : "repeat(3, 1fr)",
                gap: v ? 20 : 30,
                marginBottom: 40,
              }}>
                {[
                  { icon: "message-circle", text: "对话式AI" },
                  { icon: "image", text: "图像生成" },
                  { icon: "settings", text: "自动化" },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: props.backgroundColor,
                    borderRadius: 16,
                    padding: v ? "20px 30px" : "30px 40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 15,
                  }}>
                    <Icon name={item.icon} size={v ? 40 : 50} color={props.primaryColor} />
                    <span style={{ fontSize: v ? 24 : 28, fontWeight: 600, color: props.textColor }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: v ? 32 : 36,
                  color: props.textColor,
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                未来属于那些善于利用AI的人
              </p>
            </div>
          </div>
        </FullBleedLayout>
      );

    case "outro":
      return (
        <FullBleedLayout bg={props.backgroundColor}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              ...animStyle,
            }}
          >
            <h2
              style={{
                fontSize: v ? 68 : 80,
                fontWeight: 700,
                color: props.primaryColor,
                marginBottom: v ? 50 : 60,
              }}
            >
              感谢观看
            </h2>
            
            <div style={{ display: "flex", gap: v ? 40 : 60, marginBottom: v ? 50 : 60, flexDirection: v ? "column" : "row" }}>
              {[
                { icon: "thumbs-up", text: "点赞", color: "#FF6B6B" },
                { icon: "star", text: "收藏", color: "#FFB800" },
                { icon: "bell", text: "关注", color: "#4f6ef7" },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <Icon name={item.icon} size={v ? 70 : 90} color={item.color} animate="bounce" delay={i * 8} />
                  <div style={{ fontSize: v ? 28 : 32, color: props.textColor, marginTop: 12, fontWeight: 600 }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
            
            <p
              style={{
                fontSize: v ? 36 : 42,
                color: props.primaryColor,
                fontWeight: 600,
              }}
            >
              下期再见！
            </p>
          </div>
        </FullBleedLayout>
      );

    default:
      return (
        <PaddedLayout bg={props.backgroundColor} orientation={props.orientation}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: sectionPadding,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              ...animStyle,
            }}
          >
            <h2
              style={{
                fontSize: v ? 64 : 72,
                fontWeight: 700,
                color: props.primaryColor,
                textAlign: "center",
              }}
            >
              {section.name}
            </h2>
          </div>
        </PaddedLayout>
      );
  }
};

// Main video component
export const Video = (props: VideoProps) => {
  const timing = useTiming();
  const sections = timing.sections;
  const transitionFrames = props.transitionDuration;
  const transitionCount = Math.max(0, sections.length - 1);

  const compensatedSections = sections.map((s, i) => ({
    ...s,
    duration_frames: i === 0
      ? s.duration_frames + transitionCount * transitionFrames
      : s.duration_frames,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: props.backgroundColor }}>
      <Scale4K orientation={props.orientation}>
        <TransitionSeries>
          {compensatedSections.map((section, i) => (
            <React.Fragment key={section.name}>
              <TransitionSeries.Sequence durationInFrames={section.duration_frames}>
                <SectionComponent section={section} props={props} />
              </TransitionSeries.Sequence>
              {i < sections.length - 1 && transitionFrames > 0 && props.transitionType !== "none" && (
                <TransitionSeries.Transition
                  presentation={getPresentation(props.transitionType)}
                  timing={linearTiming({ durationInFrames: transitionFrames })}
                />
              )}
            </React.Fragment>
          ))}
        </TransitionSeries>
      </Scale4K>

      <ChapterProgressBar props={props} chapters={timing.sections} />
      <Subtitles src={staticFile("podcast_audio.srt")} />
      <Audio src={staticFile("podcast_audio.wav")} />
    </AbsoluteFill>
  );
};

export default Video;
