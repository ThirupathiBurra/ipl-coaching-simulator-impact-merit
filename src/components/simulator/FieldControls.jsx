import { FIELD_PRESETS, GROUND, computeCoverage } from "@data/fieldPositions";
import { RotateCcw, Save, Download, Info, CheckCircle2, Zap } from "lucide-react";
import clsx from "clsx";

// ─── Preset Button ─────────────────────────────────────────────────────────────
function PresetBtn({ preset, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 group",
        isActive
          ? "border-opacity-60 shadow-lg"
          : "bg-white/[0.03] border-white/8 hover:border-white/20 hover:bg-white/[0.06]"
      )}
      style={isActive ? { borderColor: preset.color, background: `${preset.color}18`, boxShadow: `0 0 16px ${preset.color}25` } : {}}
    >
      <span className="text-xl shrink-0">{preset.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={clsx("text-sm font-bold", isActive ? "text-white" : "text-white/70")}>{preset.name}</span>
          {isActive && <CheckCircle2 size={12} style={{ color: preset.color }} />}
        </div>
        <p className="text-[10px] text-white/35 leading-relaxed mt-0.5">{preset.description}</p>
      </div>
    </button>
  );
}

// ─── Coverage Bar ──────────────────────────────────────────────────────────────
function CoverageBar({ label, pct, color }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-0.5">
        <span className="text-white/40">{label}</span>
        <span className="font-mono font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Field Controls Panel ─────────────────────────────────────────────────────
export default function FieldControls({
  activeIds, activePreset, onPresetApply, onReset, onSave,
  fielderCount = 11,
}) {
  const coverage = computeCoverage(activeIds);

  const coverageItems = [
    { label: "Off-side infield",  pct: coverage.offSideInfield,  color: "#00E5FF" },
    { label: "Leg-side infield",  pct: coverage.legSideInfield,  color: "#AA00FF" },
    { label: "Off-side boundary", pct: coverage.offSideBoundary, color: "#2979FF" },
    { label: "Leg-side boundary", pct: coverage.legSideBoundary, color: "#FF6D00" },
  ];

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="section-title text-base">Tactical Presets</div>
          <div className="section-subtitle text-xs">Apply a formation or drag fielders</div>
        </div>
        <div className={clsx(
          "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border",
          fielderCount === 11 ? "text-neon-green bg-neon-green/10 border-neon-green/30" : "text-neon-gold bg-neon-gold/10 border-neon-gold/30"
        )}>
          {fielderCount}/11
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-1.5">
        {Object.entries(FIELD_PRESETS).map(([key, preset]) => (
          <PresetBtn
            key={key}
            preset={preset}
            isActive={activePreset === key}
            onClick={() => onPresetApply(key)}
          />
        ))}
      </div>

      {/* Coverage Analysis */}
      <div className="glass-card p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-white/60">
          <Zap size={12} className="text-neon-cyan" />
          Coverage Analysis
        </div>
        {coverageItems.map(({ label, pct, color }) => (
          <CoverageBar key={label} label={label} pct={pct} color={color} />
        ))}
        {/* Overall score */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <span className="text-white/40">Overall Coverage</span>
          <span className="font-mono font-black text-neon-cyan">
            {Math.round(Object.values(coverage).reduce((a, b) => a + b, 0) / 4)}%
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={onReset} className="btn-ghost flex-1 text-xs py-2.5 border border-white/10">
          <RotateCcw size={13} /> Reset
        </button>
        <button onClick={onSave} className="btn-secondary flex-1 text-xs py-2.5">
          <Save size={13} /> Save Setup
        </button>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-neon-cyan/5 border border-neon-cyan/12 text-[10px] text-white/40 leading-relaxed">
        <Info size={11} className="text-neon-cyan/50 shrink-0 mt-0.5" />
        Drag any fielder to a new position. Blue = off-side, purple = leg-side. WK cannot be moved.
      </div>
    </div>
  );
}
