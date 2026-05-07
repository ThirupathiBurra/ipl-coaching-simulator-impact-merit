import { useRef, useCallback } from "react";
import clsx from "clsx";

// Fielder status types
export const STATUS = {
  NORMAL:    "normal",    // default
  SELECTED:  "selected",  // currently dragging or clicked
  CAPTAIN:   "captain",   // only in captain's field
  USER_ONLY: "user_only", // only in user's field
  SHARED:    "shared",    // in both fields
  REMOVED:   "removed",   // not placed
};

const STATUS_STYLES = {
  normal:   { fill: "#00E5FF", stroke: "#00E5FF", textFill: "#062030", glow: "url(#glowCyan)",   ring: "rgba(0,229,255,0.3)"  },
  selected: { fill: "#FFD600", stroke: "#FFD600", textFill: "#1a1000", glow: "url(#glowGold)",   ring: "rgba(255,214,0,0.5)"  },
  captain:  { fill: "#FF9100", stroke: "#FF9100", textFill: "#1a0800", glow: "url(#glowGold)",   ring: "rgba(255,145,0,0.4)"  },
  user_only:{ fill: "#76FF03", stroke: "#76FF03", textFill: "#0a1600", glow: "url(#glowCyan)",   ring: "rgba(118,255,3,0.4)"  },
  shared:   { fill: "#00E5FF", stroke: "#00E5FF", textFill: "#062030", glow: "url(#glowCyan)",   ring: "rgba(0,229,255,0.3)"  },
  removed:  { fill: "transparent", stroke: "rgba(255,255,255,0.15)", textFill: "rgba(255,255,255,0.2)", glow: "none", ring: "transparent" },
};

export default function Fielder({
  id, x, y, label, status = STATUS.NORMAL,
  isDragging, isActive,
  onPointerDown, onPointerEnter, onPointerLeave,
  showLabel = true,
}) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.normal;
  const r = status === STATUS.SELECTED ? 10 : 8;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onPointerDown={(e) => onPointerDown?.(e, id)}
      onPointerEnter={() => onPointerEnter?.(id)}
      onPointerLeave={() => onPointerLeave?.(id)}
      style={{ cursor: isDragging ? "grabbing" : "grab", userSelect: "none" }}
    >
      {/* Pulse ring (active/selected) */}
      {(status === STATUS.SELECTED || isActive) && (
        <circle r={r + 5} fill="none" stroke={style.ring} strokeWidth={1.5} opacity={0.7}>
          <animate attributeName="r"    from={r + 3} to={r + 10} dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from={0.7} to={0}     dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Shadow */}
      <circle r={r + 1} fill="rgba(0,0,0,0.4)" cy={2} />

      {/* Main dot */}
      <circle
        r={r}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={status === STATUS.SELECTED ? 2 : 1.5}
        filter={style.glow}
        opacity={status === STATUS.REMOVED ? 0.35 : 1}
        style={{ transition: isDragging ? "none" : "r 0.2s, fill 0.25s" }}
      />

      {/* Initials inside */}
      {status !== STATUS.REMOVED && (
        <text
          textAnchor="middle" dominantBaseline="central"
          fontSize={r > 9 ? 5 : 4.5} fontWeight="800"
          fill={style.textFill} fontFamily="'JetBrains Mono', monospace"
          style={{ pointerEvents: "none" }}
        >
          {label.substring(0, 2).toUpperCase()}
        </text>
      )}

      {/* Position label */}
      {showLabel && status !== STATUS.REMOVED && (
        <text
          y={r + 8} textAnchor="middle"
          fontSize={6} fill="rgba(255,255,255,0.65)" fontFamily="Inter, sans-serif"
          style={{ pointerEvents: "none" }}
        >
          {label}
        </text>
      )}

      {/* Status badge (compare mode) */}
      {status === STATUS.CAPTAIN && (
        <text x={r + 1} y={-r} fontSize={5} fill="#FFD600" style={{ pointerEvents: "none" }}>👑</text>
      )}
      {status === STATUS.USER_ONLY && (
        <text x={r + 1} y={-r} fontSize={5} fill="#76FF03" style={{ pointerEvents: "none" }}>✓</text>
      )}
    </g>
  );
}
