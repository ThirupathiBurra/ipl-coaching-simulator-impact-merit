import { useDecisionStore } from "@store/decisionStore";
import { BOWLER_STATS } from "@data/matchData";
import { Zap, Check } from "lucide-react";
import clsx from "clsx";

const FORM_CONFIG = {
  Good:    { color: "text-neon-green",  dot: "bg-neon-green",  badge: "bg-neon-green/15  border-neon-green/30"  },
  Average: { color: "text-neon-gold",   dot: "bg-neon-gold",   badge: "bg-neon-gold/15   border-neon-gold/30"   },
  Poor:    { color: "text-neon-red",    dot: "bg-neon-red",    badge: "bg-neon-red/15    border-neon-red/30"    },
};

function EconomyBar({ economy }) {
  // 6=great, 10=average, 14=poor
  const pct   = Math.min(100, (economy / 14) * 100);
  const color = economy <= 7 ? "bg-neon-green" : economy <= 10 ? "bg-neon-gold" : "bg-neon-red";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
        <div className={clsx("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono text-white/40 w-8 text-right">{economy}</span>
    </div>
  );
}

export default function EnhancedBowlerPanel({ className }) {
  const { selectedBowler, selectBowler } = useDecisionStore();

  return (
    <div className={clsx("space-y-3", className)}>
      <div>
        <div className="section-title flex items-center gap-2"><Zap size={14} className="text-neon-purple" /> Bowling Change</div>
        <div className="section-subtitle">Select your choice for the next over</div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar pr-1">
        {BOWLER_STATS.map((bowler) => {
          const isSelected = selectedBowler === bowler.id;
          const formCfg    = FORM_CONFIG[bowler.recentForm];
          const oversLeft  = 4 - Math.floor(bowler.overs);
          const canBowl    = oversLeft > 0;

          return (
            <button
              key={bowler.id}
              disabled={!canBowl}
              onClick={() => selectBowler(isSelected ? null : bowler.id)}
              className={clsx(
                "w-full text-left p-3 rounded-xl border transition-all duration-200",
                isSelected
                  ? "bg-neon-purple/15 border-neon-purple/50 shadow-[0_0_12px_rgba(170,0,255,0.2)]"
                  : canBowl
                  ? "bg-surface-2 border-white/8 hover:border-white/20 hover:bg-white/5"
                  : "bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Selection indicator */}
                <div className={clsx(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                  isSelected ? "bg-neon-purple border-neon-purple" : "border-white/20"
                )}>
                  {isSelected && <Check size={10} className="text-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={clsx("text-sm font-semibold", isSelected ? "text-white" : "text-white/80")}>{bowler.name}</span>
                      {bowler.isCurrentBowler && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/25 uppercase tracking-wider">Bowling</span>
                      )}
                    </div>
                    <div className={clsx("flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border", formCfg.badge, formCfg.color)}>
                      <span className={clsx("w-1.5 h-1.5 rounded-full", formCfg.dot)} />
                      {bowler.recentForm}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-3 mt-1.5 text-[11px] font-mono text-white/50">
                    <span>{bowler.overs}ov</span>
                    <span>{bowler.runs}r</span>
                    <span className={bowler.wickets > 0 ? "text-neon-green" : ""}>{bowler.wickets}W</span>
                    <span className="ml-auto text-[10px]">{oversLeft}ov left</span>
                  </div>

                  {/* Economy bar */}
                  <div className="mt-2">
                    <div className="text-[9px] text-white/25 mb-1">Economy</div>
                    <EconomyBar economy={bowler.economy} />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedBowler && (
        <div className="p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/25 text-xs text-white/70 animate-fade-in">
          ✅ <span className="font-semibold text-neon-purple">{BOWLER_STATS.find((b) => b.id === selectedBowler)?.name}</span> selected for next over
        </div>
      )}
    </div>
  );
}
