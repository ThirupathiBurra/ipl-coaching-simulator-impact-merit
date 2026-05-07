import { useState, useRef, useCallback } from "react";
import { streamGeminiResponse, AI_PERSONAS, SUGGESTED_PROMPTS } from "@services/geminiService";
import { MOCK_LIVE_MATCH } from "@data/matchData";
import { useMatchStore } from "@store/matchStore";

import PersonaSelector from "@components/ai/PersonaSelector";
import ChatWindow from "@components/ai/ChatWindow";
import SuggestedPrompts from "@components/ai/SuggestedPrompts";
import LiveInsightFeed from "@components/ai/LiveInsightFeed";

import {
  BrainCircuit, Send, Trash2, Download, Loader2, X, ChevronRight, Mic,
} from "lucide-react";
import clsx from "clsx";

// ─── Tag generator based on persona ──────────────────────────────────────────
function generateTags(persona, text) {
  const tags = { analyst: ["tactics", "data"], commentary: ["broadcast", "drama"], aggressive: ["attack", "wicket"], defensive: ["contain", "dot-ball"], telugu: ["తెలుగు", "cricket"] };
  const base = tags[persona] || ["tactics"];
  if (text.toLowerCase().includes("bumrah"))  base.push("bumrah");
  if (text.toLowerCase().includes("field"))   base.push("field");
  if (text.toLowerCase().includes("bowling")) base.push("bowling");
  return [...new Set(base)].slice(0, 4);
}

function getTimestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

let msgIdCounter = 1;

