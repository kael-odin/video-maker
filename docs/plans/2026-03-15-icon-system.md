# Icon System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add unified icon system using Lucide React with semantic naming, animations, and backward emoji compatibility.

**Architecture:** Single `<Icon>` component resolves semantic names (e.g., "rocket") to Lucide components via lookup map. Emoji strings detected automatically and rendered directly. Animation support via existing `useEntrance` hook.

**Tech Stack:** lucide-react, React, Remotion, Zod

---

## Task 1: Install Lucide React

**Files:**
- Modify: `package.json`

**Step 1: Install dependency**

Run: `npm install lucide-react`

**Step 2: Verify installation**

Run: `npm ls lucide-react`
Expected: `lucide-react@x.x.x`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add lucide-react for icon system"
```

---

## Task 2: Create Icon Map

**Files:**
- Create: `templates/components/iconMap.ts`

**Step 1: Create iconMap.ts with semantic mappings**

```typescript
import {
  Rocket, Check, X, Plus, Minus, Play, Pause, ChevronRight,
  Lightbulb, Target, Star, Heart, Flag, Trophy, Zap, Sparkles,
  Code, Terminal, Database, Server, Cloud, Cpu, Globe, Wifi,
  Video, Music, Image, Mic, Camera, Headphones, Volume2,
  DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, Wallet,
  MessageCircle, Mail, Bell, Share2, Send, Users, User,
  FileText, Folder, Download, Upload, Search, Settings, Lock,
  Calendar, Clock, Timer, AlertCircle, Info, HelpCircle,
  ThumbsUp, ThumbsDown, Bookmark, Eye, EyeOff,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, RefreshCw,
  CheckCircle, XCircle, AlertTriangle, Shield, Award,
  Layers, Layout, Grid, List, Package, Box, Puzzle,
  Brain, Wand2, Palette, Brush, Pen, Edit3,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  // Actions
  rocket: Rocket,
  check: Check,
  x: X,
  plus: Plus,
  minus: Minus,
  play: Play,
  pause: Pause,
  "chevron-right": ChevronRight,
  refresh: RefreshCw,

  // Objects
  lightbulb: Lightbulb,
  target: Target,
  star: Star,
  heart: Heart,
  flag: Flag,
  trophy: Trophy,
  zap: Zap,
  sparkles: Sparkles,

  // Tech
  code: Code,
  terminal: Terminal,
  database: Database,
  server: Server,
  cloud: Cloud,
  cpu: Cpu,
  globe: Globe,
  wifi: Wifi,

  // Media
  video: Video,
  music: Music,
  image: Image,
  mic: Mic,
  camera: Camera,
  headphones: Headphones,
  volume: Volume2,

  // Finance
  dollar: DollarSign,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  chart: BarChart3,
  pie: PieChart,
  wallet: Wallet,

  // Communication
  message: MessageCircle,
  mail: Mail,
  bell: Bell,
  share: Share2,
  send: Send,
  users: Users,
  user: User,

  // Files
  file: FileText,
  folder: Folder,
  download: Download,
  upload: Upload,
  search: Search,
  settings: Settings,
  lock: Lock,

  // Time
  calendar: Calendar,
  clock: Clock,
  timer: Timer,

  // Status
  alert: AlertCircle,
  info: Info,
  help: HelpCircle,
  "check-circle": CheckCircle,
  "x-circle": XCircle,
  warning: AlertTriangle,
  shield: Shield,
  award: Award,

  // Interaction
  "thumbs-up": ThumbsUp,
  "thumbs-down": ThumbsDown,
  bookmark: Bookmark,
  eye: Eye,
  "eye-off": EyeOff,

  // Arrows
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,

  // Layout
  layers: Layers,
  layout: Layout,
  grid: Grid,
  list: List,
  package: Package,
  box: Box,
  puzzle: Puzzle,

  // Creative
  brain: Brain,
  wand: Wand2,
  palette: Palette,
  brush: Brush,
  pen: Pen,
  edit: Edit3,
};

export const isEmoji = (s: string): boolean => {
  if (s.length > 4) return false;
  return /\p{Emoji}/u.test(s);
};
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit templates/components/iconMap.ts 2>&1 || echo "Check imports"`

**Step 3: Commit**

```bash
git add templates/components/iconMap.ts
git commit -m "feat: add icon semantic mapping with 80+ Lucide icons"
```

---

## Task 3: Create Icon Component

**Files:**
- Create: `templates/components/Icon.tsx`

**Step 1: Create Icon.tsx**

```typescript
import { useCurrentFrame, interpolate } from "remotion";
import { ICON_MAP, isEmoji } from "./iconMap";

