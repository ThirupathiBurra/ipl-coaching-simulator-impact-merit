import { useEffect, useRef } from "react";
import { LIVE_COMMENTARY } from "@data/matchData";
import { MessageSquare } from "lucide-react";
import clsx from "clsx";

const TYPE_CONFIG = {
  wicket: { emoji: "🔴", color: "text-neon-red",    bg: "bg-neon-red/8    border-l-2 border-neon-red"   },
  six:    { emoji: "💥", color: "text-neon-purple",  bg: "bg-neon-purple/8 border-l-2 border-neon-purple" },
  four:   { emoji: "🔵", color: "text-neon-blue",    bg: "bg-neon-blue/8   border-l-2 border-neon-blue"  },
  run:    { emoji: "🏃", color: "text-white/60",     bg: "bg-white/3"                                      },
  dot:    { emoji: "⬤",  color: "text-white/25",     bg: ""                                                },
};

export default function LiveCommentary({ className }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <div className={clsx("glass-card flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <MessageSquare size={14} className="text-neon-cyan" />
        <span className="section-title text-sm">Live Commentary</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="live-dot" />
          <span className="text-[10px] text-neon-red font-bold tracking-widest ml-1.5">LIVE</span>
        </div>
      </div>

      {/* Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar max-h-72 divide-y divide-white/[0.04]">
        {LIVE_COMMENTARY.map((entry, i) => {
          const cfg = TYPE_CONFIG[entry.type] || TYPE_CONFIG.dot;
          return (
            <div
              key={entry.id}
              className={clsx(
                "px-4 py-3 transition-all duration-300",
                cfg.bg,
                i === 0 && "animate-slide-in-up"
              )}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-sm shrink-0 mt-0.5">{cfg.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={clsx("text-[10px] font-mono font-bold", cfg.color)}>
                      {entry.over}
                    </span>
                    {entry.highlight && (
                      <span className={clsx("text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded", cfg.color,
                        entry.type === "wicket" ? "bg-neon-red/15" : "bg-neon-purple/15"
                      )}>
                        {entry.type.toUpperCase()}!
                      </span>
                    )}
                  </div>
                  <p className={clsx("text-xs leading-relaxed", entry.highlight ? "text-white font-medium" : "text-white/55")}>
                    {entry.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
