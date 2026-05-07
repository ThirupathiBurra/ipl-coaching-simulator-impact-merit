import { useState } from "react";
import { BOWLERS, STRATEGIES, BOWLING_PLANS, MATCHUP_DATA, AI_RECOMMENDATION } from "@data/bowlingData";
import BowlerCard from "@components/bowling/BowlerCard";
import StrategySelector from "@components/bowling/StrategySelector";
import BowlingPlanPicker from "@components/bowling/BowlingPlanPicker";
import AIRecommendationPanel from "@components/bowling/AIRecommendationPanel";
import MatchupMatrix from "@components/bowling/MatchupMatrix";
import IMSScoreCard from "@components/common/IMSScoreCard";
import { useMatchStore } from "@store/matchStore";
import { useUserStore } from "@store/userStore";
import { useDecisionStore } from "@store/decisionStore";
import {
  Zap, Send, Loader2, ChevronRight, X, CheckCircle2,
  Trophy, Activity, BarChart3, Crosshair,
} from "lucide-react";
import clsx from "clsx";

// ─── Result Modal ─────────────────────────────────────────────────────────────
function ResultModal({ result, bowler, plan, strategy, onClose }) {
  const isGreat = result.score >= 80;
  const isOk    = result.score >= 50;
  const strat   = STRATEGIES.find((s) => s.id === strategy);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card border-neon-cyan/20 p-8 w-full max-w-md text-center space-y-5 relative shadow-2xl animate-score-pop">
        <button onClick={onClose} className="btn-icon absolute top-4 right-4"><X size={16} /></button>
        <div>
          <div className="text-5xl mb-3">{isGreat ? "🏆" : isOk ? "📊" : "🔄"}</div>
          <h2 className="font-display text-2xl font-black text-white">
            {isGreat ? "Perfect Call!" : isOk ? "Good Decision" : "Captain Disagreed"}
          </h2>
          <p className="text-white/40 text-sm mt-1">Your bowling strategy has been evaluated</p>
        </div>
        <div className="flex items-center justify-center">
          <IMSScoreCard score={result.score} label="Impact Merit Score" size="lg" animated />
        </div>
        <div className="grid grid-cols-3 gap-2 text-left">
          <div className="p-2.5 rounded-xl bg-surface-2 border border-white/[0.06] col-span-3 sm:col-span-1">
            <div className="text-[9px] text-white/35 uppercase tracking-wider mb-1">Bowler</div>
            <div className="text-xs font-bold text-white">{bowler?.shortName}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-2 border border-white/[0.06]">
            <div className="text-[9px] text-white/35 uppercase tracking-wider mb-1">Strategy</div>
            <div className="text-xs font-bold" style={{ color: strat?.color }}>{strat?.icon} {strat?.label}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-neon-cyan/8 border border-neon-cyan/20">
            <div className="text-[9px] text-neon-cyan/50 uppercase tracking-wider mb-1">AI Pick</div>
            <div className="text-xs font-bold text-neon-cyan">{BOWLERS.find((b) => b.id === AI_RECOMMENDATION.recommendedId)?.shortName}</div>
          </div>
        </div>
        <p className="text-sm text-white/50 leading-relaxed px-2">
          {isGreat
            ? "Your bowling analysis matches the AI recommendation. Keep it up!"
            : isOk
            ? "Close call — you considered the right options. Study the matchup matrix for improvements."
            : "The AI suggested a different bowler based on current matchup data. Review the reasoning."}
        </p>
        <button onClick={onClose} className="btn-primary w-full py-3">
          Next Decision <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Main BowlingEngine Page ──────────────────────────────────────────────────
export default function BowlingEngine() {
  const [selectedBowler, setSelectedBowler]   = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [selectedPlan, setSelectedPlan]         = useState(null);
  const [isSubmitting, setIsSubmitting]          = useState(false);
  const [result, setResult]                      = useState(null);
  const [activeRightTab, setActiveRightTab]      = useState("ai"); // "ai" | "matrix"

  const match     = useMatchStore((s) => s.liveMatch);
  const addNotif  = useMatchStore((s) => s.addNotification);
  const updateIMS = useUserStore((s) => s.updateIMS);
  const { submitDecision } = useDecisionStore();

  const selectedBowlerObj = BOWLERS.find((b) => b.id === selectedBowler);
  const canSubmit = selectedBowler && selectedStrategy && selectedPlan;

  const dubeMatchup = selectedBowler
    ? MATCHUP_DATA["Shivam Dube"]?.vs[selectedBowler]
    : null;

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);

    const strat  = STRATEGIES.find((s) => s.id === selectedStrategy);
    const plan   = (BOWLING_PLANS[selectedBowlerObj?.styleCode] || []).find((p) => p.id === selectedPlan);
    const planIMS = plan?.imsBonus ?? 10;
    const stratMult = strat?.imsMultiplier ?? 1.0;

    const decision = {
      type: "BOWLING_CHANGE",
      value: selectedBowler,
      label: `${selectedBowlerObj?.shortName} — ${strat?.label} — ${plan?.label}`,
    };
    const actual = {
      type: "BOWLING_CHANGE",
      value: AI_RECOMMENDATION.recommendedId,
      label: `${BOWLERS.find((b) => b.id === AI_RECOMMENDATION.recommendedId)?.shortName} — Aggressive — Slower Ball Trap`,
    };

    const res = await submitDecision(decision, actual, { criticalOver: true });
    const finalScore = Math.min(100, Math.round(res.score * stratMult + planIMS * 0.3));
    const finalResult = { ...res, score: finalScore };

    updateIMS(finalScore);
    setResult(finalResult);
    setIsSubmitting(false);
    addNotif({ type: "ims", title: `+${finalScore} IMS!`, message: `${selectedBowlerObj?.shortName} chosen with ${strat?.label} strategy.` });
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2.5">
            <Zap size={22} className="text-neon-purple" />
            Bowling Strategy Engine
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Select bowler · Choose strategy · Define plan · Submit</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neon-red/10 border border-neon-red/25 text-xs">
            <Activity size={12} className="text-neon-red animate-pulse" />
            <span className="text-neon-red font-bold">Over {match?.over}.{match?.ball} · LIVE</span>
          </div>
          <div className="text-xs text-white/40 font-mono">CSK need <span className="text-neon-red font-bold">54 off 33</span></div>
        </div>
      </div>

      {/* ── Batters at Crease Banner ── */}
      <div className="glass-card px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(match?.currentBatsmen ?? []).map((b) => (
          <div key={b.playerId} className={clsx("flex items-center gap-2.5 p-2.5 rounded-xl transition-all", b.isStriker ? "bg-neon-gold/8 border border-neon-gold/20" : "bg-white/[0.03] border border-white/[0.06]")}>
            <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0", b.isStriker ? "bg-neon-gold/20 text-neon-gold" : "bg-white/8 text-white/60")}>
              {b.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{b.name} {b.isStriker ? "*" : ""}</div>
              <div className="text-[10px] font-mono text-white/40">{b.runs}({b.balls}) SR {b.sr}</div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neon-purple/8 border border-neon-purple/20 col-span-2 sm:col-span-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black bg-neon-purple/20 text-neon-purple shrink-0">
            {match?.currentBowler?.name.split(" ").pop().slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold text-white">{match?.currentBowler?.name} <span className="text-neon-purple text-[10px]">🎳</span></div>
            <div className="text-[10px] font-mono text-white/40">{match?.currentBowler?.overs}ov {match?.currentBowler?.wickets}W eco {match?.currentBowler?.economy}</div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">

        {/* ═══ LEFT: Bowler Selection + Decision ═══ */}
        <div className="space-y-5">

          {/* Step 1: Select Bowler */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-neon-cyan text-navy-950 text-xs font-black flex items-center justify-center shrink-0">1</div>
              <div className="section-title text-base">Choose Next Bowler</div>
              {selectedBowler && <div className="ml-auto text-xs text-neon-green flex items-center gap-1"><CheckCircle2 size={12} /> {selectedBowlerObj?.shortName} selected</div>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BOWLERS.map((b) => (
                <BowlerCard
                  key={b.id}
                  bowler={b}
                  isSelected={selectedBowler === b.id}
                  isRecommended={b.id === AI_RECOMMENDATION.recommendedId}
                  matchupData={MATCHUP_DATA["Shivam Dube"]?.vs[b.id]}
                  onClick={(id) => { setSelectedBowler(id); setSelectedPlan(null); }}
                />
              ))}
            </div>
          </div>

          {/* Step 2: Strategy */}
          {selectedBowler && (
            <div className="glass-card p-4 space-y-4 animate-slide-in-up">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-neon-purple text-white text-xs font-black flex items-center justify-center shrink-0">2</div>
                <div className="section-title text-base">Select Strategy</div>
              </div>
              <StrategySelector selected={selectedStrategy} onSelect={setSelectedStrategy} />
            </div>
          )}

          {/* Step 3: Bowling Plan */}
          {selectedBowler && selectedStrategy && (
            <div className="glass-card p-4 space-y-4 animate-slide-in-up">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-neon-gold text-navy-950 text-xs font-black flex items-center justify-center shrink-0">3</div>
                <div className="section-title text-base">Define Bowling Plan</div>
              </div>
              <BowlingPlanPicker
                styleCode={selectedBowlerObj?.styleCode}
                selected={selectedPlan}
                onSelect={setSelectedPlan}
              />
            </div>
          )}

          {/* Step 4: Submit */}
          {canSubmit && (
            <div className="glass-card p-4 space-y-3 animate-slide-in-up border border-neon-cyan/15">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-neon-green text-navy-950 text-xs font-black flex items-center justify-center shrink-0">4</div>
                <div className="section-title text-base">Submit Decision</div>
              </div>
              {/* Decision summary */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { label: "Bowler",   value: selectedBowlerObj?.shortName, color: selectedBowlerObj?.color },
                  { label: "Strategy", value: STRATEGIES.find((s) => s.id === selectedStrategy)?.label },
                  { label: "Plan",     value: (BOWLING_PLANS[selectedBowlerObj?.styleCode] || []).find((p) => p.id === selectedPlan)?.label },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                    <span className="text-white/35">{label}:</span>
                    <span className="font-bold text-white" style={color ? { color } : {}}>{value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-base font-black disabled:opacity-50"
              >
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Evaluating…</> : <><Send size={16} /> Submit Bowling Decision</>}
              </button>
            </div>
          )}

          {/* Matchup Matrix — shown on mobile below cards */}
          <div className="xl:hidden">
            <MatchupMatrix highlightBowlerId={selectedBowler} />
          </div>
        </div>

        {/* ═══ RIGHT: AI Panel ═══ */}
        <div className="space-y-4">
          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl bg-surface-2 border border-white/[0.06]">
            {[
              { id: "ai",     label: "AI Analysis", icon: Crosshair  },
              { id: "matrix", label: "Matchups",    icon: BarChart3  },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveRightTab(id)}
                className={clsx("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all",
                  activeRightTab === id ? "bg-neon-cyan text-navy-950 font-black" : "text-white/40 hover:text-white"
                )}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {activeRightTab === "ai" && <AIRecommendationPanel selectedBowlerId={selectedBowler} />}
          {activeRightTab === "matrix" && <MatchupMatrix highlightBowlerId={selectedBowler} />}
        </div>
      </div>

      {/* Result modal */}
      {result && (
        <ResultModal
          result={result}
          bowler={selectedBowlerObj}
          plan={selectedPlan}
          strategy={selectedStrategy}
          onClose={() => { setResult(null); setSelectedBowler(null); setSelectedStrategy(null); setSelectedPlan(null); }}
        />
      )}
    </div>
  );
}
