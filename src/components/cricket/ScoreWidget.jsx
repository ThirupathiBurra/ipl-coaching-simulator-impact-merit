import { useMatchStore } from "@store/matchStore";
import clsx from "clsx";

function Ball({ result }) {
  const isWicket = result === "W";
  const isFour   = result === "4";
  const isSix    = result === "6";
  const isDot    = result === ".";

  return (
    <div className={clsx(
      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border transition-all duration-300",
      isWicket && "bg-neon-red/20 border-neon-red/60 text-neon-red shadow-[0_0_10px_rgba(255,23,68,0.4)]",
      isSix    && "bg-neon-purple/20 border-neon-purple/60 text-neon-purple shadow-[0_0_10px_rgba(170,0,255,0.4)]",
      isFour   && "bg-neon-blue/20 border-neon-blue/60 text-neon-blue",
      isDot    && "bg-white/5 border-white/10 text-white/30",
      !isWicket && !isFour && !isSix && !isDot && "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan",
    )}>
      {result}
    </div>
  );
}

export default function ScoreWidget({ className }) {
  const match = useMatchStore((s) => s.liveMatch);
  if (!match) return null;

  const { team1, team2, battingTeam, over, ball, target, requiredRunRate, currentRunRate, recentBalls } = match;
  const batting  = battingTeam === team1.id ? team1 : team2;
  const fielding = battingTeam === team1.id ? team2 : team1;

  return (
    <div className={clsx("glass-card p-4 space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-xs font-bold text-neon-red tracking-widest ml-2">LIVE</span>
          <span className="text-xs text-white/40 ml-1">Over {over}.{ball}</span>
        </div>
        <span className="text-xs text-white/40">{match.venue?.split(",")[0]}</span>
      </div>

      {/* Scores */}
      <div className="flex items-center justify-between">
        {/* Fielding team */}
        <div className="text-center">
          <div className="text-xs font-semibold text-white/50 mb-1">{fielding.shortName}</div>
          <div className="font-mono text-2xl font-black text-white/80">
            {fielding.score}<span className="text-white/30 text-base">/{fielding.wickets}</span>
          </div>
          <div className="text-[10px] text-white/30">({fielding.overs} ov)</div>
        </div>

        {/* VS + Target */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-white/30">vs</span>
          <div className="px-3 py-1 rounded-lg bg-neon-gold/15 border border-neon-gold/30 text-center">
            <div className="text-[9px] text-neon-gold/70 uppercase tracking-wider">Target</div>
            <div className="font-mono font-black text-neon-gold text-lg">{target}</div>
          </div>
        </div>

        {/* Batting team */}
        <div className="text-center">
          <div className="text-xs font-semibold text-neon-cyan mb-1">{batting.shortName} 🏏</div>
          <div className="font-mono text-2xl font-black text-neon-cyan">
            {batting.score}<span className="text-neon-cyan/40 text-base">/{batting.wickets}</span>
          </div>
          <div className="text-[10px] text-white/30">({batting.overs} ov)</div>
        </div>
      </div>

      {/* Run Rates */}
      <div className="grid grid-cols-2 gap-2">
        <div className="stat-chip">
          <span className="stat-value text-neon-cyan text-base">{currentRunRate}</span>
          <span className="stat-label">CRR</span>
        </div>
        <div className="stat-chip">
          <span className="stat-value text-neon-red text-base">{requiredRunRate}</span>
          <span className="stat-label">RRR</span>
        </div>
      </div>

      {/* Recent Balls */}
      <div>
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Last 12 Balls</p>
        <div className="flex flex-wrap gap-1.5">
          {recentBalls.map((b, i) => <Ball key={i} result={b} />)}
        </div>
      </div>

      {/* Current Batsmen */}
      <div>
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">At the Crease</p>
        <div className="space-y-1.5">
          {match.currentBatsmen.map((bat) => (
            <div key={bat.playerId} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2">
              <span className="text-sm font-medium text-white">{bat.name} *</span>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="font-bold text-white">{bat.runs}({bat.balls})</span>
                <span className="text-white/40">{bat.fours}x4</span>
                <span className="text-white/40">{bat.sixes}x6</span>
                <span className={clsx("font-bold", bat.sr >= 150 ? "text-neon-green" : bat.sr >= 120 ? "text-neon-gold" : "text-white/60")}>
                  SR {bat.sr}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Bowler */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
        <span className="text-xs text-white/50">Bowling</span>
        <span className="text-sm font-medium text-white">{match.currentBowler.name}</span>
        <span className="font-mono text-xs text-neon-purple">
          {match.currentBowler.overs}ov · {match.currentBowler.wickets}W · Eco {match.currentBowler.economy}
        </span>
      </div>
    </div>
  );
}
