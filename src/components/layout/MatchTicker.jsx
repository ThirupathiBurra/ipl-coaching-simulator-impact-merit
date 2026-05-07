import { useMatchStore } from "@store/matchStore";

const TICKER_EVENTS = [
  "🔴 LIVE: MI vs CSK — CSK need 54 off 33 balls",
  "🏏 Bumrah takes his 2nd wicket! Rahane c. Rohit b. Bumrah 18(15)",
  "💥 SIX! Shivam Dube goes downtown over long-on!",
  "📊 Over 14: CSK 134/5 | RRR 11.6 | Partnership: Dube-Jadeja 13(12)",
  "🤖 AI INSIGHT: Third Man position recommended for Bumrah's next over",
  "🏆 Today: MI vs CSK 7:30 PM | DC vs RCB 3:30 PM | KKR vs SRH 7:30 PM",
  "🔥 Bumrah: 3 overs, 2 wickets, economy 6.0 — On fire!",
  "⚡ Impact Merit Score leader: RohitFan99 — 9,847 IMS this season",
  "🎯 CSK win probability: 28% | MI win probability: 72%",
];

export default function MatchTicker() {
  const match = useMatchStore((s) => s.liveMatch);
  const events = match.recentCommentary 
    ? [
        `🔴 LIVE: ${match.team1.shortName} vs ${match.team2.shortName} — ${match.team2.shortName} need ${match.requiredRuns} off ${match.requiredBalls}`,
        `🎙️ ${match.recentCommentary}`,
        `📊 Over ${match.over}.${match.ball}: ${match.team2.shortName} ${match.team2.score}/${match.team2.wickets} | RRR ${match.requiredRunRate}`,
        `⚡ Pressure Index: ${match.pressureScore} | Momentum: ${match.battingMomentum > 0 ? "+" : ""}${match.battingMomentum}`,
      ]
    : TICKER_EVENTS;

  return (
    <div className="shrink-0 h-7 bg-navy-800/80 border-b border-white/[0.04] flex items-center gap-0 overflow-hidden relative">
      {/* Label */}
      <div className="shrink-0 px-3 h-full flex items-center bg-neon-cyan/15 border-r border-neon-cyan/20 gap-1.5 z-10">
        <span className="text-[10px] font-bold text-neon-cyan tracking-widest uppercase">LIVE</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden ticker-wrap h-full flex items-center">
        <div className="ticker-content">
          {[...events, ...events].map((event, i) => (
            <span key={i} className="inline-block text-xs text-white/70 px-8">
              {event}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
