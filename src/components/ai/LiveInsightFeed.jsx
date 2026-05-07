import { useState, useEffect } from "react";
import { getGeminiInsight, AI_PERSONAS } from "@services/geminiService";
import { MOCK_LIVE_MATCH } from "@data/matchData";
import { Activity, RefreshCw, TrendingUp, TrendingDown, Zap, Target, Shield, BrainCircuit } from "lucide-react";
import clsx from "clsx";

// ─── Auto-updating insight cards displayed in the side panel ──────────────────
const INSIGHT_PROMPTS = [
  { id: "momentum",   icon: Activity,      color: "#00E5FF", label: "Momentum",      prompt: "In one sentence, describe the current match momentum.",  persona: "analyst"   },
  { id: "pressure",   icon: Zap,           color: "#FF9100", label: "Pressure",      prompt: "In one sentence, describe the pressure situation.",       persona: "analyst"   },
  { id: "prediction", icon: Target,        color: "#00E676", label: "Prediction",    prompt: "Predict the most likely match outcome in one sentence.",  persona: "analyst"   },
  { id: "bowling",    icon: Shield,        color: "#AA00FF", label: "Bowling Tip",   prompt: "Give one key bowling tactical recommendation right now.", persona: "aggressive" },
];

function InsightCard({ item, matchData }) {
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const Icon = item.icon;

  async function fetchInsight() {
    try {
      setLoading(true);
      const res = await getGeminiInsight({ message: item.prompt, personaId: item.persona, matchData });
      // Trim to ~120 chars for card display
      setText(res.length > 180 ? res.slice(0, 177) + "…" : res);
    } catch {
      setText("Unable to load insight.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchInsight(); }, []);

  function handleRefresh() { setRefreshing(true); fetchInsight(); }

  return (
    <div className="glass-card p-3 space-y-2 border-l-2" style={{ borderLeftColor: item.color }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={13} style={{ color: item.color }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="btn-icon p-1 text-white/20 hover:text-white/50"
        >
          <RefreshCw size={10} className={clsx(refreshing && "animate-spin")} />
        </button>
      </div>
      {loading ? (
        <div className="space-y-1.5">
          <div className="h-2 rounded bg-white/8 animate-pulse" />
          <div className="h-2 rounded bg-white/5 animate-pulse w-4/5" />
        </div>
      ) : (
        <p className="text-[11px] text-white/60 leading-relaxed">{text}</p>
      )}
    </div>
  );
}

// ─── Win Probability Card ──────────────────────────────────────────────────────
function WinProbCard() {
  const mi  = 72;
  const csk = 28;
  return (
    <div className="glass-card p-3 space-y-2">
      <div className="flex items-center gap-2">
        <BrainCircuit size={13} className="text-neon-cyan" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-neon-cyan">Win Probability</span>
        <span className="ml-auto text-[9px] text-white/25 flex items-center gap-1">
          <Activity size={9} className="animate-pulse text-neon-green" /> Live
        </span>
      </div>
      <div className="space-y-1.5">
        {[
          { name: "MI", pct: mi,  color: "#00BFFF", trend: <TrendingUp size={10} className="text-neon-green" /> },
          { name: "CSK", pct: csk, color: "#F5A623", trend: <TrendingDown size={10} className="text-neon-red" /> },
        ].map(({ name, pct, color, trend }) => (
          <div key={name} className="space-y-0.5">
            <div className="flex justify-between text-[10px]">
              <span className="font-bold text-white/60">{name}</span>
              <div className="flex items-center gap-1">
                {trend}
                <span className="font-mono font-black" style={{ color }}>{pct}%</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="text-[9px] text-white/25 text-center">Based on current match state & historical data</div>
    </div>
  );
}

// ─── Live Insight Feed ─────────────────────────────────────────────────────────
export default function LiveInsightFeed({ className }) {
  return (
    <div className={clsx("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Activity size={14} className="text-neon-cyan" />
        <span className="section-title text-sm">Live AI Feed</span>
        <span className="ml-auto flex items-center gap-1 text-[9px] text-neon-green">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> Auto-updating
        </span>
      </div>
      <WinProbCard />
      {INSIGHT_PROMPTS.map((item) => (
        <InsightCard key={item.id} item={item} matchData={MOCK_LIVE_MATCH} />
      ))}
    </div>
  );
}
