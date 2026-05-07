import { AI_PERSONAS } from "@services/geminiService";
import clsx from "clsx";

export default function PersonaSelector({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(AI_PERSONAS).map((p) => {
        const isActive = active === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={clsx(
              "flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 group",
              isActive
                ? `${p.bgClass} shadow-lg font-bold`
                : "bg-white/[0.03] border-white/8 hover:border-white/20 hover:bg-white/[0.05]"
            )}
            title={p.description}
          >
            <span className="text-base leading-none">{p.emoji}</span>
            <div className="text-left">
              <div className={clsx("text-xs font-bold", isActive ? p.colorClass : "text-white/60 group-hover:text-white/80")}>
                {p.label}
              </div>
              <div className="text-[9px] text-white/30 hidden sm:block">{p.description}</div>
            </div>
            {isActive && <div className="w-1.5 h-1.5 rounded-full ml-0.5 animate-pulse" style={{ background: p.color }} />}
          </button>
        );
      })}
    </div>
  );
}
