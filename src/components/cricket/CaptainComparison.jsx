import { useState } from "react";
import { CAPTAIN_DECISIONS } from "@data/matchData";
import IMSScoreCard from "@components/common/IMSScoreCard";
import { CheckCircle2, XCircle, Minus, ChevronDown, ChevronUp, Crown, User } from "lucide-react";
import clsx from "clsx";

function CompareRow({ label, yours, captain, match }) {
  return (
    <div className="grid grid-cols-3 gap-2 items-start py-2.5 border-b border-white/[0.05] last:border-0">
      <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold pt-0.5">{label}</div>
      <div className={clsx("text-xs leading-relaxed", match === true ? "text-neon-green" : match === false ? "text-neon-red/80" : "text-white/60")}>
        {yours}
      </div>
      <div className="text-xs text-neon-cyan/80 leading-relaxed">{captain}</div>
    </div>
  );
}

export default function CaptainComparison({ userDecision, imsScore, decisionType, onClose, className }) {
  const [expanded, setExpanded] = useState(false);
  const captain = CAPTAIN_DECISIONS[decisionType] || CAPTAIN_DECISIONS.BOWLING_CHANGE;

  const isMatch   = imsScore >= 90;
  const isPartial = imsScore >= 50 && imsScore < 90;
  const isMiss    = imsScore < 50;

  const verdictConfig = isMatch
    ? { icon: CheckCircle2, color: "text-neon-green", bg: "bg-neon-green/10 border-neon-green/30", label: "Perfect Match!", sub: "Your thinking aligns with the captain" }
    : isPartial
    ? { icon: Minus,        color: "text-neon-gold",  bg: "bg-neon-gold/10  border-neon-gold/30",  label: "Close Call",    sub: "Similar logic, different execution" }
    : { icon: XCircle,      color: "text-neon-red",   bg: "bg-neon-red/10   border-neon-red/30",   label: "Different Path", sub: "Captain saw it differently" };

  const VerdictIcon = verdictConfig.icon;

  return (
    <div className={clsx("glass-card border-neon-cyan/20 overflow-hidden animate-slide-in-up", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-neon-cyan/5 to-transparent border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Crown size={15} className="text-neon-gold" />
          <span className="text-sm font-bold text-white">Captain Comparison</span>
        </div>
        <div className={clsx("ml-auto flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border", verdictConfig.bg, verdictConfig.color)}>
          <VerdictIcon size={12} />
          {verdictConfig.label}
        </div>
        {onClose && (
          <button onClick={onClose} className="btn-icon p-1 shrink-0">
            <XCircle size={14} />
          </button>
        )}
      </div>

      {/* Score + Verdict */}
      <div className="px-4 py-4 flex items-center gap-6">
        {/* IMS Ring */}
        <IMSScoreCard score={imsScore} size="md" animated />

        {/* Comparison grid */}
        <div className="flex-1 min-w-0">
          {/* Column headers */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div />
            <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-wider">
              <User size={10} /> You
            </div>
            <div className="flex items-center gap-1 text-[10px] text-neon-cyan/60 uppercase tracking-wider">
              <Crown size={10} className="text-neon-gold" /> Captain
            </div>
          </div>
          <CompareRow
            label="Choice"
            yours={userDecision?.label ?? "Custom field"}
            captain={captain.label}
            match={isMatch}
          />
          <CompareRow
            label="Type"
            yours={decisionType?.replace("_", " ")}
            captain={decisionType?.replace("_", " ")}
            match={true}
          />
        </div>
      </div>

      {/* Reasoning (expandable) */}
      <div className="border-t border-white/[0.06]">
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          <span className="font-medium">Captain's Reasoning</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expanded && (
          <div className="px-4 pb-4 animate-fade-in">
            <div className="p-3 rounded-xl bg-neon-cyan/5 border border-neon-cyan/15">
              <p className="text-xs text-white/60 leading-relaxed italic">"{captain.reasoning}"</p>
            </div>
            <p className={clsx("text-xs mt-3 leading-relaxed", verdictConfig.color)}>
              {verdictConfig.sub} — {isMatch
                ? "Outstanding tactical awareness!"
                : isPartial
                ? "You were on the right track. Study the positioning details."
                : "Review the AI insights to understand the captain's thought process."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
