import { useState } from "react";
import { useMatchStore } from "@store/matchStore";
import { AI_INSIGHTS } from "@data/aiInsightsData";
import { BrainCircuit, ChevronRight, CheckCircle2, Zap, Shield, Target } from "lucide-react";
import clsx from "clsx";

const TACTIC_ICONS = {
  FIELD_PLACEMENT: Target,
  BOWLING_CHANGE:  Zap,
  TACTICAL:        Shield,
  BATTING_PATTERN: BrainCircuit,
};

export default function TacticalInsights({ onApply, className }) {
  const [applied, setApplied] = useState([]);
  const addNotif = useMatchStore((s) => s.addNotification);

  function handleApply(insight) {
    setApplied((p) => [...p, insight.id]);
    onApply?.(insight);
    addNotif({ type: "info", title: "Insight Applied!", message: insight.title });
  }

  return (
    <div className={clsx("glass-card p-4 flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit size={15} className="text-neon-cyan" />
          <div className="section-title">Tactical Insights</div>
        </div>
        <span className="text-[10px] text-white/30">{AI_INSIGHTS.length} available</span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
        {AI_INSIGHTS.map((insight) => {
          const isApplied = applied.includes(insight.id);
          const Icon = TACTIC_ICONS[insight.category] || BrainCircuit;
          const confColor = insight.confidence >= 90 ? "text-neon-green" : insight.confidence >= 75 ? "text-neon-gold" : "text-white/50";

          return (
            <div
              key={insight.id}
              className={clsx(
                "p-3 rounded-xl border transition-all duration-200",
                isApplied
                  ? "bg-neon-green/8 border-neon-green/25"
                  : "bg-surface-2 border-white/8 hover:border-white/20"
              )}
            >
              <div className="flex items-start gap-2.5">
                <div className={clsx(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                  isApplied ? "bg-neon-green/15" : "bg-white/5"
                )}>
                  {isApplied ? <CheckCircle2 size={14} className="text-neon-green" /> : <Icon size={14} className="text-neon-cyan" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold text-white truncate">{insight.title}</span>
                    <span className={clsx("text-[10px] font-mono font-black shrink-0", confColor)}>{insight.confidence}%</span>
                  </div>
                  <p className="text-[11px] text-white/45 leading-relaxed line-clamp-2">{insight.description}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-neon-cyan/60 font-mono">+{insight.imsImpact} IMS</span>
                    <button
                      onClick={() => handleApply(insight)}
                      disabled={isApplied}
                      className={clsx(
                        "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all",
                        isApplied
                          ? "text-neon-green/60 cursor-default"
                          : "text-neon-cyan hover:bg-neon-cyan/15 border border-neon-cyan/25 hover:border-neon-cyan/50"
                      )}
                    >
                      {isApplied ? "Applied ✓" : <>Apply <ChevronRight size={10} /></>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
