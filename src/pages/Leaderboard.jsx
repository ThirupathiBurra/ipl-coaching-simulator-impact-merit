import { useState, useEffect } from "react";
import {
  LEADERBOARD_DATA, WEEKLY_LEADERBOARD, MATCH_LEADERBOARD,
  BADGE_CONFIG, SCORE_CATEGORIES,
} from "@data/leaderboardData";
import { calcLevel } from "@store/decisionStore";
import { useUserStore } from "@store/userStore";
import {
  Trophy, TrendingUp, TrendingDown, Minus, Medal, Flame, Crown,
  Star, Zap, Target, Globe, Calendar, BarChart3, Shield,
} from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import Skeleton from "@components/common/Skeleton";

// ─── Period / Category tabs ────────────────────────────────────────────────────
const PERIOD_TABS = [
  { id: "season", label: "Season",  icon: Star      },
  { id: "weekly", label: "Weekly",  icon: Calendar  },
  { id: "match",  label: "This Match", icon: Zap    },
];

const CATEGORY_TABS = [
  { id: "ims",      label: "IMS",       icon: Trophy    },
  { id: "accuracy", label: "Accuracy",  icon: Target    },
  { id: "field",    label: "Field",     icon: BarChart3 },
  { id: "bowling",  label: "Bowling",   icon: Shield    },
];

const TREND_ICONS = {
  up:   { icon: TrendingUp,   color: "text-neon-green" },
  down: { icon: TrendingDown, color: "text-neon-red"   },
  same: { icon: Minus,        color: "text-white/30"   },
};

// ─── Podium Card ──────────────────────────────────────────────────────────────
function PodiumCard({ entry, pos, isMe }) {
  if (!entry) return null;
  const heights  = { 1: "h-28", 2: "h-20", 3: "h-14" };
  const gradients = {
    1: "from-neon-gold/80 to-neon-orange/60",
    2: "from-white/40 to-white/20",
    3: "from-neon-orange/60 to-neon-red/40",
  };
  const glows    = { 1: "shadow-[0_0_30px_rgba(255,214,0,0.35)]", 2: "shadow-[0_0_12px_rgba(255,255,255,0.1)]", 3: "shadow-[0_0_12px_rgba(255,80,0,0.2)]" };
  const badgeCfg = BADGE_CONFIG[entry.badge] ?? BADGE_CONFIG.AMATEUR;
  const lvl = calcLevel((entry.xp ?? entry.imsTotal * 4));

  return (
    <div className={clsx("flex flex-col items-center gap-2 animate-fade-in", pos === 2 && "order-first sm:order-none")}>
      {/* Crown for 1st */}
      {pos === 1 && <Crown size={22} className="text-neon-gold animate-pulse" />}
      {/* Avatar */}
      <div className={clsx(
        "relative w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white border-2 transition-all",
        isMe ? "border-neon-cyan bg-gradient-to-br from-neon-cyan/40 to-neon-blue/30" : "border-white/20 bg-gradient-to-br from-neon-purple/60 to-neon-blue/40",
        glows[pos]
      )}>
        {entry.avatar}
        {isMe && <span className="absolute -top-2 -right-2 text-[9px] bg-neon-cyan text-navy-950 font-black px-1 rounded-full">YOU</span>}
        <div className={clsx("absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black px-1.5 py-0.5 rounded-full border whitespace-nowrap", badgeCfg.bg, badgeCfg.text)}>
          {badgeCfg.icon}
        </div>
      </div>
      {/* Name + score */}
      <div className="text-center mt-1.5">
        <div className="text-xs font-bold text-white leading-tight max-w-[72px] truncate">{entry.displayName}</div>
        <div className="font-mono text-sm font-black text-neon-cyan mt-0.5">{entry.imsTotal.toLocaleString()}</div>
        <div className="text-[9px] text-white/30">Lv.{lvl.level} · {entry.accuracy}% acc</div>
      </div>
      {/* Podium block */}
      <div className={clsx("w-20 rounded-t-2xl bg-gradient-to-t flex items-end justify-center pb-2 text-xl font-black text-white/60", heights[pos], gradients[pos])}>
        {pos === 1 ? "🥇" : pos === 2 ? "🥈" : "🥉"}
      </div>
    </div>
  );
}

