import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { OVER_DATA, WIN_PROBABILITY_HISTORY } from "@data/matchData";
import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-800 border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <div className="text-white/40 mb-1 font-medium">Over {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-white/70">{p.name}:</span>
          <span className="font-mono font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function MomentumGraph({ className }) {
  const lastOver = OVER_DATA[OVER_DATA.length - 1];
  const prevOver = OVER_DATA[OVER_DATA.length - 2];
  const trending = lastOver.runRate >= prevOver.runRate;

  return (
    <div className={clsx("glass-card p-4 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="section-title">Run Momentum</div>
          <div className="section-subtitle">Runs per over + Required RR</div>
        </div>
        <div className={clsx("flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border",
          trending ? "text-neon-green bg-neon-green/10 border-neon-green/30" : "text-neon-red bg-neon-red/10 border-neon-red/30"
        )}>
          {trending ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trending ? "Gaining" : "Falling behind"}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={OVER_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="runsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#00E5FF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="rrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#FF1744" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#FF1744" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <XAxis dataKey="over" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 18]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={lastOver.target_rr} stroke="rgba(255,23,68,0.35)" strokeDasharray="4 3" label={{ value: `RRR ${lastOver.target_rr}`, fill: "rgba(255,23,68,0.6)", fontSize: 9, position: "right" }} />
          <Area type="monotone" dataKey="runs"      name="Runs/Over" stroke="#00E5FF" strokeWidth={2} fill="url(#runsGrad)" dot={false} activeDot={{ r: 4, fill: "#00E5FF" }} />
          <Area type="monotone" dataKey="target_rr" name="Req. RR"  stroke="#FF1744" strokeWidth={1.5} fill="url(#rrGrad)" dot={false} strokeDasharray="4 3" activeDot={{ r: 3, fill: "#FF1744" }} />
        </AreaChart>
      </ResponsiveContainer>

      {/* Over-by-over mini bars */}
      <div className="flex items-end gap-0.5 h-10">
        {OVER_DATA.map((d, i) => {
          const isLast = i === OVER_DATA.length - 1;
          const h = Math.max(6, (d.runs / 18) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group">
              <div className="relative w-full flex items-end justify-center" style={{ height: 32 }}>
                <div
                  className={clsx("w-full rounded-t-sm transition-all duration-500", isLast ? "bg-neon-cyan" : "bg-neon-cyan/30 group-hover:bg-neon-cyan/50")}
                  style={{ height: `${h}%` }}
                />
                {d.wickets > 0 && (
                  <div className="absolute top-0 w-1 h-1 rounded-full bg-neon-red" title={`${d.wickets}W`} />
                )}
              </div>
              <div className="text-[8px] text-white/20">{d.over}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
