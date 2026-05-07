import { useUserStore } from "@store/userStore";
import { useDecisionStore } from "@store/decisionStore";
import IMSScoreCard from "@components/common/IMSScoreCard";
import {
  UserCircle2, Settings, LogOut, Zap, Target, TrendingUp,
  Trophy, Flame, Calendar, BarChart2, Award, CheckCircle2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import clsx from "clsx";

const DECISION_HISTORY_CHART = [
  { match: "M38", ims: 420 }, { match: "M39", ims: 380 }, { match: "M40", ims: 550 },
  { match: "M41", ims: 490 }, { match: "M42", ims: 310 }, { match: "M43*", ims: 148 },
];

const ACHIEVEMENTS = [
  { icon: "🎯", title: "Sharp Shooter",    desc: "80%+ accuracy in 5 matches",     earned: true  },
  { icon: "🔥", title: "On Fire",          desc: "10+ match win streak",            earned: true  },
  { icon: "🏆", title: "Elite Coach",      desc: "Reach 9,000 IMS",                earned: false },
  { icon: "🧠", title: "Tactician",        desc: "Apply 20 AI insights",           earned: true  },
  { icon: "⚡", title: "Quick Draw",       desc: "Submit decision in under 10s",    earned: false },
  { icon: "👑", title: "Legend Status",    desc: "Reach #1 on global leaderboard",  earned: false },
];

const BADGE_COLORS = {
  LEGEND:  "from-neon-gold to-neon-orange",
  ELITE:   "from-neon-cyan to-neon-blue",
  PRO:     "from-neon-purple to-neon-blue",
  SKILLED: "from-neon-green to-neon-cyan",
  AMATEUR: "from-white/30 to-white/10",
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}/10 border border-${color}/20`}>
        <Icon size={16} className={`text-${color}`} />
      </div>
      <div className={`font-display font-black text-2xl text-${color}`}>{value}</div>
      <div className="text-xs text-white/40">{label}</div>
    </div>
  );
}

export default function UserProfile() {
  const user        = useUserStore((s) => s.user);
  const logout      = useUserStore((s) => s.logout);
  const sessionIMS  = useDecisionStore((s) => s.sessionIMS);

  if (!user) return <div className="text-center py-20 text-white/40">Not logged in</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Profile Hero */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-4xl font-black text-white shadow-neon-purple">
            {user.displayName?.[0] ?? "C"}
          </div>
          <div className={clsx(
            "absolute -bottom-2 -right-2 px-2 py-1 rounded-lg text-[10px] font-black text-navy-950 bg-gradient-to-r",
            BADGE_COLORS[user.badge]
          )}>
            {user.badge}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-display text-3xl font-black text-white">{user.displayName}</h1>
          <p className="text-white/40 text-sm mt-1">{user.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="tag-pill flex items-center gap-1"><Calendar size={10} /> Joined {new Date(user.joinedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
            <span className="tag-pill flex items-center gap-1"><Trophy size={10} /> Rank #{user.imsRank}</span>
            <span className="tag-pill flex items-center gap-1"><Flame size={10} /> {user.streak}-match streak</span>
            {sessionIMS > 0 && <span className="ims-great flex items-center gap-1"><Zap size={10} /> +{sessionIMS} today</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          <button className="btn-secondary text-sm"><Settings size={15} /> Settings</button>
          <button onClick={logout} className="btn-danger text-sm"><LogOut size={15} /> Logout</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Zap}        label="Total IMS"       value={user.imsTotal.toLocaleString()} color="neon-cyan"   />
        <StatCard icon={Target}     label="Decisions Made"  value={user.decisionsCount}             color="neon-purple" />
        <StatCard icon={TrendingUp} label="Accuracy"        value={`${user.accuracy}%`}             color="neon-green"  />
        <StatCard icon={BarChart2}  label="Matches Played"  value={user.matchesPlayed}              color="neon-gold"   />
      </div>

      {/* IMS Score + Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* IMS Ring */}
        <div className="glass-card p-6 flex flex-col items-center gap-4">
          <div className="section-title w-full text-center">Your IMS Rating</div>
          <IMSScoreCard score={Math.round(user.imsTotal / user.decisionsCount)} label="Average per Decision" size="lg" animated={false} />
          <div className="w-full space-y-2 text-xs">
            {[
              { label: "Field Placement", pct: 80 },
              { label: "Bowling Change",  pct: 73 },
              { label: "Tactical Reads",  pct: 65 },
            ].map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between mb-0.5 text-white/50"><span>{label}</span><span className="font-mono">{pct}%</span></div>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card p-4 sm:col-span-2">
          <div className="section-title mb-1">IMS Per Match</div>
          <div className="section-subtitle mb-4">Last 6 matches</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={DECISION_HISTORY_CHART} barSize={28}>
              <XAxis dataKey="match" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#112035", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 10, color: "#fff", fontSize: 12 }} />
              <Bar dataKey="ims" radius={[6, 6, 0, 0]}>
                {DECISION_HISTORY_CHART.map((_, i) => (
                  <Cell key={i} fill={i === DECISION_HISTORY_CHART.length - 1 ? "#00E5FF" : "rgba(0,229,255,0.35)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card p-4 space-y-4">
        <div>
          <div className="section-title flex items-center gap-2"><Award size={16} className="text-neon-gold" /> Achievements</div>
          <div className="section-subtitle">{ACHIEVEMENTS.filter((a) => a.earned).length}/{ACHIEVEMENTS.length} unlocked</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.title}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
                a.earned
                  ? "bg-neon-gold/10 border-neon-gold/25"
                  : "bg-white/[0.03] border-white/[0.06] opacity-50"
              )}
            >
              <span className="text-2xl">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={clsx("text-sm font-semibold", a.earned ? "text-white" : "text-white/40")}>{a.title}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{a.desc}</div>
              </div>
              {a.earned && <CheckCircle2 size={16} className="text-neon-green shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