// ─── User rank highlight row ──────────────────────────────────────────────────
function MyRankBanner({ user }) {
  if (!user) return null;
  const lvl = calcLevel(user.imsTotal * 4);
  const badgeCfg = BADGE_CONFIG[user.badge ?? "PRO"];
  return (
    <div className="glass-card p-4 border-neon-cyan/25 bg-neon-cyan/[0.04]">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <Medal size={20} className="text-neon-cyan shrink-0" />
          <div>
            <div className="text-sm font-bold text-white">{user.displayName}</div>
            <div className={clsx("text-[10px] font-bold", badgeCfg.text)}>{badgeCfg.icon} {badgeCfg.label} · Level {lvl.level}</div>
          </div>
        </div>
        <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden min-w-[80px]">
          <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue" style={{ width: `${lvl.pct}%`, transition: "width 1s ease" }} />
        </div>
        <div className="flex items-center gap-4 text-center flex-wrap">
          {[
            { label: "Rank",     val: `#${user.imsRank ?? 5}`,              color: "text-neon-cyan" },
            { label: "IMS",      val: user.imsTotal.toLocaleString(),        color: "text-white"     },
            { label: "Accuracy", val: `${user.accuracy}%`,                  color: "text-neon-green"},
            { label: "Streak",   val: `${user.streak > 0 ? `🔥 ${user.streak}` : "—"}`, color: "text-neon-orange" },
          ].map(({ label, val, color }) => (
            <div key={label} className="min-w-[48px]">
              <div className={clsx("font-mono font-black text-base", color)}>{val}</div>
              <div className="text-[9px] text-white/30">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Leaderboard Row ─────────────────────────────────────────────────────
function LeaderboardRow({ entry, isMe, category }) {
  const { icon: TrendIcon, color: trendColor } = TREND_ICONS[entry.trend ?? "same"];
  const badgeCfg = BADGE_CONFIG[entry.badge] ?? BADGE_CONFIG.AMATEUR;
  const primaryValue = category === "accuracy" ? `${entry.accuracy}%`
    : category === "field"   ? entry.fieldDecisions ?? "—"
    : category === "bowling" ? entry.bowlDecisions  ?? "—"
    : entry.imsTotal.toLocaleString();

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={clsx("hover:bg-white/[0.03] transition-colors group", isMe && "bg-neon-cyan/[0.05] border-l-2 border-l-neon-cyan")}
    >
      {/* Rank */}
      <td className="px-4 py-3 w-12">
        <span className={clsx("font-mono font-black text-base",
          entry.rank === 1 ? "text-neon-gold" : entry.rank === 2 ? "text-white/60" : entry.rank === 3 ? "text-neon-orange" : "text-white/35"
        )}>
          {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank - 1] : `#${entry.rank}`}
        </span>
      </td>

      {/* Coach */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0",
            isMe ? "bg-gradient-to-br from-neon-cyan to-neon-blue" : "bg-gradient-to-br from-neon-purple/60 to-neon-blue/40"
          )}>
            {entry.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-white">
              {entry.displayName}
              {isMe && <span className="text-[9px] text-neon-cyan">(You)</span>}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/30 mt-0.5">
              {entry.country && <span className="flex items-center gap-0.5"><Globe size={8} />{entry.country}</span>}
              <span>{entry.matchesPlayed ?? "—"} matches</span>
            </div>
          </div>
        </div>
      </td>

      {/* Primary value */}
      <td className="px-4 py-3 text-right font-mono font-black text-neon-cyan text-base">{primaryValue}</td>

      {/* Accuracy */}
      <td className="px-4 py-3 text-right hidden sm:table-cell">
        <span className={clsx("font-bold text-sm",
          entry.accuracy >= 80 ? "text-neon-green" : entry.accuracy >= 70 ? "text-neon-gold" : "text-white/50"
        )}>{entry.accuracy}%</span>
      </td>

      {/* Streak */}
      <td className="px-4 py-3 text-right hidden md:table-cell font-mono text-sm">
        {(entry.streak ?? 0) > 0 ? (
          <span className="text-neon-orange flex items-center justify-end gap-1">
            <Flame size={12} /> {entry.streak}
          </span>
        ) : <span className="text-white/20">—</span>}
      </td>

      {/* Badge */}
      <td className="px-4 py-3 text-right hidden lg:table-cell">
        <span className={clsx("text-[10px] font-bold border px-2 py-0.5 rounded-full", badgeCfg.bg, badgeCfg.text)}>
          {badgeCfg.icon} {badgeCfg.label}
        </span>
      </td>

      {/* Trend */}
      <td className="px-4 py-3 text-center w-10">
        <TrendIcon size={14} className={trendColor} />
      </td>
    </motion.tr>
  );
}

// ─── Stats Summary Cards ──────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, subtext }) {
  return (
    <div className="glass-card p-4 space-y-2 border-l-2" style={{ borderLeftColor: color }}>
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color }} />
        <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-mono font-black text-2xl" style={{ color }}>{value}</div>
      {subtext && <div className="text-[10px] text-white/30">{subtext}</div>}
    </div>
  );
}

