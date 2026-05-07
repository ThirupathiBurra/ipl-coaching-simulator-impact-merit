import { useState } from "react";
import { SCORE_CATEGORIES, BADGE_CONFIG } from "@data/leaderboardData";
import { calcLevel, ACHIEVEMENTS } from "@store/decisionStore";
import { useDecisionStore } from "@store/decisionStore";
import { useUserStore } from "@store/userStore";
import {
  Trophy, Target, Zap, TrendingUp, TrendingDown, Clock,
  ChevronRight, Star, Award, Activity,
} from "lucide-react";
import clsx from "clsx";


// ─── Radial score ring ─────────────────────────────────────────────────────────
function ScoreRing({ score, size = 100, strokeWidth = 8, color = "#00E5FF", label, sublabel }) {
  const r   = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-black text-white" style={{ fontSize: size > 90 ? "1.5rem" : "1.1rem" }}>{score}</span>
          {sublabel && <span className="text-[9px] text-white/35">{sublabel}</span>}
        </div>
      </div>
      {label && <div className="text-xs text-white/50 text-center font-medium">{label}</div>}
    </div>
  );
}

// ─── XP Progress bar ──────────────────────────────────────────────────────────
function XPBar({ xp }) {
  const lvl = calcLevel(xp);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <Star size={12} className="text-neon-gold fill-neon-gold" />
          <span className="font-bold text-neon-gold">Level {lvl.level}</span>
        </div>
        <span className="font-mono text-white/35 text-[10px]">{lvl.current.toLocaleString()} / {lvl.next?.toLocaleString()} XP</span>
      </div>
      <div className="h-2 rounded-full bg-white/8 overflow-hidden relative">
        <div
          className="h-full rounded-full"
          style={{ width: `${lvl.pct}%`, background: "linear-gradient(90deg, #FFD600, #FF9100)", transition: "width 1s ease", boxShadow: "0 0 8px #FFD60080" }}
        />
      </div>
    </div>
  );
}