type AnimationType = "none" | "entrance" | "pulse" | "bounce";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  animate?: AnimationType;
  delay?: number;
  strokeWidth?: number;
}

export const Icon = ({
  name,
  size = 56,
  color = "currentColor",
  animate = "entrance",
  delay = 0,
  strokeWidth = 2,
}: IconProps) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  // Animation values
  let opacity = 1;
  let scale = 1;
  let translateY = 0;

  if (animate === "entrance") {
    opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
    scale = interpolate(f, [0, 15], [0.5, 1], { extrapolateRight: "clamp" });
    translateY = interpolate(f, [0, 15], [20, 0], { extrapolateRight: "clamp" });
  } else if (animate === "pulse") {
    scale = interpolate(f % 60, [0, 30, 60], [1, 1.08, 1]);
  } else if (animate === "bounce") {
    opacity = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
    const bounce = interpolate(f, [0, 10, 20, 25], [40, -10, 5, 0], { extrapolateRight: "clamp" });
    translateY = bounce;
    scale = interpolate(f, [0, 10, 20], [0.3, 1.1, 1], { extrapolateRight: "clamp" });
  }

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    opacity,
    transform: `translateY(${translateY}px) scale(${scale})`,
  };

  // Emoji: render directly
  if (isEmoji(name)) {
    return (
      <span style={{ ...style, fontSize: size * 0.85, lineHeight: 1 }}>
        {name}
      </span>
    );
  }

  // Lucide icon: lookup and render
  const LucideIcon = ICON_MAP[name.toLowerCase()];
  if (LucideIcon) {
    return (
      <span style={style}>
        <LucideIcon size={size} color={color} strokeWidth={strokeWidth} />
      </span>
    );
  }

  // Fallback: show name as text (for debugging)
  return (
    <span style={{ ...style, fontSize: size * 0.4, color: "#999" }}>
      [{name}]
    </span>
  );
};
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit templates/components/Icon.tsx 2>&1 || echo "Check imports"`

**Step 3: Commit**

```bash
git add templates/components/Icon.tsx
git commit -m "feat: add Icon component with animation support"
```

---

## Task 4: Update Barrel Export

**Files:**
- Modify: `templates/components/index.ts`

**Step 1: Add Icon export**

Add to `templates/components/index.ts`:

```typescript
export { Icon } from "./Icon";
export { ICON_MAP, isEmoji } from "./iconMap";
```

**Step 2: Commit**

```bash
git add templates/components/index.ts
git commit -m "feat: export Icon component from barrel"
```

---

## Task 5: Update Root.tsx Schema

**Files:**
- Modify: `templates/Root.tsx:19-49` (schema section)

**Step 1: Add icon props to videoSchema**

Add after line 48 (`orientation` field), before closing `});`:

```typescript
  // 图标设置
  iconStyle: z.enum(["lucide", "emoji", "mixed"]).describe("图标风格: lucide(SVG) / emoji / mixed"),
  iconAnimation: z.enum(["entrance", "none"]).describe("图标动画: entrance / none"),
```

**Step 2: Add icon defaults to defaultVideoProps**

Add after line 85 (`orientation: "horizontal"`):

```typescript
  // 图标
  iconStyle: "lucide",
  iconAnimation: "entrance",
```

**Step 3: Commit**

```bash
git add templates/Root.tsx
git commit -m "feat: add icon style/animation props to video schema"
```

---

## Task 6: Update IconCard Component

**Files:**
- Modify: `templates/components/IconCard.tsx`

**Step 1: Replace emoji rendering with Icon component**

Replace entire file:

```typescript
import type { VideoProps } from "../Root";
import { useEntrance } from "./animations";
import { Icon } from "./Icon";

