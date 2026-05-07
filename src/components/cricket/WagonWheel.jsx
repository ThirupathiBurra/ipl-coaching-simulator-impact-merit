import { useState } from "react";
import { useMatchStore } from "@store/matchStore";
import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

// Simulated wagon-wheel shot data
const SHOT_DATA = [
  { angle: 35,  dist: 0.85, type: "six",  label: "6" },
  { angle: 50,  dist: 0.55, type: "four", label: "4" },
  { angle: 120, dist: 0.70, type: "single", label: "1" },
  { angle: 155, dist: 0.45, type: "single", label: "1" },
  { angle: 200, dist: 0.60, type: "dot",  label: "·" },
  { angle: 240, dist: 0.80, type: "six",  label: "6" },
  { angle: 270, dist: 0.65, type: "four", label: "4" },
  { angle: 310, dist: 0.50, type: "single", label: "1" },
  { angle: 330, dist: 0.90, type: "four", label: "4" },
  { angle: 10,  dist: 0.75, type: "wicket", label: "W" },
];

const TYPE_CONFIG = {
  six:    { color: "#AA00FF", r: 5 },
  four:   { color: "#2979FF", r: 4 },
  single: { color: "#00E5FF", r: 3 },
  dot:    { color: "rgba(255,255,255,0.2)", r: 2.5 },
  wicket: { color: "#FF1744", r: 5 },
};

function polarToXY(angleDeg, distPct, cx, cy, radius) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + radius * distPct * Math.cos(rad),
    y: cy + radius * distPct * Math.sin(rad),
  };
}

export default function WagonWheel({ className }) {
  const [hovered, setHovered] = useState(null);
  const match = useMatchStore((s) => s.liveMatch);
  const batter = match?.currentBatsmen?.[0];

  const cx = 110, cy = 110, r = 95;

  return (
    <div className={clsx("glass-card p-4 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="section-title">Wagon Wheel</div>
          <div className="section-subtitle">{batter?.name ?? "Batsman"} — Shot Map</div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {[
            { color: "#AA00FF", label: "6s" },
            { color: "#2979FF", label: "4s" },
            { color: "#00E5FF", label: "1s/2s" },
            { color: "#FF1744", label: "W" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
              <span className="text-white/50">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <svg viewBox="0 0 220 220" width={220} height={220} className="overflow-visible">
          {/* Ground circle */}
          <ellipse cx={cx} cy={cy} rx={r} ry={r} fill="#0d1f0d" stroke="rgba(0,230,118,0.15)" strokeWidth={0.5} />
          {/* 30-yard inner circle */}
          <ellipse cx={cx} cy={cy} rx={r * 0.55} ry={r * 0.55} fill="none" stroke="rgba(0,230,118,0.12)" strokeWidth={0.4} strokeDasharray="3 2" />
          {/* Pitch */}
          <rect x={cx - 5} y={cy - 14} width={10} height={28} rx={1} fill="#c8a96e" opacity={0.5} />
          {/* Stumps */}
          <rect x={cx - 3} y={cy - 14} width={6} height={2} rx={0.3} fill="white" opacity={0.7} />
          <rect x={cx - 3} y={cy + 12} width={6} height={2} rx={0.3} fill="white" opacity={0.7} />

          {/* Shot lines */}
          {SHOT_DATA.map((shot, i) => {
            const { x, y } = polarToXY(shot.angle, shot.dist, cx, cy, r);
            const cfg = TYPE_CONFIG[shot.type];
            return (
              <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <line
                  x1={cx} y1={cy} x2={x} y2={y}
                  stroke={cfg.color}
                  strokeWidth={hovered === i ? 1.5 : 0.8}
                  opacity={hovered === i ? 0.9 : 0.45}
                />
                <circle
                  cx={x} cy={y} r={cfg.r}
                  fill={cfg.color}
                  opacity={hovered === i ? 1 : 0.75}
                  style={{ filter: hovered === i ? `drop-shadow(0 0 4px ${cfg.color})` : "none" }}
                />
                {/* Label bubble on hover */}
                {hovered === i && (
                  <text x={x} y={y - cfg.r - 4} textAnchor="middle" fontSize={9} fill="white" fontFamily="monospace" fontWeight="bold">
                    {shot.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stats Row */}
      {batter && (
        <div className="flex items-center justify-between px-2 py-2 rounded-xl bg-surface-2 text-xs font-mono">
          <span className="text-white/50">Runs {batter.runs}({batter.balls})</span>
          <span className="text-neon-blue">{batter.fours}x4</span>
          <span className="text-neon-purple">{batter.sixes}x6</span>
          <span className={clsx("font-bold", batter.sr >= 150 ? "text-neon-green" : batter.sr >= 120 ? "text-neon-gold" : "text-white/60")}>
            SR {batter.sr}
          </span>
        </div>
      )}
    </div>
  );
}
