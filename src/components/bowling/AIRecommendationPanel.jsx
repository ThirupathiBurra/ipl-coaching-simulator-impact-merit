import { useState } from "react";
import { AI_RECOMMENDATION, BOWLERS, MATCHUP_DATA } from "@data/bowlingData";
import { BrainCircuit, ChevronDown, ChevronUp, Target, TrendingDown, Activity, AlertTriangle } from "lucide-react";
import clsx from "clsx";

function OutcomeBar({ label, pct, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-white/40">{label}</span>
        <span className="font-mono font-black" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/8 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function WeaknessChip({ text }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neon-red/8 border border-neon-red/20 text-[11px] text-white/60">
      <TrendingDown size={10} className="text-neon-red shrink-0" />
      {text}
    </div>
  );
}

export default function AIRecommendationPanel({ selectedBowlerId, className }) {
  const [expanded, setExpanded] = useState(true);
  const ai = AI_RECOMMENDATION;
  const bowler = BOWLERS.find((b) => b.id === (selectedBowlerId || ai.recommendedId));
  const altBowler = BOWLERS.find((b) => b.id === ai.alternativeId);
  const { predictedOutcome, batterWeakness, reasoning } = ai;

  const riskColors = { LOW: "text-neon-green", MEDIUM: "text-neon-gold", HIGH: "text-neon-red" };
  const confColor = ai.confidence >= 80 ? "#00E676" : ai.confidence >= 65 ? "#FFD600" : "#FF9100";

  return (
    <div className={clsx("glass-card border-neon-cyan/15 overflow-hidden", className)}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-neon-cyan/5 to-transparent border-b border-white/[0.06] cursor-pointer"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="w-8 h-8 rounded-xl bg-neon-cyan/15 flex items-center justify-center shrink-0">
          <BrainCircuit size={16} className="text-neon-cyan" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white">Gemini AI Analysis</div>
          <div className="text-[10px] text-white/35 mt-0.5">Real-time bowling recommendation</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neon-green/30 bg-neon-green/10">
            <Activity size={10} className="text-neon-green animate-pulse" />
            <span className="text-[10px] text-neon-green font-bold">{ai.confidence}% confident</span>
          </div>
          {expanded ? <ChevronUp size={15} className="text-white/30" /> : <ChevronDown size={15} className="text-white/30" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4 animate-fade-in">

          {/* Recommended bowler callout */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-neon-gold/8 border border-neon-gold/25">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
              style={{ background: `${bowler?.color}30`, color: bowler?.color, border: `1px solid ${bowler?.color}40` }}
            >
              {bowler?.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{bowler?.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-gold/15 border border-neon-gold/30 text-neon-gold font-bold">
                  {selectedBowlerId && selectedBowlerId !== ai.recommendedId ? "Your pick" : "AI Recommended"}
                </span>
              </div>
              <div className="text-[11px] text-white/40 mt-0.5">{bowler?.style} · {bowler?.match.wickets}W today · Eco {bowler?.match.economy}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-mono font-black text-lg" style={{ color: confColor }}>{bowler?.rating}</div>
              <div className="text-[9px] text-white/30">Rating</div>
            </div>
          </div>

          {/* Risk + Alternative */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="text-[9px] text-white/30 uppercase tracking-wider">Risk Level</div>
              <div className={clsx("text-sm font-black flex items-center gap-1.5", riskColors[ai.riskLevel])}>
                <AlertTriangle size={13} />
                {ai.riskLevel}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="text-[9px] text-white/30 uppercase tracking-wider">Alternative</div>
              <div className="text-sm font-semibold text-white/70">{altBowler?.shortName}</div>
              <div className="text-[9px] text-white/30">{ai.alternativeNote.substring(0, 40)}…</div>
            </div>
          </div>

          {/* Predicted outcome bars */}
          <div className="space-y-2.5">
            <div className="text-[10px] text-white/35 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Target size={11} className="text-neon-cyan" /> Predicted Next Over
            </div>
            <OutcomeBar label="Wicket probability"  pct={predictedOutcome.wicketProb}   color="#00E676" />
            <OutcomeBar label="Dot ball probability" pct={predictedOutcome.dotBallProb}  color="#00E5FF" />
            <OutcomeBar label="Boundary probability" pct={predictedOutcome.boundaryProb} color="#FF9100" />
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.05]">
              <span className="text-white/35">Expected runs/over</span>
              <span className="font-mono font-black text-neon-gold">{predictedOutcome.expectedRuns}</span>
            </div>
          </div>

          {/* Batter weaknesses */}
          <div className="space-y-2">
            <div className="text-[10px] text-white/35 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <TrendingDown size={11} className="text-neon-red" /> Batter Weaknesses
            </div>
            {Object.entries(batterWeakness).map(([batter, weaknesses]) => (
              <div key={batter}>
                <div className="text-[10px] text-neon-cyan/60 font-bold mb-1.5">{batter}</div>
                <div className="flex flex-wrap gap-1.5">
                  {weaknesses.map((w) => <WeaknessChip key={w} text={w} />)}
                </div>
              </div>
            ))}
          </div>

          {/* Tactical reasoning */}
          <div className="space-y-2">
            <div className="text-[10px] text-white/35 uppercase tracking-wider font-semibold">AI Reasoning</div>
            <div className="space-y-1.5">
              {reasoning.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-white/55 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-neon-cyan/15 text-neon-cyan text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
