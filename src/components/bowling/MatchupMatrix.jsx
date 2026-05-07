import { MATCHUP_DATA } from "@data/bowlingData";
import { BOWLERS } from "@data/bowlingData";
import clsx from "clsx";

function SRCell({ sr, dismissals }) {
  const color = sr <= 100 ? "#00E676" : sr <= 140 ? "#FFD600" : sr <= 170 ? "#FF9100" : "#FF1744";
  return (
    <div className="flex flex-col items-center py-1.5 px-1 rounded-lg" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
      <span className="text-[11px] font-black font-mono" style={{ color }}>{sr}</span>
      {dismissals > 0 && <span className="text-[8px] text-neon-green mt-0.5">{dismissals}W</span>}
    </div>
  );
}

export default function MatchupMatrix({ highlightBowlerId, className }) {
  const batters = Object.keys(MATCHUP_DATA);
  const bowlers = BOWLERS;

  return (
    <div className={clsx("glass-card p-4 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="section-title text-sm">Career Matchup Matrix</div>
          <div className="section-subtitle text-xs">Strike Rate vs each bowler (lower = better for bowler)</div>
        </div>
        <div className="flex items-center gap-2 text-[9px] flex-wrap">
          {[
            { color: "#00E676", label: "≤100" },
            { color: "#FFD600", label: "≤140" },
            { color: "#FF9100", label: "≤170" },
            { color: "#FF1744", label: "170+" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: color }} />
              <span className="text-white/35">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-max">
          <thead>
            <tr>
              <th className="text-left text-[10px] text-white/30 font-semibold uppercase tracking-wider pb-2 pr-3 min-w-[90px]">Batter</th>
              {bowlers.map((b) => (
                <th key={b.id} className={clsx("text-center text-[10px] font-bold pb-2 px-1 transition-all", highlightBowlerId === b.id ? "text-neon-cyan" : "text-white/30")}>
                  {b.avatar}
                  {highlightBowlerId === b.id && <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mx-auto mt-0.5" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-1">
            {batters.map((batter) => {
              const data = MATCHUP_DATA[batter];
              return (
                <tr key={batter} className="border-t border-white/[0.04]">
                  <td className="py-1.5 pr-3">
                    <div className="text-xs font-semibold text-white/75 truncate max-w-[88px]">{batter}</div>
                    <div className="text-[9px] text-white/30 font-mono">{data.overall.balls}b {data.overall.runs}r</div>
                  </td>
                  {bowlers.map((b) => {
                    const mu = data.vs[b.id];
                    return (
                      <td key={b.id} className="py-1.5 px-1">
                        {mu ? (
                          <SRCell sr={mu.sr} dismissals={mu.dismissals} />
                        ) : (
                          <div className="text-center text-[10px] text-white/15">—</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
