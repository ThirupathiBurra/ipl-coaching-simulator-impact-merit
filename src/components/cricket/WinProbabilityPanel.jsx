import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { WIN_PROBABILITY_HISTORY } from "@data/matchData";
import { useMatchStore } from "@store/matchStore";
import { Activity } from "lucide-react";
import clsx from "clsx";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-800 border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <div className="text-white/40 mb-1">Over {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="font-bold text-white">{p.name} {p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function WinProbabilityPanel({ className }) {
  const match = useMatchStore((s) => s.liveMatch);
  if (!match) return null;

  const latest = WIN_PROBABILITY_HISTORY[WIN_PROBABILITY_HISTORY.length - 1];
  const team1  = match.team1;
  const team2  = match.team2;

  // Determine fielding=team1(MI) batting=team2(CSK)
  const fieldingWP = latest.mi;
  const battingWP  = latest.csk;

  return (
    <div className={clsx("glass-card p-4 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="section-title">Win Probability</div>
          <div className="section-subtitle">AI-powered over-by-over</div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-neon-green/70">
          <Activity size={12} className="animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      {/* Current probability bars */}
      <div className="space-y-3">
        {[
          { team: team1.shortName, pct: fieldingWP, color: "from-neon-cyan to-neon-blue",   text: "text-neon-cyan",  glow: "shadow-neon-cyan"  },
          { team: team2.shortName, pct: battingWP,  color: "from-neon-gold to-neon-orange", text: "text-neon-gold",  glow: "shadow-neon-gold"  },
        ].map(({ team, pct, color, text }) => (
          <div key={team}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className={clsx("font-bold", text)}>{team}</span>
              <span className={clsx("font-mono font-black text-sm", text)}>{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/8 overflow-hidden">
              <div
                className={clsx("h-full rounded-full bg-gradient-to-r transition-all duration-1000", color)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* vs marker */}
      <div className="relative h-px bg-white/[0.06]">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-navy-900 text-[9px] text-white/25 font-bold">vs</div>
      </div>

      {/* History chart */}
      <div>
        <div className="text-[10px] text-white/30 mb-2 uppercase tracking-wider">Probability History</div>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={WIN_PROBABILITY_HISTORY} margin={{ top: 2, right: 2, bottom: 0, left: -28 }}>
            <defs>
              <linearGradient id="miWP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00E5FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="cskWP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#FFD600" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FFD600" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <XAxis dataKey="over" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={false} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="mi"  name="MI"  stroke="#00E5FF" strokeWidth={2} fill="url(#miWP)"  dot={false} activeDot={{ r: 3 }} />
            <Area type="monotone" dataKey="csk" name="CSK" stroke="#FFD600" strokeWidth={1.5} fill="url(#cskWP)" dot={false} activeDot={{ r: 3 }} strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI note */}
      <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-neon-cyan/5 border border-neon-cyan/15">
        <span className="text-sm shrink-0">🧠</span>
        <p className="text-[11px] text-white/50 leading-relaxed">
          CSK require 180+ SR from remaining batters. Dhoni (yet to bat) is the key wildcard.
        </p>
      </div>
    </div>
  );
}
