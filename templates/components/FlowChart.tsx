import React from "react";
import type { VideoProps } from "../Root";
import { useEntrance } from "./animations";
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
  return (
    <div style={{
      display: "flex", alignItems: "center", width: "100%",
      flexDirection: v ? "column" : "row", gap: 0,
    }}>
      {steps.map((step, i) => {
        const a = useEntrance(props.enableAnimations, delay + i * 8, "snappy");
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
            }}>
              {step.icon && (
                <div style={{ marginBottom: 12 }}>
                  <Icon name={step.icon} size={v ? 44 : 48} color={props.primaryColor} animate={iconAnim} delay={delay + i * 8} />
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
            {i < steps.length - 1 && (
              <div style={{
                fontSize: v ? 32 : 36, color: props.primaryColor, opacity: 0.4,
                padding: v ? "8px 0" : "0 8px", flexShrink: 0,
                transform: v ? "rotate(90deg)" : undefined,
              }}>
                →
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