export const IconCard = ({
  props,
  icon,
  title,
  description,
  color,
  delay = 0,
}: {
  props: VideoProps;
  icon: string;
  title: string;
  description: string;
  color?: string;
  delay?: number;
}) => {
  const v = props.orientation === "vertical";
  const c = color || props.primaryColor;
  const a = useEntrance(props.enableAnimations, delay, "bouncy");
  const iconAnim = props.iconAnimation === "none" ? "none" : "entrance";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: v ? 28 : 32, width: "100%",
      padding: v ? "32px 36px" : "36px 44px",
      background: `linear-gradient(135deg, ${c}08, ${c}14)`,
      borderRadius: 24,
      border: `1px solid ${c}18`,
      boxShadow: `0 4px 16px ${c}10, 0 8px 24px rgba(0,0,0,0.04)`,
      opacity: a.opacity, transform: `translateY(${a.translateY}px) scale(${a.scale})`,
    }}>
      <div style={{
        flexShrink: 0,
        width: v ? 80 : 88, height: v ? 80 : 88,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${c}12`, borderRadius: 20,
      }}>
        <Icon name={icon} size={v ? 48 : 56} color={c} animate={iconAnim} delay={delay} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: v ? 34 : 36, fontWeight: 700, color: c }}>
          {title}
        </div>
        <div style={{
          fontSize: v ? 26 : 24, color: props.textColor, marginTop: 8,
          lineHeight: 1.5, opacity: 0.75,
        }}>
          {description}
        </div>
      </div>
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add templates/components/IconCard.tsx
git commit -m "refactor: IconCard uses Icon component"
```

---

## Task 7: Update FeatureGrid Component

**Files:**
- Modify: `templates/components/FeatureGrid.tsx`

**Step 1: Replace emoji rendering with Icon component**

Replace entire file:

```typescript
import type { VideoProps } from "../Root";
import { useEntrance } from "./animations";
import { Icon } from "./Icon";

export const FeatureGrid = ({
  props,
  items,
  columns = 3,
  delay = 0,
}: {
  props: VideoProps;
  items: { icon: string; title: string; description: string }[];
  columns?: 2 | 3;
  delay?: number;
}) => {
  const v = props.orientation === "vertical";
  const cols = v ? 1 : columns;
  const iconAnim = props.iconAnimation === "none" ? "none" : "entrance";

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: v ? 24 : 28, width: "100%",
    }}>
      {items.map((item, i) => {
        const a = useEntrance(props.enableAnimations, delay + i * 5, "snappy");
        const itemDelay = delay + i * 5;
        return (
          <div key={i} style={{
            flex: `0 0 calc(${100 / cols}% - ${(v ? 24 : 28) * (cols - 1) / cols}px)`,
            background: `linear-gradient(135deg, rgba(255,255,255,0.9), ${props.primaryColor}06)`,
            border: `1px solid ${props.primaryColor}18`,
            borderRadius: 24,
            padding: v ? "32px 36px" : "36px 32px",
            textAlign: v ? "left" : "center",
            display: v ? "flex" : undefined, alignItems: v ? "center" : undefined, gap: v ? 24 : undefined,
            boxShadow: `0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)`,
            opacity: a.opacity, transform: `translateY(${a.translateY}px)`,
          }}>
            <div style={{
              marginBottom: v ? 0 : 16, flexShrink: 0,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}>
              <Icon name={item.icon} size={v ? 48 : 56} color={props.primaryColor} animate={iconAnim} delay={itemDelay} />
            </div>
            <div>
              <div style={{ fontSize: v ? 34 : 32, fontWeight: 700, color: props.primaryColor, marginBottom: 8 }}>
                {item.title}
              </div>
              <div style={{ fontSize: v ? 26 : 24, color: props.textColor, lineHeight: 1.5, opacity: 0.75 }}>
                {item.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add templates/components/FeatureGrid.tsx
git commit -m "refactor: FeatureGrid uses Icon component"
```

---

## Task 8: Update FlowChart Component

**Files:**
- Modify: `templates/components/FlowChart.tsx`

**Step 1: Read current file**

Check current implementation before modifying.

**Step 2: Add Icon import and replace emoji rendering**

Add import at top:
```typescript
import { Icon } from "./Icon";
```

Replace the icon rendering line (around line 34):
```typescript
// Before:
{step.icon && <div style={{ fontSize: v ? 44 : 48, marginBottom: 12 }}>{step.icon}</div>}

// After:
{step.icon && (
  <div style={{ marginBottom: 12 }}>
    <Icon name={step.icon} size={v ? 44 : 48} color={props.primaryColor} animate={iconAnim} delay={delay + i * 8} />
  </div>
)}
```

Add `iconAnim` variable after `const v = ...`:
```typescript
const iconAnim = props.iconAnimation === "none" ? "none" : "entrance";
```

**Step 3: Commit**

```bash
git add templates/components/FlowChart.tsx
git commit -m "refactor: FlowChart uses Icon component"
```

---

## Task 9: Update StatCounter Component

**Files:**
- Modify: `templates/components/StatCounter.tsx`

**Step 1: Read current file**

Check current implementation before modifying.

**Step 2: Add Icon import and replace emoji rendering**

Add import at top:
```typescript
import { Icon } from "./Icon";
```

Replace the icon rendering line (around line 33):
```typescript
// Before:
{item.icon && <div style={{ fontSize: v ? 48 : 52, marginBottom: 12 }}>{item.icon}</div>}

// After:
{item.icon && (
  <div style={{ marginBottom: 12 }}>
    <Icon name={item.icon} size={v ? 48 : 52} color={props.primaryColor} animate={iconAnim} delay={delay + i * 6} />
  </div>
)}
```

Add `iconAnim` variable after component props destructuring:
```typescript
const iconAnim = props.iconAnimation === "none" ? "none" : "entrance";
```

**Step 3: Commit**

```bash
git add templates/components/StatCounter.tsx
git commit -m "refactor: StatCounter uses Icon component"
```

---

## Task 10: Update Video.tsx Defaults

**Files:**
- Modify: `templates/Video.tsx`

**Step 1: Update default icon names in example sections**

Find and replace emoji defaults with semantic names:

```typescript
// Around line 133-136, change:
{ icon: "💡", title: "要点一" }  →  { icon: "lightbulb", title: "要点一" }
{ icon: "🎯", title: "要点二" }  →  { icon: "target", title: "要点二" }
{ icon: "✅", title: "要点三" }  →  { icon: "check-circle", title: "要点三" }

// Around line 221-223, change (outro section):
{ icon: "👍", text: "点赞" }  →  { icon: "thumbs-up", text: "点赞" }
{ icon: "⭐", text: "收藏" }  →  { icon: "star", text: "收藏" }
{ icon: "🔔", text: "关注" }  →  { icon: "bell", text: "关注" }
```

**Step 2: Update outro icon rendering (around line 226)**

```typescript
// Before:
<div style={{ fontSize: v ? 80 : 64 }}>{item.icon}</div>

// After:
import { Icon } from "./components";
// Then in render:
<Icon name={item.icon} size={v ? 80 : 64} color={props.accentColor} animate="bounce" delay={i * 10} />
```

**Step 3: Commit**

```bash
git add templates/Video.tsx
git commit -m "refactor: Video.tsx uses semantic icon names"
```

---

## Task 11: Update CLAUDE.md Documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add Icon System section**

Add after "### Template Architecture" section:

```markdown
### Icon System

- **Semantic names**: Use `"rocket"`, `"check"`, `"lightbulb"` — auto-resolved to Lucide SVG
- **Emoji fallback**: `"🚀"` still works — detected and rendered directly
- **Available icons**: See `templates/components/iconMap.ts` for full list (~80 icons)
- **Props**: `iconStyle` ("lucide"/"emoji"/"mixed"), `iconAnimation` ("entrance"/"none")

Common semantic names:
| Category | Names |
|----------|-------|
| Actions | rocket, check, x, plus, play, pause |
| Objects | lightbulb, target, star, heart, trophy, zap |
| Tech | code, terminal, database, server, cloud, cpu |
| Media | video, music, mic, camera |
| Social | thumbs-up, star, bell, share, bookmark |
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add icon system documentation to CLAUDE.md"
```

---

## Task 12: Final Verification

**Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Test in Remotion Studio**

Run: `npx remotion studio src/remotion/index.ts`
Expected: Icons render as SVG, animations work

**Step 3: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: icon system adjustments from testing"
```

---

## Summary

| Task | Files | Commits |
|------|-------|---------|
| 1 | package.json | chore: add lucide-react |
| 2 | iconMap.ts | feat: add icon mapping |
| 3 | Icon.tsx | feat: add Icon component |
| 4 | index.ts | feat: export Icon |
| 5 | Root.tsx | feat: add icon props |
| 6 | IconCard.tsx | refactor: use Icon |
| 7 | FeatureGrid.tsx | refactor: use Icon |
| 8 | FlowChart.tsx | refactor: use Icon |
| 9 | StatCounter.tsx | refactor: use Icon |
| 10 | Video.tsx | refactor: semantic names |
| 11 | CLAUDE.md | docs: icon system |
| 12 | — | verification |
