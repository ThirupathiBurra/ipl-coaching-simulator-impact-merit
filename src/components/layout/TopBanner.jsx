import { useMatchStore } from "@store/matchStore";
import { Link } from "react-router-dom";
import { Play, Activity, ChevronRight, Wifi } from "lucide-react";

export default function TopBanner() {
  const match = useMatchStore((s) => s.liveMatch);
  if (!match) return null;

  const { team1, team2, battingTeam, over, ball, target, requiredRunRate } = match;
  const batting = battingTeam === team1.id ? team1 : team2;
  const fielding = battingTeam === team1.id ? team2 : team1;

  return (
    <header className="shrink-0 border-b border-white/[0.06] bg-navy-900/60 backdrop-blur-md px-4 lg:px-6 py-2">
      <div className="flex items-center gap-4 max-w-full">
        {/* Live Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="live-dot" />
          <span className="text-xs font-bold text-neon-red tracking-wider ml-2">LIVE</span>
        </div>

        {/* Match Score */}
        <Link
          to="/coaching-room"
          className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
        >
          {/* Team 1 */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-navy-950"
              style={{ background: `linear-gradient(135deg, ${fielding.color}, ${fielding.accentColor})` }}>
              {fielding.shortName[0]}
            </div>
            <span className="font-display font-bold text-white text-sm hidden sm:block">{fielding.shortName}</span>
            <span className="font-mono font-bold text-white/80 text-sm">
              {fielding.score}/{fielding.wickets}
            </span>
            <span className="text-white/30 text-xs">({fielding.overs})</span>
          </div>

          <span className="text-white/30 text-xs font-medium shrink-0">vs</span>

          {/* Team 2 — currently batting */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-navy-950 ring-1 ring-neon-cyan/50"
              style={{ background: `linear-gradient(135deg, ${batting.color}, ${batting.accentColor})` }}>
              {batting.shortName[0]}
            </div>
            <span className="font-display font-bold text-neon-cyan text-sm hidden sm:block">{batting.shortName}</span>
            <span className="font-mono font-bold text-neon-cyan text-sm">
              {batting.score}/{batting.wickets}
            </span>
            <span className="text-white/30 text-xs">({batting.overs})</span>
          </div>

          {/* Target */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neon-gold/10 border border-neon-gold/25">
            <span className="text-xs text-white/50">Target</span>
            <span className="font-mono font-bold text-neon-gold text-sm">{target}</span>
          </div>

          {/* RRR */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neon-red/10 border border-neon-red/25">
            <Activity size={12} className="text-neon-red" />
            <span className="font-mono font-bold text-neon-red text-sm">RRR {requiredRunRate}</span>
          </div>

          {/* Over */}
          <div className="hidden sm:flex items-center gap-1.5 ml-auto shrink-0">
            <span className="text-xs text-white/40">Over</span>
            <span className="font-mono font-bold text-white text-sm">{over}.{ball}</span>
          </div>
        </Link>

        {/* CTA */}
        <Link
          to="/coaching-room"
          className="btn-primary shrink-0 text-xs px-3 py-2"
        >
          <Play size={13} />
          <span className="hidden sm:inline">Coach Now</span>
        </Link>

        {/* Connection status */}
        <div className="shrink-0 flex items-center gap-1.5 text-neon-green/70">
          <Wifi size={14} />
        </div>
      </div>
    </header>
  );
}
