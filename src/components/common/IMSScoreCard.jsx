import clsx from "clsx";

function getIMSConfig(score) {
  if (score >= 130) return { label: "Elite",   cls: "ims-elite",   ring: "border-ims-elite"  };
  if (score >= 100) return { label: "Great",   cls: "ims-great",   ring: "border-ims-great"  };
  if (score >= 70)  return { label: "Good",    cls: "ims-good",    ring: "border-ims-good"   };
  if (score >= 40)  return { label: "Average", cls: "ims-average", ring: "border-ims-average"};
  return             { label: "Poor",    cls: "ims-poor",    ring: "border-ims-poor"  };
}

export default function IMSScoreCard({ score, label, size = "md", animated = true }) {
  const { cls, ring } = getIMSConfig(score);
  const sizes = {
    sm: { ring: "w-14 h-14", text: "text-lg", label: "text-[9px]" },
    md: { ring: "w-20 h-20", text: "text-2xl", label: "text-xs" },
    lg: { ring: "w-28 h-28", text: "text-4xl", label: "text-sm" },
  };
  const sz = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={clsx(
        "score-ring",
        sz.ring, ring,
        "border-4 flex flex-col items-center justify-center",
        animated && "animate-score-pop"
      )}>
        <span className={clsx("font-mono font-black leading-none", sz.text, "text-white")}>{score}</span>
        <span className={clsx("font-bold uppercase tracking-widest mt-0.5", sz.label, cls.replace("ims-", "text-ims-"))}>IMS</span>
      </div>
      {label && <span className="text-xs text-white/50">{label}</span>}
    </div>
  );
}
