import { useEffect, useRef } from "react";
import { AI_PERSONAS } from "@services/geminiService";
import { Bot, User, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

// ─── Confidence indicator ─────────────────────────────────────────────────────
function ConfidenceBar({ confidence }) {
  if (!confidence) return null;
  const color = confidence >= 80 ? "#00E676" : confidence >= 65 ? "#FFD600" : "#FF9100";
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${confidence}%`, background: color }} />
      </div>
      <span className="text-[9px] font-mono font-black" style={{ color }}>{confidence}% conf.</span>
    </div>
  );
}

// ─── Single chat bubble ───────────────────────────────────────────────────────
function ChatBubble({ msg, persona }) {
  const [copied, setCopied] = useState(false);
  const personaCfg = AI_PERSONAS[persona] || AI_PERSONAS.analyst;
  const isAI = msg.role === "model";

  function handleCopy() {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Convert **bold** to <strong>
  function renderContent(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
  }

  if (!isAI) {
    return (
      <div className="flex justify-end gap-2.5 animate-fade-in">
        <div className="max-w-[80%]">
          <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-neon-cyan/15 border border-neon-cyan/25 text-sm text-white/85 leading-relaxed">
            {msg.content}
          </div>
          <div className="text-[9px] text-white/20 text-right mt-1">{msg.time}</div>
        </div>
        <div className="w-7 h-7 rounded-full bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center shrink-0 mt-1">
          <User size={13} className="text-neon-cyan" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 animate-fade-in group">
      {/* AI Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 mt-1 border"
        style={{ background: `${personaCfg.color}20`, borderColor: `${personaCfg.color}40` }}
      >
        {personaCfg.emoji}
      </div>

      <div className="flex-1 min-w-0">
        {/* Persona label */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={clsx("text-[10px] font-bold uppercase tracking-wider", personaCfg.colorClass)}>
            {personaCfg.label}
          </span>
          <span className="text-[9px] text-white/20">{msg.time}</span>
        </div>

        {/* Bubble */}
        <div
          className="px-4 py-3 rounded-2xl rounded-tl-sm border text-sm text-white/80 leading-relaxed relative"
          style={{
            background: `linear-gradient(135deg, ${personaCfg.color}0d, rgba(11,22,40,0.8))`,
            borderColor: `${personaCfg.color}25`,
          }}
        >
          {msg.streaming ? (
            <div className="flex items-center gap-2">
              <span>{renderContent(msg.content)}</span>
              <span className="inline-block w-0.5 h-4 bg-neon-cyan animate-pulse rounded-full" />
            </div>
          ) : (
            renderContent(msg.content)
          )}

          {/* Copy button */}
          {!msg.streaming && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity btn-icon p-1"
              title="Copy response"
            >
              {copied ? <CheckCircle2 size={11} className="text-neon-green" /> : <Copy size={11} className="text-white/30" />}
            </button>
          )}
        </div>

        {/* Confidence + tags */}
        {!msg.streaming && msg.confidence && <ConfidenceBar confidence={msg.confidence} />}
        {!msg.streaming && msg.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {msg.tags.map((tag) => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/35 border border-white/[0.06]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Full Chat Window ─────────────────────────────────────────────────────────
export default function ChatWindow({ messages, isLoading, persona }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
          <div className="text-5xl">{AI_PERSONAS[persona]?.emoji ?? "🧠"}</div>
          <div className="text-white/50 text-sm font-semibold">{AI_PERSONAS[persona]?.label} is ready</div>
          <div className="text-white/25 text-xs max-w-xs">{AI_PERSONAS[persona]?.description}</div>
        </div>
      )}
      {messages.map((msg) => (
        <ChatBubble key={msg.id} msg={msg} persona={persona} />
      ))}
      {isLoading && (
        <div className="flex gap-2.5 animate-fade-in">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base border"
            style={{ background: `${AI_PERSONAS[persona]?.color}20`, borderColor: `${AI_PERSONAS[persona]?.color}40` }}>
            {AI_PERSONAS[persona]?.emoji}
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06] flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-white/40" />
            <span className="text-xs text-white/35">Thinking…</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
