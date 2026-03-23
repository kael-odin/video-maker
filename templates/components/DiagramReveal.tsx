import type React from "react";
import type { VideoProps } from "../Root";
import { useEntrance, useDrawOn, staggerDelay } from "./animations";

/**
 * DiagramReveal — General-purpose animated SVG diagram with draw-on effect.
 *
 * Accepts nodes (positioned boxes) and edges (connections between them).
 * Edges draw themselves progressively, then nodes fade in.
 *
 * Usage:
 *   <DiagramReveal
 *     props={props}
 *     nodes={[
 *       { id: "a", label: "Input", x: 100, y: 50 },
 *       { id: "b", label: "Process", x: 400, y: 50 },
 *       { id: "c", label: "Output", x: 700, y: 50 },
 *     ]}
 *     edges={[
 *       { from: "a", to: "b" },
 *       { from: "b", to: "c" },
 *     ]}
 *     width={900}
 *     height={200}
 *   />
 */

export interface DiagramNode {
  id: string;
  label: string;
  x: number;        // center x in SVG viewBox
  y: number;        // center y in SVG viewBox
  icon?: string;
  width?: number;    // default 160
  height?: number;   // default 72
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  style?: "straight" | "curve" | "elbow"; // default "curve"
}

// Build SVG path for an edge between two nodes
const buildEdgePath = (
  fromNode: DiagramNode,
  toNode: DiagramNode,
  style: "straight" | "curve" | "elbow" = "curve",
): string => {
  const fw = (fromNode.width ?? 160) / 2;
  const fh = (fromNode.height ?? 72) / 2;
  const tw = (toNode.width ?? 160) / 2;

  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;

  // Determine exit/entry direction based on relative position
  const horizontal = Math.abs(dx) > Math.abs(dy);

  let x1: number, y1: number, x2: number, y2: number;

  if (horizontal) {
    // Exit from right/left edge of node
    x1 = fromNode.x + (dx > 0 ? fw : -fw);
    y1 = fromNode.y;
    x2 = toNode.x + (dx > 0 ? -tw : tw);
    y2 = toNode.y;
  } else {
    // Exit from top/bottom edge
    x1 = fromNode.x;
    y1 = fromNode.y + (dy > 0 ? fh : -fh);
    x2 = toNode.x;
    y2 = toNode.y + (dy > 0 ? -fh : fh);
  }

  switch (style) {
    case "straight":
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    case "elbow": {
      const midX = (x1 + x2) / 2;
      return horizontal
        ? `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`
        : `M ${x1} ${y1} L ${x1} ${(y1 + y2) / 2} L ${x2} ${(y1 + y2) / 2} L ${x2} ${y2}`;
    }
    case "curve":
    default: {
      if (horizontal) {
        const cx = (x1 + x2) / 2;
        return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
      }
      const cy = (y1 + y2) / 2;
      return `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
    }
  }
};

// Arrowhead at end of edge
const buildArrowHead = (
  fromNode: DiagramNode,
  toNode: DiagramNode,
  size = 8,
): string => {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const horizontal = Math.abs(dx) > Math.abs(dy);
  const tw = (toNode.width ?? 160) / 2;
  const th = (toNode.height ?? 72) / 2;

  if (horizontal) {
    const x = toNode.x + (dx > 0 ? -tw : tw);
    const y = toNode.y;
    const dir = dx > 0 ? -1 : 1;
    return `M ${x + dir * size} ${y - size} L ${x} ${y} L ${x + dir * size} ${y + size}`;
  }
  const x = toNode.x;
  const y = toNode.y + (dy > 0 ? -th : th);
  const dir = dy > 0 ? -1 : 1;
  return `M ${x - size} ${y + dir * size} L ${x} ${y} L ${x + size} ${y + dir * size}`;
};

// Single animated edge
const AnimatedEdge = ({
  fromNode, toNode, edge, color, enabled, delay,
}: {
  fromNode: DiagramNode; toNode: DiagramNode; edge: DiagramEdge;
  color: string; enabled: boolean; delay: number;
}) => {
  const edgePath = buildEdgePath(fromNode, toNode, edge.style);
  const headPath = buildArrowHead(fromNode, toNode);
  const line = useDrawOn(edgePath, enabled, delay, 24, "gentle");
  const head = useDrawOn(headPath, enabled, delay + 16, 10, "snappy");

  return (
    <>
      <path
        d={edgePath}
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
      {edge.label && line.progress > 0.5 && (
        <text
          x={(fromNode.x + toNode.x) / 2}
          y={(fromNode.y + toNode.y) / 2 - 10}
          textAnchor="middle"
          fill={color}
          fontSize={16}
          opacity={Math.min(1, (line.progress - 0.5) * 4)}
        >
          {edge.label}
        </text>
      )}
    </>
  );
};

// Single animated node box
const AnimatedNode = ({
  node, color, textColor, bgColor, enabled, delay,
}: {
  node: DiagramNode; color: string; textColor: string;
  bgColor: string; enabled: boolean; delay: number;
}) => {
  const w = node.width ?? 160;
  const h = node.height ?? 72;
  const r = 12; // border radius

  // Rounded rectangle as SVG path for draw-on
  const rectPath = `M ${node.x - w / 2 + r} ${node.y - h / 2}
    L ${node.x + w / 2 - r} ${node.y - h / 2}
    Q ${node.x + w / 2} ${node.y - h / 2} ${node.x + w / 2} ${node.y - h / 2 + r}
    L ${node.x + w / 2} ${node.y + h / 2 - r}
    Q ${node.x + w / 2} ${node.y + h / 2} ${node.x + w / 2 - r} ${node.y + h / 2}
    L ${node.x - w / 2 + r} ${node.y + h / 2}
    Q ${node.x - w / 2} ${node.y + h / 2} ${node.x - w / 2} ${node.y + h / 2 - r}
    L ${node.x - w / 2} ${node.y - h / 2 + r}
    Q ${node.x - w / 2} ${node.y - h / 2} ${node.x - w / 2 + r} ${node.y - h / 2} Z`;

  const draw = useDrawOn(rectPath, enabled, delay, 20, "snappy");

  return (
    <>
      {/* Fill background (fades in with draw progress) */}
      <rect
        x={node.x - w / 2}
        y={node.y - h / 2}
        width={w}
        height={h}
        rx={r}
        fill={bgColor}
        opacity={draw.progress * 0.08}
      />
      {/* Animated border */}
      <path
        d={rectPath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeOpacity={0.3}
        strokeDasharray={draw.strokeDasharray}
        strokeDashoffset={draw.strokeDashoffset}
      />
      {/* Label (appears after border draws) */}
      <text
        x={node.x}
        y={node.y + 6}
        textAnchor="middle"
        fill={textColor}
        fontSize={22}
        fontWeight={600}
        opacity={Math.min(1, draw.progress * 2)}
      >
        {node.label}
      </text>
    </>
  );
};

export const DiagramReveal = ({
  props,
  nodes,
  edges,
  width = 900,
  height = 300,
  delay = 0,
}: {
  props: VideoProps;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  width?: number;
  height?: number;
  delay?: number;
}) => {
  const a = useEntrance(props.enableAnimations, delay, "gentle");
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div style={{
      width: "100%",
      opacity: a.opacity,
      transform: `translateY(${a.translateY}px)`,
    }}>
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: "visible" }}
      >
        {/* Draw edges first (behind nodes) */}
        {edges.map((edge, i) => {
          const fromNode = nodeMap.get(edge.from);
          const toNode = nodeMap.get(edge.to);
          if (!fromNode || !toNode) return null;
          return (
            <AnimatedEdge
              key={`${edge.from}-${edge.to}`}
              fromNode={fromNode}
              toNode={toNode}
              edge={edge}
              color={props.primaryColor}
              enabled={props.enableAnimations}
              delay={staggerDelay(i, delay + 5, 8)}
            />
          );
        })}
        {/* Draw nodes on top */}
        {nodes.map((node, i) => (
          <AnimatedNode
            key={node.id}
            node={node}
            color={props.primaryColor}
            textColor={props.textColor}
            bgColor={props.primaryColor}
            enabled={props.enableAnimations}
            delay={staggerDelay(i, delay, 6)}
          />
        ))}
      </svg>
    </div>
  );
};