// ─── Main Leaderboard Page ─────────────────────────────────────────────────────
export default function Leaderboard() {
  const [period, setPeriod]     = useState("season");
  const [category, setCategory] = useState("ims");
  const [loading, setLoading]   = useState(true);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [period, category]);

  const data = period === "weekly" ? WEEKLY_LEADERBOARD
    : period === "match"  ? MATCH_LEADERBOARD
    : LEADERBOARD_DATA;

  const sortedData = [...data].sort((a, b) => {
    if (category === "accuracy") return b.accuracy - a.accuracy;
    if (category === "field")    return (b.fieldDecisions ?? 0) - (a.fieldDecisions ?? 0);
    if (category === "bowling")  return (b.bowlDecisions ?? 0) - (a.bowlDecisions ?? 0);
    return b.imsTotal - a.imsTotal;
  }).map((e, i) => ({ ...e, rank: i + 1 }));

  const top3 = [sortedData[1], sortedData[0], sortedData[2]]; // Silver, Gold, Bronze order for podium

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="w-64 h-12" />
          <Skeleton className="w-48 h-10" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2.5">
            <Trophy size={22} className="text-neon-gold" />
            Top Cricket Minds
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Ranked by Impact Merit Score — the global coaching leaderboard</p>
        </div>
        <div className="flex gap-1.5">
          {PERIOD_TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPeriod(id)}
              className={clsx("flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all",
                period === id ? "bg-neon-gold text-navy-950 font-black border-transparent" : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
              )}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Coaches"   value="12,847"   icon={Globe}     color="#00E5FF" subtext="Global community" />
        <StatCard label="Decisions Today" value="48,231"   icon={Target}    color="#AA00FF" subtext="Across all matches" />
        <StatCard label="Avg Accuracy"    value="71.4%"    icon={BarChart3} color="#00E676" subtext="Season average" />
        <StatCard label="Top IMS Today"   value="9,847"    icon={Zap}       color="#FFD600" subtext="RohitFan99" />
      </div>

      {/* Podium */}
      {period !== "match" && sortedData.length >= 3 && (
        <div className="glass-card p-8 bg-gradient-to-b from-neon-purple/5 to-transparent">
          <div className="flex items-end justify-center gap-4 sm:gap-8">
            {top3.map((entry, i) => {
              const pos = [2, 1, 3][i];
              if (!entry) return null;
              return (
                <PodiumCard
                  key={entry.userId}
                  entry={entry}
                  pos={pos}
                  isMe={entry.userId === user?.uid}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* My rank banner */}
      <MyRankBanner user={user} />

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORY_TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setCategory(id)}
            className={clsx("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
              category === id ? "bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan font-bold" : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
            )}
          >
            <Icon size={11} /> {label}
          </button>
        ))}
      </div>

      {/* Full table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-white/30 uppercase tracking-wider border-b border-white/[0.06]">
                <th className="px-4 py-3 w-12">Rank</th>
                <th className="px-4 py-3">Coach</th>
                <th className="px-4 py-3 text-right">
                  {category === "accuracy" ? "Accuracy" : category === "field" ? "Field Dec." : category === "bowling" ? "Bowl Dec." : "IMS"}
                </th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Accuracy</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Streak</th>
                <th className="px-4 py-3 text-right hidden lg:table-cell">Badge</th>
                <th className="px-4 py-3 text-center w-10">↕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {sortedData.map((entry) => (
                <LeaderboardRow
                  key={entry.userId}
                  entry={entry}
                  isMe={entry.userId === user?.uid}
                  category={category}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-white/25">
          <span>Showing {sortedData.length} coaches</span>
          <span>Updated live every 30s</span>
        </div>
      </div>
    </motion.div>
  );
}
