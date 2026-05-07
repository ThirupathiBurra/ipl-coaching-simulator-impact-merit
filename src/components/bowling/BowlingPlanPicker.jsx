import { BOWLING_PLANS } from "@data/bowlingData";
import { Zap } from "lucide-react";
import clsx from "clsx";

export default function BowlingPlanPicker({ styleCode, selected, onSelect }) {
  const plans = BOWLING_PLANS[styleCode] || BOWLING_PLANS.FAST;

  return (
    <div className="space-y-2">
      <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-1">Bowling Plan</div>
      <div className="grid grid-cols-2 gap-2">
        {plans.map((plan) => {
          const isActive = selected === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={clsx(
                "flex flex-col items-start gap-2 p-3 rounded-xl border transition-all duration-200 text-left group",
                isActive
                  ? "bg-neon-cyan/10 border-neon-cyan/40 shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                  : "bg-white/[0.03] border-white/8 hover:border-white/20 hover:bg-white/[0.06]"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xl">{plan.icon}</span>
                {isActive && (
                  <div className="flex items-center gap-1 text-[9px] text-neon-green font-bold">
                    <Zap size={8} /> +{plan.imsBonus} IMS
                  </div>
                )}
              </div>
              <div>
                <div className={clsx("text-xs font-bold leading-tight", isActive ? "text-neon-cyan" : "text-white/75")}>
                  {plan.label}
                </div>
                <div className="text-[10px] text-white/35 mt-0.5 leading-relaxed">{plan.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
