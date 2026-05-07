import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMatchStore } from "@store/matchStore";
import { useUserStore } from "@store/userStore";
import { useDecisionStore } from "@store/decisionStore";
import ScoreWidget from "@components/cricket/ScoreWidget";
import PartnershipChart from "@components/cricket/PartnershipChart";
import InsightCard from "@components/common/InsightCard";
import { AI_INSIGHTS, GEMINI_ANALYSIS_PLACEHOLDER } from "@data/aiInsightsData";
import { LEADERBOARD_DATA } from "@data/leaderboardData";
import {
  Swords, Trophy, BrainCircuit, TrendingUp,
  Zap, Target, Activity, ArrowRight, Flame, Shield,
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";
import Skeleton from "@components/common/Skeleton";

const SKILL_DATA = [
  { subject: "Field Placement", A: 80 }, { subject: "Bowling Choice", A: 73 },
  { subject: "Tactical Reads", A: 65 }, { subject: "Death Overs", A: 88 },
  { subject: "Powerplay", A: 70 },      { subject: "Spin Matchups", A: 77 },
];

const IMS_TREND = [
  { over: "1", ims: 0 }, { over: "3", ims: 45 }, { over: "6", ims: 92 },
  { over: "8", ims: 78 }, { over: "10", ims: 130 }, { over: "12", ims: 115 },
  { over: "14", ims: 148 },
];

const WIN_PROB = GEMINI_ANALYSIS_PLACEHOLDER;

function StatBlock({ icon: Icon, label, value, sub, color = "neon-cyan" }) {
  return (
    <div className="glass-card-hover p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${color}/10 border border-${color}/20 shrink-0`}>
        <Icon size={20} className={`text-${color}`} />
      </div>
      <div>
        <div className="text-2xl font-display font-black text-white">{value}</div>
        <div className="text-xs text-white/50">{label}</div>
        {sub && <div className="text-[10px] text-white/30 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const match   = useMatchStore((s) => s.liveMatch);
  const user    = useUserStore((s) => s.user);
  const sessionIMS = useDecisionStore((s) => s.sessionIMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20" />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">

      {/* Welcome Banner */}
      <motion.div variants={itemVariants} className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-neon-cyan/20">
        <div>
          <h1 className="font-display text-2xl font-black text-white">
            Welcome back, <span className="text-gradient-cyan">{user?.displayName?.split(" ")[0] ?? "Coach"}</span> 👋
          </h1>
          <p className="text-sm text-white/50 mt-1">
            MI vs CSK is LIVE — Your coaching decisions are shaping the game.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="ims-good">🔥 {user?.streak}-match streak</span>
            <span className="tag-pill">Rank #{user?.imsRank} globally</span>
            <span className="tag-pill">{user?.accuracy}% accuracy</span>
          </div>
        </div>
        <Link to="/coaching-room" className="btn-primary shrink-0 text-sm">
          <Swords size={16} /> Enter Coaching Room
        </Link>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatBlock icon={Zap}       label="Total IMS"       value={user?.imsTotal?.toLocaleString()} sub="All-time"        color="neon-cyan"   />
        <StatBlock icon={Target}    label="Decisions Made"  value={user?.decisionsCount}              sub="This season"     color="neon-purple" />
        <StatBlock icon={TrendingUp}label="Accuracy"        value={`${user?.accuracy}%`}              sub="vs Actual captain" color="neon-green" />
        <StatBlock icon={Trophy}    label="Global Rank"     value={`#${user?.imsRank}`}               sub={`Session: +${sessionIMS}`} color="neon-gold" />
      </motion.div>

      {/* Main Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: Score + Partnership */}
        <div className="space-y-4 xl:col-span-1">
          <ScoreWidget />
          <PartnershipChart />
        </div>

        {/* Center: IMS Trend + Skill Radar */}
        <div className="space-y-4 xl:col-span-1">
          {/* IMS Trend */}
          <div className="glass-card p-4">
            <div className="section-title mb-1">IMS Trend — Today's Session</div>
            <div className="section-subtitle mb-4">Impact Merit Score over the innings</div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={IMS_TREND}>
                <defs>
                  <linearGradient id="imsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00E5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <XAxis dataKey="over" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: "Over", position: "insideBottom", fill: "rgba(255,255,255,0.2)", fontSize: 10, offset: -2 }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#112035", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 10, color: "#fff", fontSize: 12 }} />
                <Area type="monotone" dataKey="ims" stroke="#00E5FF" strokeWidth={2} fill="url(#imsGrad)" dot={{ fill: "#00E5FF", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Radar */}
          <div className="glass-card p-4">
            <div className="section-title mb-1">Coaching Skills Radar</div>
            <div className="section-subtitle mb-3">Based on decision history</div>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={SKILL_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 9 }} />
                <Radar name="Skills" dataKey="A" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "#00E5FF", r: 3 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Win Probability + AI Insights */}
        <div className="space-y-4 xl:col-span-1">
          {/* Win Probability */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="section-title">Win Probability</div>
              <div className="flex items-center gap-1.5 text-xs text-neon-green/70">
                <Activity size={12} />
                <span>AI Powered</span>
              </div>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">{WIN_PROB.keyInsight}</p>
            <div className="space-y-2">
              {[
                { team: match?.team2.shortName, prob: WIN_PROB.winProbability.MI, color: "from-neon-cyan to-neon-blue", textColor: "text-neon-cyan" },
                { team: match?.team1.shortName, prob: WIN_PROB.winProbability.CSK, color: "from-neon-gold to-neon-orange", textColor: "text-neon-gold" },
              ].map(({ team, prob, color, textColor }) => (
                <div key={team}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-bold ${textColor}`}>{team}</span>
                    <span className={`font-mono font-black ${textColor}`}>{prob}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`} style={{ width: `${prob}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Shield size={10} /> Risk Factors
              </p>
              {WIN_PROB.riskFactors.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-neon-gold text-[10px] shrink-0 mt-0.5">⚠</span>
                  <span className="text-[11px] text-white/50">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top AI Insight */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <BrainCircuit size={15} className="text-neon-cyan" />
                Top AI Insight
              </div>
              <Link to="/ai-insights" className="text-xs text-neon-cyan/70 hover:text-neon-cyan flex items-center gap-1">
                See all <ArrowRight size={12} />
              </Link>
            </div>
            <InsightCard insight={AI_INSIGHTS[0]} />
          </div>
        </div>
      </motion.div>

      {/* Mini Leaderboard */}
      <motion.div variants={itemVariants} className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="section-title flex items-center gap-2"><Trophy size={16} className="text-neon-gold" /> Top Coaches</div>
            <div className="section-subtitle">Season leaderboard — Top 5</div>
          </div>
          <Link to="/leaderboard" className="btn-secondary text-xs px-3 py-2">
            Full Board <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-white/30 uppercase tracking-wider border-b border-white/[0.06]">
                <th className="pb-2 w-8">#</th>
                <th className="pb-2">Coach</th>
                <th className="pb-2 text-right">IMS</th>
                <th className="pb-2 text-right">Accuracy</th>
                <th className="pb-2 text-right hidden sm:table-cell">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {LEADERBOARD_DATA.slice(0, 5).map((entry) => (
                <tr key={entry.userId} className={`hover:bg-white/[0.03] transition-colors ${entry.userId === user?.uid ? "bg-neon-cyan/5" : ""}`}>
                  <td className="py-2.5 font-mono font-bold text-white/60">
                    {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank - 1] : entry.rank}
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-xs font-bold text-white">
                        {entry.avatar}
                      </div>
                      <span className="font-medium text-white text-sm">{entry.displayName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-neon-cyan">{entry.imsTotal.toLocaleString()}</td>
                  <td className="py-2.5 text-right">
                    <span className={entry.accuracy >= 75 ? "text-neon-green font-bold" : "text-white/60"}>{entry.accuracy}%</span>
                  </td>
                  <td className="py-2.5 text-right hidden sm:table-cell">
                    {entry.streak > 0 && <span className="text-neon-orange font-mono text-xs">🔥 {entry.streak}</span>}
                    {entry.streak === 0 && <span className="text-white/20">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
