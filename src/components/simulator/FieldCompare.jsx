import { FIELD_PRESETS, DEFAULT_POSITIONS, computeDiff, computeCoverage } from "@data/fieldPositions";
import { Crown, User, CheckCircle2, XCircle, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

function DiffBadge({ type }) {
  if (type === "shared")     return <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/25 font-bold">MATCH</span>;
  if (type === "user_only")  return <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-green/15 text-neon-green border border-neon-green/25 font-bold">YOURS</span>;
  if (type === "captain_only") return <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-gold/15 text-neon-gold border border-neon-gold/25 font-bold">CAPTAIN</span>;
  return null;
}

export default function FieldCompare({ userActive, className }) {
  const [open, setOpen] = useState(false);

  const captainPreset  = FIELD_PRESETS.captainSetup;
  const captainActive  = captainPreset.active;
  const { onlyUser, onlyCaptain, shared, matchScore } = computeDiff(userActive, captainActive);

  const userCoverage    = computeCoverage(userActive);
  const captainCoverage = computeCoverage(captainActive);

  const allPositionIds = [...new Set([...userActive, ...captainActive])];

  const scoreColor = matchScore >= 80 ? "text-neon-green" : matchScore >= 60 ? "text-neon-gold" : "text-neon-red";
  const scoreBg    = matchScore >= 80 ? "bg-neon-green/10 border-neon-green/30" : matchScore >= 60 ? "bg-neon-gold/10 border-neon-gold/30" : "bg-neon-red/10 border-neon-red/30";

  return (
    <div className={clsx("glass-card border-neon-cyan/15 overflow-hidden", className)}>
      {/* Toggle Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
      >
        <Crown size={14} className="text-neon-gold" />
        <div className="flex-1 text-left">
          <span className="text-sm font-bold text-white">Compare with Captain's Field</span>
          <div className="text-[10px] text-white/35 mt-0.5">Bumrah's setup vs. your field placement</div>
        </div>
        <div className={clsx("flex items-center gap-1.5 text-sm font-black px-3 py-1 rounded-full border", scoreBg, scoreColor)}>
          {matchScore}% match
        </div>
        {open ? <ChevronUp size={15} className="text-white/30" /> : <ChevronDown size={15} className="text-white/30" />}
      </button>

      {/* Expanded Content */}
      {open && (
        <div className="border-t border-white/[0.06] p-4 space-y-4 animate-fade-in">

          {/* Diff summary chips */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Matching",         count: shared.length,      color: "text-neon-cyan",  icon: CheckCircle2 },
              { label: "Only yours",        count: onlyUser.length,    color: "text-neon-green", icon: User         },
              { label: "Only captain's",    count: onlyCaptain.length, color: "text-neon-gold",  icon: Crown        },
            ].map(({ label, count, color, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-surface-2 border border-white/[0.06]">
                <Icon size={14} className={color} />
                <div className={clsx("text-xl font-black font-mono", color)}>{count}</div>
                <div className="text-[9px] text-white/35 text-center">{label}</div>
              </div>
            ))}
          </div>

          {/* Zone coverage comparison table */}
          <div>
            <div className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Zone Coverage</div>
            <div className="space-y-2">
              {[
                { label: "Off infield",  color: "#00E5FF" },
                { label: "Leg infield",  color: "#AA00FF" },
                { label: "Off boundary", color: "#2979FF" },
                { label: "Leg boundary", color: "#FF6D00" },
              ].map(({ label, color }, i) => {
                const key = Object.keys(userCoverage)[i];
                const uPct = userCoverage[key];
                const cPct = captainCoverage[key];
                const diff = uPct - cPct;
                return (
                  <div key={label} className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center text-[11px]">
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${uPct}%`, background: color }} />
                    </div>
                    <span className="text-[10px] text-white/35 w-16 text-center">{label}</span>
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div className="h-full rounded-full bg-neon-gold opacity-70" style={{ width: `${cPct}%` }} />
                    </div>
                    <span className={clsx("font-mono text-[10px] w-8 text-right", diff > 0 ? "text-neon-green" : diff < 0 ? "text-neon-red" : "text-white/30")}>
                      {diff > 0 ? `+${diff}` : diff}%
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] text-white/25 mt-1.5 px-0">
              <span className="flex items-center gap-1"><span className="w-2 h-0.5 rounded bg-neon-cyan inline-block" /> Yours</span>
              <span className="flex items-center gap-1"><span className="w-2 h-0.5 rounded bg-neon-gold inline-block" /> Captain</span>
            </div>
          </div>

          {/* Position-by-position list */}
          <div>
            <div className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Position Detail</div>
            <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
              {allPositionIds.map((posId) => {
                const pos    = DEFAULT_POSITIONS[posId];
                const inUser = userActive.includes(posId);
                const inCap  = captainActive.includes(posId);
                const type   = inUser && inCap ? "shared" : inUser ? "user_only" : "captain_only";
                return (
                  <div key={posId} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                    <span className="text-xs text-white/60">{pos?.label ?? posId}</span>
                    <DiffBadge type={type} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tactical verdict */}
          <div className={clsx("p-3 rounded-xl border text-xs", scoreBg)}>
            <span className={clsx("font-bold block mb-0.5", scoreColor)}>
              {matchScore >= 80 ? "🎯 Excellent match! Your field mirrors the captain's." : matchScore >= 60 ? "📊 Similar thinking — a few positions differ." : "🔄 Different approach — study captain's reasoning."}
            </span>
            <span className="text-white/45 leading-relaxed">
              {onlyCaptain.length > 0 && `Captain placed: ${onlyCaptain.map((id) => DEFAULT_POSITIONS[id]?.label).join(", ")}.`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
