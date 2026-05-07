import { useState, useCallback } from "react";
import { useDecisionStore } from "@store/decisionStore";
import { useUserStore }     from "@store/userStore";
import { useMatchStore }    from "@store/matchStore";

// Cricket components
import LiveScoreboard     from "@components/cricket/LiveScoreboard";
import EnhancedFieldingMap from "@components/cricket/FieldingMap";
import EnhancedBowlerPanel from "@components/cricket/BowlerPanel";
import CountdownTimer     from "@components/cricket/CountdownTimer";
import CaptainComparison  from "@components/cricket/CaptainComparison";
import MomentumGraph      from "@components/cricket/MomentumGraph";
import MatchPressureGauge from "@components/cricket/MatchPressureGauge";
import LiveCommentary     from "@components/cricket/LiveCommentary";
import WinProbabilityPanel from "@components/cricket/WinProbabilityPanel";
import TacticalInsights   from "@components/cricket/TacticalInsights";

// Common
import IMSScoreCard from "@components/common/IMSScoreCard";

import {
  Swords, Send, Loader2, RotateCcw, BrainCircuit,
  Target, Zap, ChevronRight, X, Trophy, CheckCircle2,
  AlarmClock, Activity, Info,
} from "lucide-react";
import clsx from "clsx";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "field",    label: "Field Setup",    icon: Target,       shortLabel: "Field"   },
  { id: "bowling",  label: "Bowling Change", icon: Zap,          shortLabel: "Bowl"    },
  { id: "tactics",  label: "AI Tactics",     icon: BrainCircuit, shortLabel: "Tactics" },
];

