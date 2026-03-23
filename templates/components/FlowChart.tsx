import React from "react";
import type { VideoProps } from "../Root";
import { useEntrance, useDrawOn, staggerDelay } from "./animations";
import { Icon } from "./Icon";

export const FlowChart = ({
  props,
  steps,
  delay = 0,
}: {
  props: VideoProps;
  steps: { label: string; description?: string; icon?: string }[];
  delay?: number;
}) => {
  const v = props.orientation === "vertical";
  const iconAnim = props.iconAnimation === "none" ? "none" : "entrance";
  const gapSize = v ? 48 : 56;
  const stepCount = steps.length;

  return (
    <div style={{
      display: "flex", alignItems: "stretch", width: "100%",
      flexDirection: v ? "column" : "row", gap: 0,
      position: "relative",
    }}>
      {steps.map((step, i) => {
        const a = useEntrance(props.enableAnimations, staggerDelay(i, delay, 10), "snappy");
        return (
          <React.Fragment key={i}>
            <div style={{
              flex: 1, textAlign: "center",
              padding: v ? "28px 32px" : "32px 20px",
              background: `linear-gradient(135deg, ${props.primaryColor}08, ${props.primaryColor}14)`,
              borderRadius: 20,
              boxShadow: `0 2px 8px rgba(0,0,0,0.04), 0 4px 16px ${props.primaryColor}08`,
              border: `1px solid ${props.primaryColor}15`,
              opacity: a.opacity, transform: `translateY(${a.translateY}px)`,
              minWidth: 0,
              position: "relative",
              zIndex: 1,
            }}>
              {step.icon && (
                <div style={{ marginBottom: 12 }}>
                  <Icon name={step.icon} size={v ? 44 : 48} color={props.primaryColor} animate={iconAnim} delay={staggerDelay(i, delay, 10)} />
                </div>
              )}
              <div style={{
                fontSize: v ? 30 : 28, fontWeight: 700, color: props.primaryColor,
              }}>
                {step.label}
              </div>
              {step.description && (
                <div style={{
                  fontSize: v ? 22 : 20, color: props.textColor, marginTop: 8,
                  opacity: 0.65, lineHeight: 1.4,
                }}>
                  {step.description}
                </div>
              )}
            </div>
            {i < stepCount - 1 && (
              <div style={{
                width: v ? 4 : gapSize,
                height: v ? gapSize : 4,
                position: "relative",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox={v ? "0 0 4 48" : "0 0 56 4"}
                  preserveAspectRatio="none"
                  style={{ overflow: "visible" }}
                >
                  <ArrowConnector
                    vertical={v}
                    color={props.primaryColor}
                    enabled={props.enableAnimations}
                    delay={staggerDelay(i, delay + 5, 10)}
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Simplified arrow connector rendered inside a small SVG viewBox
const ArrowConnector = ({
  vertical, color, enabled, delay,
}: {
  vertical: boolean; color: string; enabled: boolean; delay: number;
}) => {
  const linePath = vertical
    ? "M 2 0 L 2 38"
    : "M 0 2 L 46 2";
  const headPath = vertical
    ? "M -4 34 L 2 42 L 8 34"
    : "M 42 -4 L 50 2 L 42 8";

  const line = useDrawOn(linePath, enabled, delay, 18, "snappy");
  const head = useDrawOn(headPath, enabled, delay + 10, 10, "snappy");

  return (
    <>
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeOpacity={0.5}
        strokeLinecap="round"
        strokeDasharray={line.strokeDasharray}
        strokeDashoffset={line.strokeDashoffset}
      />
      <path
        d={headPath}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeOpacity={0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={head.strokeDasharray}
        strokeDashoffset={head.strokeDashoffset}
      />
    </>
  );
};
