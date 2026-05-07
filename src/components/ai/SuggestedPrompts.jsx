import { SUGGESTED_PROMPTS, AI_PERSONAS } from "@services/geminiService";
import { Sparkles } from "lucide-react";
import clsx from "clsx";

export default function SuggestedPrompts({ persona, onSelect, disabled }) {
  const prompts = SUGGESTED_PROMPTS[persona] || SUGGESTED_PROMPTS.analyst;
  const cfg = AI_PERSONAS[persona] || AI_PERSONAS.analyst;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 px-1">
        <Sparkles size={11} style={{ color: cfg.color }} />
        <span className="text-[10px] text-white/30 uppercase tracking-wider">Suggested</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => !disabled && onSelect(prompt)}
            disabled={disabled}
            className={clsx(
              "text-[11px] px-2.5 py-1.5 rounded-lg border transition-all duration-200 text-left",
              disabled
                ? "opacity-40 cursor-not-allowed border-white/5 text-white/20"
                : "hover:scale-[1.02] active:scale-95 text-white/55 hover:text-white/85 border-white/10 hover:border-opacity-50"
            )}
            style={!disabled ? { ["--hover-border-color"]: cfg.color } : {}}
            onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.borderColor = `${cfg.color}60`; }}
            onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.borderColor = ""; }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