// ─── Result Modal ─────────────────────────────────────────────────────────────
function ResultModal({ result, onClose }) {
  if (!result) return null;
  const great = result.score >= 80;
  const ok    = result.score >= 50;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card border-neon-cyan/20 p-8 w-full max-w-lg text-center space-y-6 relative animate-score-pop shadow-2xl">
        <button onClick={onClose} className="btn-icon absolute top-4 right-4 z-10"><X size={16} /></button>
        <div>
          <div className="text-5xl mb-3">{great ? "🎯" : ok ? "📊" : "📉"}</div>
          <h2 className="font-display text-2xl font-black text-white">
            {great ? "Brilliant Call, Coach!" : ok ? "Decent Decision" : "Different Approach"}
          </h2>
          <p className="text-white/40 text-sm mt-1">Your decision has been evaluated against the captain's choice</p>
        </div>

        <div className="flex items-center justify-center">
          <IMSScoreCard score={result.score} label="Impact Merit Score" size="lg" animated />
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-xl bg-surface-2 border border-white/[0.08]">
            <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1.5">Your Decision</div>
            <div className="text-sm font-medium text-white">{result.decision?.label ?? "Custom setup"}</div>
          </div>
          <div className="p-3 rounded-xl bg-neon-cyan/8 border border-neon-cyan/20">
            <div className="text-[10px] text-neon-cyan/50 uppercase tracking-wider mb-1.5">Captain's Choice</div>
            <div className="text-sm font-medium text-neon-cyan">{result.actualDecision?.label ?? "Bumrah continues"}</div>
          </div>
        </div>

        <p className="text-sm text-white/50 leading-relaxed px-4">
          {great
            ? "Your tactical instinct is aligned with the captain! Study this pattern for future matches."
            : ok
            ? "You were close — the captain considered similar options. Check the comparison for details."
            : "The captain analysed dew factor, batter matchups, and bowler fatigue differently. Study the AI Tactics tab."}
        </p>

        <button onClick={onClose} className="btn-primary w-full py-3 text-base">
          Continue Coaching <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Main CoachingRoom Page ───────────────────────────────────────────────────
export default function CoachingRoom() {
  const [activeTab,      setActiveTab]      = useState("field");
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [timerActive,    setTimerActive]    = useState(true);
  const [timerKey,       setTimerKey]       = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const match      = useMatchStore((s) => s.liveMatch);
  const addNotif   = useMatchStore((s) => s.addNotification);
  const updateIMS  = useUserStore((s) => s.updateIMS);
  const user       = useUserStore((s) => s.user);

  const {
    selectedBowler, fieldPlacement,
    submitDecision, lastResult, clearLastResult,
    sessionIMS, submittedDecisions,
  } = useDecisionStore();

  const handleTimerExpire = useCallback(() => {
    setTimerActive(false);
    addNotif({ type: "warning", title: "Time's up!", message: "You didn't submit in time. Captain made the call." });
  }, [addNotif]);

  const handleResetTimer = () => {
    setTimerKey((k) => k + 1);
    setTimerActive(true);
  };

  async function handleSubmit() {
    if (activeTab === "bowling" && !selectedBowler) return;
    setIsSubmitting(true);
    setTimerActive(false);

    const decision = activeTab === "bowling"
      ? { type: "BOWLING_CHANGE",  value: selectedBowler,                                  label: "Kumar Kartikeya next over" }
      : { type: "FIELD_PLACEMENT", value: fieldPlacement.activePositions.join(","), label: "Custom field setup" };
    const actual = { type: decision.type, value: "p10", label: "Bumrah set — Slip, Gully + boundary cover" };

    const result = await submitDecision(decision, actual, { criticalOver: (match?.over ?? 0) >= 15 });
    updateIMS(result.score);
    setIsSubmitting(false);
    addNotif({ type: "ims", title: `+${result.score} IMS Earned!`, message: `Your ${activeTab} decision scored ${result.score} Impact Merit points.` });
    setShowComparison(true);
    // Auto-reset timer for next decision
    setTimeout(() => { setTimerKey((k) => k + 1); setTimerActive(true); }, 2000);
  }

  const canSubmit = activeTab === "field" || (activeTab === "bowling" && !!selectedBowler);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2.5">
            <Swords size={22} className="text-neon-cyan" />
            Coaching Room
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Make decisions. Earn IMS. Beat the captain.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {sessionIMS > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-neon-green/10 border border-neon-green/25 font-mono font-bold text-neon-green text-sm flex items-center gap-1.5">
              <Trophy size={13} /> +{sessionIMS} IMS session
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="text-xs font-black text-neon-red tracking-wider ml-1">LIVE · Over {match?.over}.{match?.ball}</span>
          </div>
        </div>
      </div>

      {/* ── Full-width Scoreboard ── */}
      <LiveScoreboard />

      {/* ── Scenario Alert ── */}
      <div className="glass-card p-3.5 flex items-start gap-3 border-l-4 border-neon-gold bg-neon-gold/5">
        <Info size={16} className="text-neon-gold shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="text-sm font-semibold text-white">Decision Moment — Over {match?.over}: </span>
          <span className="text-sm text-white/60">
            CSK need <strong className="text-neon-red">54 off 33 balls</strong>. Dube (34*) &amp; Jadeja (12*) at the crease.
            Bumrah has 1 over saved. <span className="text-neon-gold">What's your call?</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-neon-gold/60 shrink-0">
          <Activity size={10} className="animate-pulse" /> Live situation
        </div>
      </div>

      {/* ── Main 3-column Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr_280px] gap-4">

        {/* ════ LEFT COLUMN ════ */}
        <div className="space-y-4">
          {/* Pressure Gauge */}
          <MatchPressureGauge />

          {/* Decision History */}
          <div className="glass-card p-4 space-y-3">
            <div className="section-title flex items-center gap-2">
              <CheckCircle2 size={14} className="text-neon-green" /> Decision Log
            </div>
            {submittedDecisions.length === 0 ? (
              <div className="text-center py-5 text-white/20 text-xs">No decisions yet — make your first call!</div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar">
                {submittedDecisions.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-2">
                    <CheckCircle2 size={13} className={d.score >= 70 ? "text-neon-green" : "text-neon-red"} />
                    <span className="text-xs text-white/60 flex-1 truncate">{d.decision.type.replace("_", " ")}</span>
                    <span className="font-mono font-bold text-xs text-neon-cyan">+{d.score}</span>
                  </div>
                ))}
              </div>
            )}
            {submittedDecisions.length > 0 && (
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-white/30">Session total</span>
                <span className="font-mono font-black text-neon-cyan">+{sessionIMS} IMS</span>
              </div>
            )}
          </div>

          {/* Live Commentary */}
          <LiveCommentary />
        </div>

        {/* ════ CENTER COLUMN ════ */}
        <div className="space-y-4">
          {/* Decision Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-surface-2 border border-white/[0.06]">
            {TABS.map(({ id, icon: Icon, label, shortLabel }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg text-sm font-semibold transition-all duration-250",
                  activeTab === id
                    ? "bg-neon-cyan text-navy-950 shadow-neon-cyan font-black"
                    : "text-white/45 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon size={15} />
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden">{shortLabel}</span>
              </button>
            ))}
          </div>

          {/* Tab Panel */}
          <div className="animate-fade-in">
            {activeTab === "field"   && <EnhancedFieldingMap />}
            {activeTab === "bowling" && <EnhancedBowlerPanel />}
            {activeTab === "tactics" && <TacticalInsights onApply={(i) => addNotif({ type: "info", title: "Insight Applied", message: i.title })} />}
          </div>

          {/* Countdown + Submit Row */}
          {activeTab !== "tactics" && (
            <div className="grid grid-cols-[auto_1fr] gap-3 items-end">
              <CountdownTimer
                key={timerKey}
                duration={30}
                isActive={timerActive}
                onExpire={handleTimerExpire}
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canSubmit}
                  className="btn-primary py-4 text-base font-black disabled:opacity-40 disabled:cursor-not-allowed w-full relative overflow-hidden"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Evaluating…</>
                  ) : (
                    <><Send size={16} /> Submit Decision</>
                  )}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetTimer}
                    className="btn-secondary flex-1 text-xs py-2"
                  >
                    <AlarmClock size={13} /> Reset Timer
                  </button>
                  <button className="btn-ghost px-3 py-2" title="Reset field">
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Captain Comparison (shows after submit) */}
          {showComparison && lastResult && (
            <CaptainComparison
              userDecision={lastResult.decision}
              imsScore={lastResult.score}
              decisionType={lastResult.decision?.type ?? "FIELD_PLACEMENT"}
              onClose={() => { setShowComparison(false); clearLastResult(); }}
            />
          )}
        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div className="space-y-4">
          {/* Win Probability */}
          <WinProbabilityPanel />

          {/* Momentum Graph */}
          <MomentumGraph />
        </div>
      </div>

      {/* Result Modal */}
      {lastResult && !showComparison && (
        <ResultModal result={lastResult} onClose={clearLastResult} />
      )}
    </div>
  );
}
