import { STRATEGIES } from "@data/bowlingData";
import clsx from "clsx";

export default function StrategySelector({ selected, onSelect }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-1">Bowling Strategy</div>
      <div className="grid grid-cols-3 gap-2">
        {STRATEGIES.map((s) => {
          const isActive = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={clsx(
                "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-250 group",
                isActive
                  ? `${s.bg} shadow-lg`
                  : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
              )}
            >
              <span className="text-2xl leading-none">{s.icon}</span>
              <div className="text-center">
                <div className={clsx("text-xs font-black", isActive ? s.text : "text-white/70")}>{s.label}</div>
                <div className="text-[9px] text-white/35 mt-0.5">{s.subtitle}</div>
              </div>
              {isActive && (
                <div className={clsx("w-4 h-0.5 rounded-full", s.text.replace("text-", "bg-"))} />
              )}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="animate-fade-in p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] text-white/50 leading-relaxed">
          {STRATEGIES.find((s) => s.id === selected)?.description}
        </div>
      )}
    </div>
  );
}
