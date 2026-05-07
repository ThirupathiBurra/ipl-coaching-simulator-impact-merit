import { useMatchStore } from "@store/matchStore";
import clsx from "clsx";

function Ball({ val }) {
  const isW = val === "W", is4 = val === "4", is6 = val === "6", isDot = val === ".";
  return (
    <div className={clsx(
      "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black font-mono border transition-all",
      isW  && "bg-neon-red/25    border-neon-red/70    text-neon-red    shadow-[0_0_8px_rgba(255,23,68,0.5)]",
      is6  && "bg-neon-purple/25 border-neon-purple/70 text-neon-purple shadow-[0_0_8px_rgba(170,0,255,0.5)]",
      is4  && "bg-neon-blue/25   border-neon-blue/70   text-neon-blue",
      isDot&& "bg-white/5        border-white/10        text-white/25",
      !isW && !is4 && !is6 && !isDot && "bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan",
    )}>{val}</div>
  );
}

export default function LiveScoreboard() {
  const match = useMatchStore((s) => s.liveMatch);
  if (!match) return null;

  const { team1, team2, battingTeam, over, ball, target, requiredRunRate, currentRunRate, requiredRuns, requiredBalls, recentBalls, currentBowler, currentBatsmen } = match;
  const batting  = battingTeam === team1.id ? team1 : team2;
  const fielding = battingTeam === team1.id ? team2 : team1;

  return (
    <div className="glass-card border border-neon-cyan/15 overflow-hidden">
      {/* Broadcast top strip */}
      <div className="bg-gradient-to-r from-navy-800 via-navy-700 to-navy-800 border-b border-white/[0.07] px-5 py-2 flex items-center gap-3">
        <span className="live-dot" />
        <span className="text-[10px] font-black text-neon-red tracking-[0.2em] ml-2">LIVE</span>
        <span className="text-[10px] text-white/30 ml-2">•</span>
        <span className="text-[11px] text-white/60 font-medium">{match.venue}</span>
        <span className="ml-auto text-[10px] text-white/30 font-mono">INNING 2 · OVER {over}.{ball}</span>
      </div>

      {/* Main scoreboard */}
      <div className="px-5 py-4 grid grid-cols-3 gap-4 items-center">
        {/* Fielding team */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black"
              style={{ background: `linear-gradient(135deg,${fielding.color},${fielding.accentColor})`, color: "#fff" }}>
              {fielding.shortName[0]}
            </div>
            <div>
              <div className="text-xs font-bold text-white/70">{fielding.name}</div>
              <div className="text-[10px] text-white/30">SET TOTAL</div>
            </div>
          </div>
          <div className="font-mono text-3xl font-black text-white/80 leading-none mt-1">
            {fielding.score}<span className="text-white/30 text-lg">/{fielding.wickets}</span>
          </div>
          <div className="text-[10px] text-white/30">({fielding.overs} overs)</div>
        </div>

        {/* Center: Target + Chase info */}
        <div className="flex flex-col items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-neon-gold/10 border border-neon-gold/30 text-center w-full">
            <div className="text-[9px] text-neon-gold/60 uppercase tracking-widest">Target</div>
            <div className="font-mono font-black text-neon-gold text-2xl">{target}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="text-center px-2 py-1.5 rounded-lg bg-neon-red/10 border border-neon-red/25">
              <div className="font-mono font-black text-neon-red text-sm">{requiredRuns}</div>
              <div className="text-[9px] text-white/30">Needed</div>
            </div>
            <div className="text-center px-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="font-mono font-black text-white text-sm">{requiredBalls}</div>
              <div className="text-[9px] text-white/30">Balls</div>
            </div>
          </div>
        </div>

        {/* Batting team */}
        <div className="flex flex-col gap-1 items-end text-right">
          <div className="flex items-center gap-2 justify-end">
            <div>
              <div className="text-xs font-bold text-neon-cyan">{batting.name}</div>
              <div className="text-[10px] text-white/30">BATTING 🏏</div>
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black ring-1 ring-neon-cyan/40"
              style={{ background: `linear-gradient(135deg,${batting.color},${batting.accentColor})`, color: "#fff" }}>
              {batting.shortName[0]}
            </div>
          </div>
          <div className="font-mono text-3xl font-black text-neon-cyan leading-none mt-1">
            {batting.score}<span className="text-neon-cyan/40 text-lg">/{batting.wickets}</span>
          </div>
          <div className="text-[10px] text-white/30">({batting.overs} overs)</div>
        </div>
      </div>

      {/* Run Rate row */}
      <div className="grid grid-cols-4 border-t border-white/[0.06] divide-x divide-white/[0.06]">
        {[
          { label: "CRR", value: currentRunRate, color: currentRunRate >= requiredRunRate ? "text-neon-green" : "text-neon-red" },
          { label: "RRR", value: requiredRunRate, color: "text-neon-red" },
          { label: "P'ship", value: `13(12)`, color: "text-neon-cyan" },
          { label: "Proj.", value: Math.round(currentRunRate * 20), color: "text-white/60" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col items-center py-2">
            <div className={clsx("font-mono font-black text-base leading-none", color)}>{value}</div>
            <div className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent balls + Batsmen */}
      <div className="grid grid-cols-2 border-t border-white/[0.06]">
        {/* Recent balls */}
        <div className="px-4 py-3 border-r border-white/[0.06]">
          <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Last 12 Balls</div>
          <div className="flex flex-wrap gap-1.5">
            {recentBalls.map((b, i) => <Ball key={i} val={b} />)}
          </div>
        </div>
        {/* Batsmen */}
        <div className="px-4 py-3 space-y-1.5">
          <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">At the Crease</div>
          {currentBatsmen.map((b) => (
            <div key={b.playerId} className="flex items-center justify-between text-xs">
              <span className="font-medium text-white flex items-center gap-1">
                {b.isStriker && <span className="text-neon-gold text-[10px]">*</span>}
                {b.name}
              </span>
              <span className="font-mono text-white/70">{b.runs}<span className="text-white/30">({b.balls})</span></span>
              <span className={clsx("font-mono font-bold text-[11px]", b.sr >= 150 ? "text-neon-green" : b.sr >= 120 ? "text-neon-gold" : "text-white/50")}>
                {b.sr}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/[0.05]">
            <span className="text-neon-purple/80 font-medium">{currentBowler.name} 🎳</span>
            <span className="font-mono text-white/50">{currentBowler.overs}ov {currentBowler.wickets}W eco {currentBowler.economy}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
