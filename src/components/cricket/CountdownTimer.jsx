import { useEffect, useState } from "react";
import clsx from "clsx";

export default function CountdownTimer({ duration = 30, onExpire, isActive, onReset }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, isActive]);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) { onExpire?.(); return; }
    if (timeLeft <= 5) setIsPulsing(true); else setIsPulsing(false);
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, isActive, onExpire]);

  const pct = (timeLeft / duration) * 100;
  const isUrgent  = timeLeft <= 10;
  const isCritical= timeLeft <= 5;

  // Color transitions
  const ringColor = isCritical ? "#FF1744" : isUrgent ? "#FF9100" : "#00E5FF";
  const textColor = isCritical ? "text-neon-red" : isUrgent ? "text-neon-orange" : "text-neon-cyan";

  // SVG circle
  const r = 44, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className={clsx(
      "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-500",
      isCritical
        ? "bg-neon-red/10 border-neon-red/40 shadow-[0_0_20px_rgba(255,23,68,0.2)]"
        : isUrgent
        ? "bg-neon-orange/10 border-neon-orange/30"
        : "glass-card border-neon-cyan/20"
    )}>
      <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Decision Timer</div>

      {/* Ring */}
      <div className={clsx("relative", isPulsing && "animate-pulse")}>
        <svg width={100} height={100} viewBox="0 0 100 100" className="-rotate-90">
          {/* Track */}
          <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
          {/* Progress */}
          <circle
            cx={50} cy={50} r={r} fill="none"
            stroke={ringColor} strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={clsx("font-mono font-black text-3xl leading-none tabular-nums", textColor, isCritical && "animate-pulse")}>
            {timeLeft}
          </span>
          <span className="text-[9px] text-white/30 mt-0.5">secs</span>
        </div>
      </div>

      {/* Status label */}
      <div className={clsx(
        "text-xs font-bold text-center",
        isCritical ? "text-neon-red" : isUrgent ? "text-neon-orange" : "text-white/50"
      )}>
        {isCritical ? "⚠ HURRY! Time almost up" : isUrgent ? "Choose fast!" : isActive ? "Make your decision" : "Waiting for next over…"}
      </div>

      {/* Segment dots */}
      <div className="flex gap-1">
        {Array.from({ length: 6 }).map((_, i) => {
          const segPct = ((5 - i) / 5) * 100;
          return (
            <div key={i} className={clsx(
              "w-2 h-1.5 rounded-full transition-all duration-300",
              pct >= segPct ? (isCritical ? "bg-neon-red" : isUrgent ? "bg-neon-orange" : "bg-neon-cyan") : "bg-white/10"
            )} />
          );
        })}
      </div>
    </div>
  );
}