// ─── Main AIAnalyst Page ───────────────────────────────────────────────────────
export default function AIAnalyst() {
  const [persona, setPersona]       = useState("analyst");
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const inputRef = useRef(null);
  const addNotif = useMatchStore((s) => s.addNotification);
  const personaCfg = AI_PERSONAS[persona];

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;
    setInput("");
    inputRef.current?.focus();

    // Add user message
    const userMsg = { id: msgIdCounter++, role: "user", content: trimmed, time: getTimestamp() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Placeholder AI message (will be updated with streamed content)
    const aiId = msgIdCounter++;
    const aiMsg = { id: aiId, role: "model", content: "", streaming: true, time: getTimestamp() };
    setMessages((prev) => [...prev, aiMsg]);

    // Build chat history (excluding the current streaming placeholder)
    const history = messages
      .filter((m) => m.role === "user" || (m.role === "model" && !m.streaming))
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      await streamGeminiResponse({
        message: trimmed,
        personaId: persona,
        history,
        matchData: MOCK_LIVE_MATCH,
        onChunk: (chunk) => {
          setMessages((prev) =>
            prev.map((m) => m.id === aiId ? { ...m, content: chunk } : m)
          );
        },
      });

      // Finalize message — add confidence & tags
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? {
                ...m,
                streaming: false,
                confidence: 70 + Math.floor(Math.random() * 25),
                tags: generateTags(persona, m.content),
              }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) => m.id === aiId ? { ...m, content: "⚠️ Error getting AI response. Please try again.", streaming: false } : m)
      );
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, persona]);

  // ── Switch persona (clear chat, announce new persona) ─────────────────────
  function handlePersonaChange(newPersona) {
    setPersona(newPersona);
    setMessages([]);
    addNotif({ type: "info", title: `Switched to ${AI_PERSONAS[newPersona]?.label}`, message: AI_PERSONAS[newPersona]?.description });
  }

  // ── Export chat ───────────────────────────────────────────────────────────
  function handleExport() {
    const text = messages.map((m) => `[${m.role === "user" ? "You" : personaCfg.label}] ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ipl-ai-chat-${persona}.txt`;
    a.click();
  }

  const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== "your_gemini_api_key_here";

  return (
    <div className="flex flex-col gap-4 h-full animate-fade-in" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2.5">
            <BrainCircuit size={22} className="text-neon-cyan" />
            AI Tactical Analyst
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            Gemini-powered cricket intelligence · {personaCfg.emoji} {personaCfg.label} mode
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* API key status */}
          <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
            hasApiKey ? "bg-neon-green/10 border-neon-green/30 text-neon-green" : "bg-neon-gold/10 border-neon-gold/30 text-neon-gold"
          )}>
            <span className={clsx("w-1.5 h-1.5 rounded-full", hasApiKey ? "bg-neon-green" : "bg-neon-gold animate-pulse")} />
            {hasApiKey ? "Gemini Live" : "Mock Mode"}
          </div>
          <button onClick={() => setShowSidebar((p) => !p)} className="btn-ghost text-xs py-1.5 px-3 border border-white/10">
            {showSidebar ? "Hide" : "Show"} Live Feed
          </button>
          {messages.length > 0 && (
            <>
              <button onClick={handleExport} className="btn-ghost text-xs py-1.5 px-3 border border-white/10">
                <Download size={12} /> Export
              </button>
              <button onClick={() => setMessages([])} className="btn-ghost text-xs py-1.5 px-3 border border-white/10 text-neon-red/70">
                <Trash2 size={12} /> Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── API key warning ── */}
      {!hasApiKey && (
        <div className="glass-card p-3 flex items-start gap-3 border-l-4 border-neon-gold bg-neon-gold/5 animate-fade-in">
          <span className="text-neon-gold text-lg shrink-0">⚠️</span>
          <div className="text-xs text-white/60 leading-relaxed">
            <span className="font-bold text-neon-gold">Mock Mode Active</span> — Add your Gemini API key to{" "}
            <code className="px-1 py-0.5 rounded bg-white/10 text-neon-cyan text-[11px]">.env</code>:{" "}
            <code className="px-1 py-0.5 rounded bg-white/10 text-neon-cyan text-[11px]">VITE_GEMINI_API_KEY=your_key</code>.
            Get a free key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-neon-cyan underline">aistudio.google.com</a>.
            Responses will be realistic mock data until configured.
          </div>
        </div>
      )}

      {/* ── Persona Selector ── */}
      <div className="glass-card p-3">
        <PersonaSelector active={persona} onChange={handlePersonaChange} />
      </div>

      {/* ── Main Layout ── */}
      <div className={clsx("flex-1 grid gap-4 min-h-0", showSidebar ? "grid-cols-1 xl:grid-cols-[1fr_300px]" : "grid-cols-1")}>

        {/* ─── Chat Column ─── */}
        <div className="glass-card flex flex-col min-h-0 overflow-hidden" style={{ minHeight: "500px" }}>
          {/* Chat messages */}
          <ChatWindow messages={messages} isLoading={isLoading} persona={persona} />

          {/* Suggested prompts */}
          <div className="px-4 py-2 border-t border-white/[0.06]">
            <SuggestedPrompts persona={persona} onSelect={sendMessage} disabled={isLoading} />
          </div>

          {/* Input row */}
          <div className="px-4 pb-4 pt-2 flex gap-2 items-end border-t border-white/[0.04]">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                }}
                placeholder={`Ask ${personaCfg.emoji} ${personaCfg.label}… (Enter to send, Shift+Enter for newline)`}
                rows={1}
                disabled={isLoading}
                className={clsx(
                  "input-field resize-none min-h-[44px] max-h-36 pr-10 py-3 text-sm leading-relaxed disabled:opacity-50 transition-all",
                  "focus:border-opacity-80"
                )}
                style={{ ["--tw-ring-color"]: personaCfg.color, borderColor: input ? `${personaCfg.color}50` : undefined }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className={clsx(
                "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-40",
                "shadow-lg hover:brightness-110 active:scale-95"
              )}
              style={{ background: personaCfg.color, color: "#062030" }}
            >
              {isLoading ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            </button>
          </div>
        </div>

        {/* ─── Live Feed Sidebar ─── */}
        {showSidebar && (
          <div className="overflow-y-auto no-scrollbar space-y-4 animate-fade-in">
            <LiveInsightFeed />

            {/* Match context card */}
            <div className="glass-card p-4 space-y-2">
              <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Match Context</div>
              <div className="space-y-1.5 text-[11px] font-mono">
                {[
                  ["Over",   `${MOCK_LIVE_MATCH.over}.${MOCK_LIVE_MATCH.ball}`],
                  ["Score",  `CSK ${MOCK_LIVE_MATCH.team2?.score}/${MOCK_LIVE_MATCH.team2?.wickets}`],
                  ["Need",   `${MOCK_LIVE_MATCH.requiredRuns} off ${MOCK_LIVE_MATCH.requiredBalls}b`],
                  ["RRR",    MOCK_LIVE_MATCH.requiredRunRate],
                  ["CRR",    MOCK_LIVE_MATCH.currentRunRate],
                  ["Pressure", `${MOCK_LIVE_MATCH.pressureScore}/100`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-white/30">{label}</span>
                    <span className="text-white/70 font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
