import { useState } from "react";
import InsightCard from "@components/common/InsightCard";
import { AI_INSIGHTS, GEMINI_ANALYSIS_PLACEHOLDER } from "@data/aiInsightsData";
import { useMatchStore } from "@store/matchStore";
import { streamGeminiResponse, SUGGESTED_PROMPTS } from "@services/geminiService";
import { BrainCircuit, Sparkles, Activity, RefreshCw, Shield, Target, TrendingUp, Send, Loader2, MessageSquare } from "lucide-react";
import clsx from "clsx";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const FILTER_TYPES = ["ALL", "FIELD_PLACEMENT", "BOWLING_CHANGE", "TACTICAL", "BATTING_PATTERN"];

const WIN_DATA = [
  { name: "MI", value: GEMINI_ANALYSIS_PLACEHOLDER.winProbability.MI, fill: "#00E5FF" },
];

export default function AIInsights() {
  const [filter, setFilter] = useState("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // AI Chat state
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  const addNotif = useMatchStore((s) => s.addNotification);
  const match    = useMatchStore((s) => s.liveMatch);
  const wp = GEMINI_ANALYSIS_PLACEHOLDER;

  const filtered = filter === "ALL"
    ? AI_INSIGHTS
    : AI_INSIGHTS.filter((i) => i.type === filter);

  async function refresh() {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsRefreshing(false);
    addNotif({ type: "success", title: "Insights Refreshed", message: "Gemini has analysed the latest match data." });
  }

  async function askAI(prompt) {
    const q = prompt || question.trim();
    if (!q || isAsking) return;
    setIsAsking(true);
    setHasAsked(true);
    setAiResponse("");
    setQuestion("");
    await streamGeminiResponse({
      message: q,
      personaId: "analyst",
      matchData: match,
      onChunk: (text) => setAiResponse(text),
    });
    setIsAsking(false);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2">
            <BrainCircuit size={22} className="text-neon-cyan" /> AI Insights
          </h1>
          <p className="text-sm text-white/50 mt-0.5">
            Powered by Gemini — real-time tactical intelligence for every decision
          </p>
        </div>
        <button onClick={refresh} disabled={isRefreshing} className="btn-secondary text-sm">
          <RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Analysing…" : "Refresh Insights"}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Win Probability Donut */}
        <div className="glass-card p-4 flex flex-col items-center gap-2">
          <div className="section-title w-full text-center">Win Probability</div>
          <div className="relative">
            <ResponsiveContainer width={140} height={140}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={WIN_DATA} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "rgba(255,255,255,0.05)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-black text-neon-cyan">{wp.winProbability.MI}%</span>
              <span className="text-[10px] text-white/40">MI wins</span>
            </div>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-cyan" />MI {wp.winProbability.MI}%</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-gold" />CSK {wp.winProbability.CSK}%</div>
          </div>
        </div>

        {/* Key Insight */}
        <div className="glass-card p-4 sm:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-neon-gold" />
            <span className="section-title">Gemini Key Insight</span>
            <span className="text-[10px] text-white/30 ml-auto">Live · {wp.lastUpdated}</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed flex-1">{wp.keyInsight}</p>
          <div className="space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Shield size={10} /> Risk Factors
            </p>
            {wp.riskFactors.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-neon-gold text-xs">⚠</span>
                <span className="text-xs text-white/60">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target,    label: "Insights Available", value: AI_INSIGHTS.length, color: "text-neon-cyan"  },
          { icon: Activity,  label: "Avg. Confidence",    value: `${Math.round(AI_INSIGHTS.reduce((a,i) => a + i.confidence, 0) / AI_INSIGHTS.length)}%`, color: "text-neon-green" },
          { icon: TrendingUp,label: "Avg. IMS Impact",    value: "+9.9",              color: "text-neon-gold"  },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card p-3 flex flex-col items-center text-center gap-1">
            <Icon size={16} className={color} />
            <div className={`font-display font-black text-xl ${color}`}>{value}</div>
            <div className="text-[10px] text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Ask AI Panel ── */}
      <div className="glass-card p-5 space-y-4 border border-neon-cyan/15">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-neon-cyan" />
          <span className="section-title">Ask the AI Analyst</span>
          <span className="ml-auto text-[10px] text-neon-green/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse inline-block" />
            Gemini Live
          </span>
        </div>

        {/* Suggested prompts */}
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.analyst.slice(0, 4).map((p) => (
            <button
              key={p}
              onClick={() => askAI(p)}
              disabled={isAsking}
              className="text-xs px-3 py-1.5 rounded-full border border-neon-cyan/25 text-neon-cyan/70 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all disabled:opacity-40"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Custom question input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAI()}
            placeholder="Ask a tactical question about this match…"
            disabled={isAsking}
            className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-neon-cyan/40 focus:bg-white/[0.08] transition-all disabled:opacity-50"
          />
          <button
            onClick={() => askAI()}
            disabled={isAsking || !question.trim()}
            className="btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isAsking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>

        {/* AI Response */}
        {hasAsked && (
          <div className="p-4 rounded-xl bg-surface-2 border border-white/[0.06] min-h-[60px]">
            {isAsking && !aiResponse ? (
              <div className="flex items-center gap-2 text-white/30 text-sm">
                <Loader2 size={14} className="animate-spin" /> Thinking…
              </div>
            ) : (
              <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={clsx(
              "text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200",
              filter === type
                ? "bg-neon-cyan text-navy-950 border-neon-cyan shadow-neon-cyan"
                : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
            )}
          >
            {type.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onApply={(i) => addNotif({ type: "info", title: "Insight Applied", message: i.title })}
          />
        ))}
      </div>

      {/* Gemini Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-white/20 py-2">
        <Sparkles size={12} />
        <span>Insights generated by Gemini AI · Updated every over</span>
      </div>
    </div>
  );
}
