import { DEFAULT_POSITIONS } from "@data/fieldPositions";
import { Crosshair, TrendingUp, TrendingDown, Minus } from "lucide-react";
import clsx from "clsx";

// Shot impact categories: how threatening each position is against current batter
const IMPACT_DATA = {
  wk:           { threat: 85, saves: 12, icon: "🧤", tip: "Essential — covers edges and stumpings" },
  slip1:        { threat: 78, saves: 8,  icon: "🎯", tip: "Primary edge catcher — vital vs Dube"   },
  slip2:        { threat: 60, saves: 5,  icon: "🎯", tip: "Second cordon safety net"                },
  gully:        { threat: 55, saves: 4,  icon: "💨", tip: "Top-edge off the cut shot"               },
  point:        { threat: 40, saves: 9,  icon: "🏃", tip: "Cuts off point boundary — Dube's favourite" },
  coverPt:      { threat: 35, saves: 11, icon: "🏃", tip: "Drive-stopper, saves 4s through covers"  },
  extraCover:   { threat: 28, saves: 8,  icon: "🏃", tip: "Covers straight and extra-cover drive"   },
  midOff:       { threat: 30, saves: 7,  icon: "🏃", tip: "Stops straight drives, creates dot balls"},
  midOn:        { threat: 30, saves: 7,  icon: "🏃", tip: "On-side stopper for flick/on-drive"      },
  midWicket:    { threat: 45, saves: 9,  icon: "💥", tip: "Jadeja's pull-shot zone — high value"    },
  squareLeg:    { threat: 38, saves: 6,  icon: "🏃", tip: "Sweep and leg-glance cover"              },
  fineLeg:      { threat: 55, saves: 10, icon: "💨", tip: "Fine-leg saves leg-side width & glances"  },
  thirdMan:     { threat: 48, saves: 9,  icon: "💨", tip: "Edges and fine deflections — crucial"    },
  longOff:      { threat: 72, saves: 14, icon: "🔥", tip: "Boundary save — Dube targets this zone!" },
  longOn:       { threat: 68, saves: 13, icon: "🔥", tip: "Power-hit zone for left-handers"         },
  deepCover:    { threat: 42, saves: 8,  icon: "💥", tip: "Sweeper saves drive boundaries"          },
  deepPoint:    { threat: 38, saves: 7,  icon: "💥", tip: "Point sweeper — cut-shot boundary"       },
  deepSqLeg:    { threat: 50, saves: 10, icon: "💥", tip: "Deep leg saves pull and glance shots"    },
  deepMidWkt:   { threat: 60, saves: 11, icon: "🔥", tip: "Jadeja's slog-sweep zone"               },
  cowCorner:    { threat: 65, saves: 12, icon: "🔥", tip: "Dube's maximum — slog to cow corner"     },
};

function ImpactDot({ threat }) {
  const color = threat >= 70 ? "#FF1744" : threat >= 50 ? "#FF9100" : threat >= 35 ? "#FFD600" : "#00E676";
  return <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}88` }} />;
}

export default function ImpactPanel({ activeIds, hoveredId, className }) {
  const active   = activeIds.map((id) => ({ id, pos: DEFAULT_POSITIONS[id], imp: IMPACT_DATA[id] })).filter(({ imp }) => imp);
  const totalSaves   = active.reduce((s, { imp }) => s + (imp?.saves  ?? 0), 0);
  const avgThreat    = active.length ? Math.round(active.reduce((s, { imp }) => s + (imp?.threat ?? 0), 0) / active.length) : 0;
  const uncovered    = Object.keys(IMPACT_DATA).filter((id) => !activeIds.includes(id) && (IMPACT_DATA[id]?.threat ?? 0) >= 55);

  const hovered = hoveredId ? { pos: DEFAULT_POSITIONS[hoveredId], imp: IMPACT_DATA[hoveredId] } : null;

  return (
    <div className={clsx("glass-card p-4 space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Crosshair size={14} className="text-neon-cyan" />
        <div className="section-title text-sm">Impact Analysis</div>
      </div>

      {/* Hover tooltip */}
      {hovered && hovered.imp && (
        <div className="p-3 rounded-xl bg-neon-cyan/8 border border-neon-cyan/20 animate-fade-in">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">{hovered.imp.icon}</span>
            <span className="text-sm font-bold text-white">{hovered.pos?.label}</span>
            <ImpactDot threat={hovered.imp.threat} />
            <span className="ml-auto font-mono text-xs text-neon-cyan font-bold">Threat {hovered.imp.threat}%</span>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed">{hovered.imp.tip}</p>
          <div className="flex gap-3 mt-2 text-[10px] text-white/35">
            <span>💾 Saves ~{hovered.imp.saves} runs/match</span>
          </div>
        </div>
      )}

      {/* Session metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-surface-2 border border-white/[0.06] text-center">
          <div className="font-mono font-black text-neon-green text-lg">{totalSaves}</div>
          <div className="text-[9px] text-white/30 uppercase tracking-wider">Est. Runs Saved</div>
        </div>
        <div className="p-2.5 rounded-xl bg-surface-2 border border-white/[0.06] text-center">
          <div className={clsx("font-mono font-black text-lg",
            avgThreat >= 60 ? "text-neon-red" : avgThreat >= 45 ? "text-neon-gold" : "text-neon-green"
          )}>{avgThreat}%</div>
          <div className="text-[9px] text-white/30 uppercase tracking-wider">Avg Threat Cover</div>
        </div>
      </div>

      {/* Vulnerability zones */}
      {uncovered.length > 0 && (
        <div>
          <div className="text-[10px] text-neon-red/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <TrendingDown size={10} /> Exposed Zones
          </div>
          <div className="flex flex-wrap gap-1">
            {uncovered.map((id) => (
              <span key={id} className="text-[10px] px-2 py-0.5 rounded-full bg-neon-red/10 border border-neon-red/25 text-neon-red/80 font-medium">
                {DEFAULT_POSITIONS[id]?.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active fielder list by threat level */}
      <div>
        <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Field Strength (by impact)</div>
        <div className="space-y-1 max-h-40 overflow-y-auto no-scrollbar">
          {[...active].sort((a, b) => (b.imp?.threat ?? 0) - (a.imp?.threat ?? 0)).map(({ id, pos, imp }) => (
            <div key={id} className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
              <ImpactDot threat={imp.threat} />
              <span className="text-[11px] text-white/60 flex-1 truncate group-hover:text-white/80 transition-colors">{pos?.label}</span>
              <span className="text-[10px]">{imp.icon}</span>
              <span className={clsx("font-mono text-[10px] font-bold w-8 text-right",
                imp.threat >= 70 ? "text-neon-red" : imp.threat >= 50 ? "text-neon-gold" : "text-neon-green"
              )}>{imp.threat}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
