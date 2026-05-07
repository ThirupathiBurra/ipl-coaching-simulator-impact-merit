import { useState } from "react";
import { useDecisionStore } from "@store/decisionStore";
import { FIELD_POSITIONS } from "@data/matchData";
import { Users, Info, RotateCcw, Maximize2 } from "lucide-react";
import clsx from "clsx";

// Preset field setups
const PRESETS = {
  "Attacking": ["slip", "gully", "point", "cover", "mid-off", "mid-on", "mid-wicket", "square-leg", "fine-leg", "third-man"],
  "Defensive": ["third-man", "deep-cover", "long-off", "long-on", "deep-sq-leg", "deep-midwicket", "cow-corner", "mid-off", "mid-on", "mid-wicket"],
  "Death":     ["third-man", "long-off", "long-on", "deep-sq-leg", "deep-midwicket", "cow-corner", "deep-cover", "mid-off", "mid-on", "mid-wicket"],
};

const ZONE_COLORS = {
  off: "#00E5FF",
  leg: "#AA00FF",
};

export default function EnhancedFieldingMap({ readOnly = false, className }) {
  const { fieldPlacement, toggleFieldPosition } = useDecisionStore();
  const [hovered, setHovered] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const active = fieldPlacement.activePositions;

  function applyPreset(name) {
    const preset = PRESETS[name];
    // Reset all, then apply preset via store
    preset.forEach((posId) => {
      if (!active.includes(posId)) toggleFieldPosition(posId);
    });
    active.forEach((posId) => {
      if (!preset.includes(posId)) toggleFieldPosition(posId);
    });
    setSelectedPreset(name);
  }

  const hoveredPos = FIELD_POSITIONS.find((p) => p.id === hovered);

  return (
    <div className={clsx("glass-card p-4 flex flex-col gap-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="section-title">Field Placement</div>
          <div className="section-subtitle text-xs">
            {readOnly ? "Captain's current field" : `${active.length}/11 fielders • Click position to toggle`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={clsx(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            active.length === 11 ? "text-neon-green bg-neon-green/10 border border-neon-green/25" : "text-neon-gold bg-neon-gold/10 border border-neon-gold/25"
          )}>
            <Users size={11} />
            {active.length}/11
          </div>
        </div>
      </div>

      {/* Preset buttons */}
      {!readOnly && (
        <div className="flex gap-1.5">
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              onClick={() => applyPreset(name)}
              className={clsx(
                "text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all duration-200",
                selectedPreset === name
                  ? "bg-neon-cyan text-navy-950 border-neon-cyan"
                  : "border-white/10 text-white/40 hover:text-white hover:border-white/30"
              )}
            >
              {name}
            </button>
          ))}
          <button
            onClick={() => { active.forEach((p) => toggleFieldPosition(p)); setSelectedPreset(null); }}
            className="ml-auto btn-icon p-1.5 text-white/30 hover:text-white"
            title="Reset field"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      )}

      {/* Cricket Oval SVG */}
      <div className="relative w-full" style={{ paddingBottom: "85%" }}>
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 88" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="groundGrad" cx="50%" cy="50%">
                <stop offset="0%"   stopColor="#0f2b0f" />
                <stop offset="70%"  stopColor="#0a1f0a" />
                <stop offset="100%" stopColor="#071507" />
              </radialGradient>
              <filter id="glow-cyan">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Ground */}
            <ellipse cx="50" cy="44" rx="48" ry="42" fill="url(#groundGrad)" stroke="rgba(0,230,118,0.18)" strokeWidth="0.4" />

            {/* 30-yard inner ring */}
            <ellipse cx="50" cy="44" rx="28" ry="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" strokeDasharray="2 1.5" />

            {/* Pitch */}
            <rect x="46.5" y="33" width="7" height="22" rx="0.5" fill="#c8a96e" opacity="0.55" />

            {/* Crease lines */}
            <line x1="44" y1="37.5" x2="56" y2="37.5" stroke="white" strokeWidth="0.35" opacity="0.5" />
            <line x1="44" y1="52.5" x2="56" y2="52.5" stroke="white" strokeWidth="0.35" opacity="0.5" />

            {/* Stumps */}
            <g opacity="0.85">
              <rect x="49.2" y="36.2" width="1.6" height="1.5" rx="0.2" fill="white" />
              <rect x="49.2" y="50.5" width="1.6" height="1.5" rx="0.2" fill="white" />
            </g>

            {/* Wicketkeeper */}
            <circle cx="50" cy="56" r="1.2" fill="rgba(0,229,255,0.45)" stroke="rgba(0,229,255,0.7)" strokeWidth="0.4" />
            <text x="50" y="59.5" textAnchor="middle" fontSize="2" fill="rgba(0,229,255,0.5)">WK</text>

            {/* Bowler end label */}
            <text x="50" y="30" textAnchor="middle" fontSize="2" fill="rgba(255,255,255,0.2)">BOWL</text>
          </svg>

          {/* Fielder dots */}
          {FIELD_POSITIONS.map((pos) => {
            const isActive = active.includes(pos.id);
            const isHov    = hovered === pos.id;
            const dotColor = isActive ? ZONE_COLORS[pos.zone] : "transparent";

            return (
              <button
                key={pos.id}
                disabled={readOnly}
                onClick={() => !readOnly && toggleFieldPosition(pos.id)}
                onMouseEnter={() => setHovered(pos.id)}
                onMouseLeave={() => setHovered(null)}
                className={clsx(
                  "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10",
                  !readOnly && "cursor-pointer",
                  isHov && "z-20"
                )}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                title={pos.label}
              >
                <div className={clsx(
                  "rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  isActive ? "w-5 h-5 shadow-lg" : "w-4 h-4",
                  isHov && "scale-150"
                )} style={{
                  background: isActive ? dotColor : "transparent",
                  borderColor: isActive ? dotColor : "rgba(255,255,255,0.2)",
                  boxShadow: isActive && isHov ? `0 0 12px ${dotColor}` : isActive ? `0 0 6px ${dotColor}88` : "none",
                }} />
              </button>
            );
          })}

          {/* Tooltip */}
          {hoveredPos && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-navy-900/95 border border-white/10 text-[11px] text-white font-medium pointer-events-none z-30 whitespace-nowrap shadow-lg">
              {hoveredPos.label}
              <span className="ml-1.5 text-white/30">{active.includes(hoveredPos.id) ? "(active)" : "(click to place)"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      {!readOnly && (
        <div className="flex items-center gap-4 text-[10px] text-white/35 border-t border-white/[0.06] pt-2">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-neon-cyan inline-block" /> Off-side</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-neon-purple inline-block" /> Leg-side</div>
          <div className="flex items-center gap-1 ml-auto"><Info size={10} /> Max 11 fielders</div>
        </div>
      )}
    </div>
  );
}
