import { TrendingUp, TrendingDown, Minus, Star, Zap, Shield } from "lucide-react";
import clsx from "clsx";

// ─── Form Dots ────────────────────────────────────────────────────────────────
function FormDots({ form }) {
  return (
    <div className="flex items-center gap-1">
      {form.map((w, i) => (
        <div
          key={i}
          className={clsx(
            "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all",
            w >= 2 ? "bg-neon-green/20 border-neon-green/50 text-neon-green"
            : w === 1 ? "bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan"
            : "bg-white/5 border-white/10 text-white/25"
          )}
        >
          {w === 0 ? "·" : w}
        </div>
      ))}
    </div>
  );
}

// ─── Economy Gauge ────────────────────────────────────────────────────────────
function EconomyGauge({ value, label }) {
  const max = 14;
  const pct = Math.min(100, (value / max) * 100);
  const color = value <= 7 ? "#00E676" : value <= 9.5 ? "#FFD600" : value <= 11 ? "#FF9100" : "#FF1744";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-white/40">{label}</span>
        <span className="font-mono font-black" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Style badge ──────────────────────────────────────────────────────────────
const STYLE_CONFIG = {
  FAST:   { label: "FAST",   color: "text-neon-red",    bg: "bg-neon-red/10    border-neon-red/30",    icon: Zap     },
  SPIN:   { label: "SPIN",   color: "text-neon-purple", bg: "bg-neon-purple/10 border-neon-purple/30", icon: Star    },
  MEDIUM: { label: "MED",    color: "text-neon-gold",   bg: "bg-neon-gold/10   border-neon-gold/30",   icon: Shield  },
};

// ─── Main Bowler Card ─────────────────────────────────────────────────────────
export default function BowlerCard({
  bowler, isSelected, isRecommended, onClick, matchupData, compact = false,
}) {
  const { name, shortName, style, styleCode, avatar, color, season, match, recentForm, formTrend, rating } = bowler;
  const styleCfg = STYLE_CONFIG[styleCode] || STYLE_CONFIG.MEDIUM;
  const StyleIcon = styleCfg.icon;
  const batterMatchup = matchupData;

  const trendIcon = formTrend === "up" ? TrendingUp : formTrend === "down" ? TrendingDown : Minus;
  const TrendIcon = trendIcon;
  const trendColor = formTrend === "up" ? "text-neon-green" : formTrend === "down" ? "text-neon-red" : "text-white/40";

  const oversDisplay = `${match.overs}/${match.overs + match.oversLeft}`;
  const canBowl = match.oversLeft > 0;

  return (
    <button
      onClick={() => canBowl && onClick(bowler.id)}
      disabled={!canBowl}
      className={clsx(
        "w-full text-left rounded-2xl border transition-all duration-250 group relative overflow-hidden",
        isSelected
          ? "shadow-lg shadow-[0_0_20px_rgba(0,0,0,0.4)]"
          : canBowl
          ? "hover:border-white/20 hover:shadow-lg"
          : "opacity-40 cursor-not-allowed",
        compact ? "p-3" : "p-4"
      )}
      style={isSelected
        ? { borderColor: color, background: `linear-gradient(135deg, ${color}18, ${color}08)`, boxShadow: `0 0 24px ${color}25` }
        : { background: "linear-gradient(135deg, rgba(22,43,71,0.55), rgba(11,22,40,0.7))", borderColor: "rgba(255,255,255,0.08)" }
      }
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-gold/15 border border-neon-gold/35 text-[9px] font-black text-neon-gold uppercase tracking-wider">
          <Star size={8} className="fill-neon-gold" /> AI Pick
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div
          className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-all",
            isSelected ? "shadow-lg" : ""
          )}
          style={{ background: `linear-gradient(135deg, ${color}50, ${color}20)`, color, border: `1px solid ${color}40` }}
        >
          {avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={clsx("text-sm font-black", isSelected ? "text-white" : "text-white/85")}>{shortName}</span>
            {/* Style badge */}
            <span className={clsx("flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border", styleCfg.bg, styleCfg.color)}>
              <StyleIcon size={8} /> {style}
            </span>
          </div>
          {/* Overs info */}
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-white/35">
            <span className="font-mono">{oversDisplay} overs</span>
            <span>·</span>
            <span className={clsx(match.oversLeft > 0 ? "text-neon-green" : "text-neon-red")}>
              {match.oversLeft > 0 ? `${match.oversLeft}ov left` : "Complete"}
            </span>
          </div>
        </div>

        {/* Rating ring */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black border-2"
            style={{ borderColor: color, color, background: `${color}18` }}
          >
            {rating}
          </div>
          <span className="text-[8px] text-white/25 mt-0.5">RTG</span>
        </div>
      </div>

      {/* Today's match stats */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {[
          { label: "W", value: match.wickets, highlight: match.wickets > 0 },
          { label: "R", value: match.runs, highlight: false },
          { label: "ECO", value: match.economy, highlight: false },
        ].map(({ label, value, highlight }) => (
          <div key={label} className="flex flex-col items-center py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <span className={clsx("text-base font-black font-mono leading-none",
              highlight ? "text-neon-green" : "text-white/80"
            )}>{value}</span>
            <span className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">{label} Today</span>
          </div>
        ))}
      </div>

      {!compact && (
        <>
          {/* Economy bars */}
          <div className="space-y-1.5 mb-3">
            <EconomyGauge value={match.economy}  label="Today's Economy" />
            <EconomyGauge value={season.economy} label="Season Economy" />
          </div>

          {/* Form + trend */}
          <div className="flex items-center justify-between mb-2">
            <FormDots form={recentForm} />
            <div className={clsx("flex items-center gap-1 text-[10px] font-bold", trendColor)}>
              <TrendIcon size={11} /> {formTrend === "up" ? "In form" : formTrend === "down" ? "Losing form" : "Stable"}
            </div>
          </div>

          {/* Batter matchup snippet */}
          {batterMatchup && (
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px]">
              <span className="text-white/30 mr-1">vs Dube:</span>
              <span className="font-mono font-bold" style={{ color }}>
                {batterMatchup.balls}b {batterMatchup.runs}r {batterMatchup.dismissals}W
              </span>
              <span className="text-white/25 ml-1.5">SR {batterMatchup.sr}</span>
              {batterMatchup.dismissals > 0 && <span className="ml-1.5 text-neon-green">✓ Has his wicket</span>}
            </div>
          )}
        </>
      )}

      {/* Selection glow bar */}
      {isSelected && (
        <div className="mt-3 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      )}
    </button>
  );
}
