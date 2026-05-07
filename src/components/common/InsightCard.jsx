import clsx from "clsx";

const RISK_CONFIG = {
  LOW:    { color: "text-neon-green", bg: "bg-neon-green/10 border-neon-green/30",   label: "Low Risk"    },
  MEDIUM: { color: "text-neon-gold",  bg: "bg-neon-gold/10 border-neon-gold/30",     label: "Medium Risk" },
  HIGH:   { color: "text-neon-red",   bg: "bg-neon-red/10 border-neon-red/30",       label: "High Risk"   },
};

const TYPE_CONFIG = {
  FIELD_PLACEMENT: { emoji: "🏏", label: "Field Placement" },
  BOWLING_CHANGE:  { emoji: "⚡", label: "Bowling Change"  },
  TACTICAL:        { emoji: "🧠", label: "Tactical"        },
  BATTING_PATTERN: { emoji: "📊", label: "Batting Pattern" },
};

export default function InsightCard({ insight, onApply, className }) {
  const risk = RISK_CONFIG[insight.riskLevel] || RISK_CONFIG.MEDIUM;
  const type = TYPE_CONFIG[insight.type] || { emoji: "💡", label: insight.type };

  return (
    <div className={clsx("glass-card-hover p-4 group", className)}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-lg shrink-0">
          {type.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-neon-cyan/70 uppercase tracking-wider">{type.label}</span>
            <span className={clsx("text-[10px] font-bold border px-1.5 py-0.5 rounded-full", risk.bg, risk.color)}>
              {risk.label}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mt-1 leading-snug">{insight.title}</h3>
        </div>
        {/* Confidence meter */}
        <div className="shrink-0 flex flex-col items-center gap-0.5">
          <span className="font-mono text-lg font-black text-neon-cyan">{insight.confidence}%</span>
          <span className="text-[9px] text-white/40 uppercase tracking-wider">Conf.</span>
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs text-white/60 leading-relaxed mb-3">{insight.summary}</p>

      {/* Context + Impact */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] text-white/40">{insight.matchContext}</div>
        <div className="flex items-center gap-2">
          {insight.impact && (
            <span className="font-mono text-xs font-bold text-neon-green bg-neon-green/10 border border-neon-green/25 px-2 py-0.5 rounded-full">
              {insight.impact}
            </span>
          )}
          {onApply && (
            <button onClick={() => onApply(insight)} className="btn-primary text-xs px-3 py-1.5">
              Apply
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {insight.tags?.map((tag) => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>
    </div>
  );
}