// ─── Sub-score hexagon card ────────────────────────────────────────────────────
function SubScoreCard({ cat, value, animate }) {
  const color = value >= 80 ? "#00E676" : value >= 65 ? "#FFD600" : value >= 45 ? "#FF9100" : "#FF1744";
  return (
    <div className="glass-card p-3 space-y-2 hover:border-white/15 transition-all group">
      <div className="flex items-center gap-2">
        <span className="text-lg">{cat.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-white/60 group-hover:text-white/80 transition-colors truncate">{cat.label}</div>
        </div>
        <span className="font-mono font-black text-sm" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: animate ? `${value}%` : "0%", background: color, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
      </div>
      <div className="text-[9px] text-white/25 leading-relaxed">{cat.desc}</div>
    </div>
  );
}

// ─── Decision History Row ─────────────────────────────────────────────────────
function DecisionRow({ result, index }) {
  const isMatch = result.scoring?.isMatch;
  const isPartial = result.scoring?.isPartial;
  const time = new Date(result.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const typeLabel = { FIELD_PLACEMENT: "🗺️ Field", BOWLING_CHANGE: "🎳 Bowling", TACTICAL: "🧠 Tactical" };
  const scoreColor = result.score >= 100 ? "#00E676" : result.score >= 60 ? "#FFD600" : "#FF4444";

  return (
    <div className={clsx(
      "flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors animate-fade-in",
      index === 0 && "bg-neon-cyan/[0.04] border-l-2 border-l-neon-cyan"
    )}>
      <div className="flex flex-col items-center w-8 shrink-0">
        <span className="text-[10px] font-mono font-black" style={{ color: scoreColor }}>{result.score}</span>
        <span className="text-[8px] text-white/25">IMS</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-white/75 truncate">{result.decision?.label ?? "Decision"}</div>
        <div className="text-[10px] text-white/30 mt-0.5 flex items-center gap-2">
          <span>{typeLabel[result.decision?.type] ?? "📋 Other"}</span>
          <span>·</span>
          <span className="font-mono">{result.over ?? "—"}</span>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <span className={clsx("text-[10px] font-bold px-1.5 py-0.5 rounded-full",
          isMatch ? "text-neon-green bg-neon-green/10" : isPartial ? "text-neon-gold bg-neon-gold/10" : "text-neon-red/70 bg-neon-red/8"
        )}>
          {isMatch ? "✓ Match" : isPartial ? "~ Partial" : "✕ Miss"}
        </span>
        <span className="text-[9px] text-white/20 mt-0.5">{time}</span>
      </div>
    </div>
  );
}

// ─── Achievement badge card ───────────────────────────────────────────────────
function AchievementBadge({ achievement, unlocked }) {
  return (
    <div className={clsx(
      "flex items-center gap-2.5 p-2.5 rounded-xl border transition-all",
      unlocked ? "bg-neon-gold/8 border-neon-gold/25" : "bg-white/[0.02] border-white/[0.06] opacity-50 grayscale"
    )}>
      <span className="text-xl">{achievement.icon}</span>
      <div className="flex-1 min-w-0">
        <div className={clsx("text-[11px] font-bold truncate", unlocked ? "text-neon-gold" : "text-white/40")}>{achievement.label}</div>
        <div className="text-[9px] text-white/30 leading-snug">{achievement.desc}</div>
      </div>
      {unlocked && <div className="w-2 h-2 rounded-full bg-neon-gold shrink-0" />}
    </div>
  );
}

// ─── Main IMS Dashboard Page ───────────────────────────────────────────────────
export default function IMSDashboard() {
  const user         = useUserStore((s) => s.user);
  const { submittedDecisions, stats, unlockedAchievements, sessionIMS } = useDecisionStore();
  const [animate, setAnimate]   = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview | history | achievements



  const badgeCfg = BADGE_CONFIG[user?.badge ?? "PRO"];
  const xp = user?.imsTotal ? user.imsTotal * 4 : 32500;

  // Build sub-score display (use store stats or mock)
  const displayStats = {
    coachingAccuracy:    stats.totalDecisions > 0 ? stats.coachingAccuracy    : 73,
    tacticalIntelligence:stats.totalDecisions > 0 ? stats.tacticalIntelligence : 68,
    bowlingDecision:     stats.totalDecisions > 0 ? stats.bowlingDecision     : 71,
    fieldEfficiency:     stats.totalDecisions > 0 ? stats.fieldEfficiency     : 65,
    predictionAccuracy:  stats.totalDecisions > 0 ? stats.predictionAccuracy  : 78,
    riskReward:          stats.totalDecisions > 0 ? stats.riskReward          : 62,
  };

  const compositeScore = Math.round(Object.values(displayStats).reduce((a, b) => a + b, 0) / 6);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2.5">
            <Trophy size={22} className="text-neon-gold" />
            Impact Merit Score
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Your coaching intelligence — measured in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          {sessionIMS > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-xs font-bold text-neon-green">
              <Activity size={12} className="animate-pulse" /> +{sessionIMS} this session
            </div>
          )}
        </div>
      </div>

      {/* ── Hero Card ── */}
      <div className="glass-card p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 border-neon-cyan/15">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-6 items-center">
          {/* Avatar + level */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-2xl font-black text-white border-2 border-white/20 relative">
              {user?.displayName?.slice(0, 2).toUpperCase() ?? "CD"}
              <div className={clsx("absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-0.5 rounded-full border", badgeCfg.bg, badgeCfg.text)}>
                {badgeCfg.icon} {badgeCfg.label}
              </div>
            </div>
            <div className="text-center mt-1">
              <div className="font-bold text-white text-sm">{user?.displayName}</div>
              <div className="text-[10px] text-white/30">Rank #{user?.imsRank ?? 5}</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="space-y-3">
            <XPBar xp={xp} />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { label: "IMS Total",  value: user?.imsTotal?.toLocaleString() ?? "8,731", color: "text-neon-cyan" },
                { label: "Accuracy",   value: `${user?.accuracy ?? 73}%`,                  color: "text-neon-green" },
                { label: "Decisions",  value: user?.decisionsCount ?? 105,                 color: "text-white"  },
                { label: "Streak",     value: `${user?.streak ?? 7}🔥`,                    color: "text-neon-orange" },
                { label: "Matches",    value: user?.matchesPlayed ?? 34,                   color: "text-white"  },
                { label: "Session",    value: `+${sessionIMS}`,                            color: "text-neon-gold" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col items-center py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <span className={clsx("font-mono font-black text-sm", color)}>{value}</span>
                  <span className="text-[9px] text-white/30 mt-0.5 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Composite ring */}
          <div className="flex justify-center">
            <ScoreRing score={compositeScore} size={110} strokeWidth={9} color="#00E5FF" sublabel="Composite" />
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface-2 border border-white/[0.06] w-fit">
        {[
          { id: "overview",      label: "Score Breakdown" },
          { id: "history",       label: "Decision History" },
          { id: "achievements",  label: "Achievements"     },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={clsx("px-4 py-2 rounded-lg text-xs font-semibold transition-all",
              activeTab === id ? "bg-neon-cyan text-navy-950 font-black" : "text-white/40 hover:text-white"
            )}
          >
            {label}
            {id === "achievements" && unlockedAchievements.length > 0 && (
              <span className="ml-1.5 w-4 h-4 rounded-full bg-neon-gold text-navy-950 text-[9px] font-black inline-flex items-center justify-center">
                {unlockedAchievements.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === "overview" && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SCORE_CATEGORIES.map((cat) => (
              <SubScoreCard key={cat.id} cat={cat} value={displayStats[cat.id]} animate={animate} />
            ))}
          </div>

          {/* Spider chart placeholder — best vs recent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-4 space-y-3">
              <div className="section-title text-sm">Performance Trend</div>
              <div className="space-y-2">
                {SCORE_CATEGORIES.slice(0, 4).map((cat) => {
                  const val = displayStats[cat.id];
                  const color = val >= 80 ? "#00E676" : val >= 65 ? "#FFD600" : "#FF9100";
                  return (
                    <div key={cat.id} className="flex items-center gap-3">
                      <span className="text-sm w-5">{cat.icon}</span>
                      <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${val}%`, background: color, transition: "width 1s ease" }} />
                      </div>
                      <span className="font-mono text-[11px] font-bold w-6 text-right" style={{ color }}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="glass-card p-4 space-y-3">
              <div className="section-title text-sm">Decision Breakdown</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Field Decisions",    val: stats.fieldDecisions  || 44, color: "#2979FF"  },
                  { label: "Bowling Decisions",  val: stats.bowlDecisions   || 41, color: "#AA00FF"  },
                  { label: "Best Single IMS",    val: stats.bestSingleIMS   || 148, color: "#FFD600" },
                  { label: "Total Decisions",    val: stats.totalDecisions  || 105, color: "#00E5FF" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center">
                    <div className="font-mono font-black text-lg" style={{ color }}>{val}</div>
                    <div className="text-[9px] text-white/30 mt-0.5 leading-tight">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── History Tab ── */}
      {activeTab === "history" && (
        <div className="glass-card overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="section-title text-sm">Recent Decisions</div>
            <span className="text-[10px] text-white/30">{submittedDecisions.length} recorded this session</span>
          </div>
          {submittedDecisions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <div className="text-5xl">🎯</div>
              <div className="text-sm font-semibold text-white/50">No decisions yet</div>
              <div className="text-xs text-white/30">Make decisions in Coaching Room, Field Simulator, or Bowling Engine</div>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {submittedDecisions.slice(0, 20).map((r, i) => <DecisionRow key={r.id} result={r} index={i} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Achievements Tab ── */}
      {activeTab === "achievements" && (
        <div className="animate-fade-in space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {ACHIEVEMENTS.map((a) => (
              <AchievementBadge key={a.id} achievement={a} unlocked={unlockedAchievements.includes(a.id)} />
            ))}
          </div>
          <div className="text-center text-xs text-white/25">
            {unlockedAchievements.length} / {ACHIEVEMENTS.length} achievements unlocked
          </div>
        </div>
      )}
    </div>
  );
}
