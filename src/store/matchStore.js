import { create } from "zustand";
import { MOCK_LIVE_MATCH } from "@data/matchData";

import { useDecisionStore } from "@store/decisionStore";
import { BOWLER_STATS } from "@data/matchData";

// ─── Contextual Engine Logic ───────────────────────────────────────────────────

function generateCommentary(outcome, runs, isWicket, striker, bowler, factors) {
  const overStr = factors.overStr;
  const nameB = bowler.name.split(" ").pop();
  const nameS = striker.name.split(" ").pop();

  if (isWicket) {
    if (factors.tacticalFieldMod > 0) return `WICKET! ${nameB} strikes! The aggressive field placement forces ${nameS} into a false shot.`;
    if (factors.isDeath) return `WICKET! ${nameB} bowls a brilliant death over delivery. ${nameS} perishes trying to accelerate!`;
    return `WICKET! ${nameB} gets the breakthrough. Massive moment in this chase!`;
  }

  if (runs === 6) {
    if (factors.momentum > 5) return `SIX! ${nameS} is on absolute fire! He rides the momentum and dispatches ${nameB} into the stands!`;
    if (factors.matchupMod > 0) return `SIX! ${nameS} wins the matchup against ${nameB}. Beautifully struck!`;
    return `SIX! Huge hit from ${nameS}! They desperately needed that boundary.`;
  }

  if (runs === 4) {
    if (factors.tacticalBowlerMod > 0) return `FOUR! ${nameB} misses his length and ${nameS} punishes him. That's why the captain held Bumrah back!`;
    return `FOUR! Pierces the gap. ${nameS} finds the boundary off ${nameB}.`;
  }

  if (runs === 0) {
    if (factors.tacticalFieldMod < 0) return `Dot ball. The defensive field cuts off the angle for ${nameS}.`;
    if (factors.isDeath && bowler.traits?.deathOverSkill > 8) return `Brilliant yorker by ${nameB}! Impossible to get away.`;
    return `Solid defense by ${nameS} against ${nameB}. Pressure building!`;
  }

  return `${runs} run${runs > 1 ? "s" : ""}. ${nameS} works ${nameB} into the gaps to keep the scoreboard ticking.`;
}

function nextBall(match) {
  if (!match) return match;
  if (match.team2.overs >= 20 || match.team2.wickets >= 10) return match;

  // 1. Gather Context
  const striker = match.currentBatsmen.find(b => b.isStriker) || match.currentBatsmen[0];
  
  // Tactical inputs
  const decisionState = useDecisionStore.getState();
  const selectedBowlerId = decisionState.selectedBowler || match.currentBowler.playerId;
  const bowlerData = BOWLER_STATS.find(b => b.id === selectedBowlerId) || match.currentBowler;
  
  // Field input (count slips/inner ring vs boundary)
  const activeField = decisionState.fieldPlacement.activePositions;
  const isAggressiveField = activeField.includes("slip") || activeField.includes("gully") || activeField.length > 8; // simplified heuristic

  const over = match.over;
  const isDeath = over >= 15;
  const rrr = parseFloat(match.requiredRunRate);
  let momentum = match.battingMomentum || 0;

  // 2. Base Probabilities [Dot, 1, 2, 4, 6, W]
  let probs = [30, 35, 10, 15, 5, 5];

  let tacticalFieldMod = 0;
  let tacticalBowlerMod = 0;
  let matchupMod = 0;

  // 3. Apply Phase Modifiers
  if (isDeath) {
    probs[0] -= 10; // fewer dots
    probs[3] += 5;  // more 4s
    probs[4] += 5;  // more 6s
    probs[5] += 5;  // more wickets (high risk)
  }

  // 4. Apply Matchup & Pressure Modifiers
  const bTraits = bowlerData.traits || { economyControl: 7, deathOverSkill: 7, type: "PACE" };
  const sTraits = striker.traits || { spinHandling: 7, paceHandling: 7, boundarySkill: 7, pressureHandling: 7 };
  
  const handling = bTraits.type === "SPIN" ? sTraits.spinHandling : sTraits.paceHandling;
  const bowlerSkill = isDeath ? bTraits.deathOverSkill : bTraits.economyControl;
  
  matchupMod = handling - bowlerSkill; // Positive means batter is better

  if (matchupMod > 0) {
    probs[3] += matchupMod * 2; // more 4s
    probs[4] += matchupMod;     // more 6s
    probs[0] -= matchupMod * 2; // fewer dots
  } else {
    probs[0] += Math.abs(matchupMod) * 3; // more dots
    probs[5] += Math.abs(matchupMod);     // more wickets
  }

  if (rrr > 10) {
    probs[4] += 3; // forced to hit
    probs[5] += 4; // forced to take risks
  }

  // 5. Apply Tactical Modifiers
  if (isAggressiveField) {
    probs[5] += 5; // higher wicket chance
    probs[3] += 4; // but gaps open for 4s
    probs[1] -= 5; // harder to get singles
    tacticalFieldMod = 1;
  } else {
    probs[0] += 5; // defensive saves boundaries, more dots/singles
    probs[3] -= 5;
    probs[4] -= 3;
    tacticalFieldMod = -1;
  }

  // If user chose a bad death bowler
  if (isDeath && bTraits.deathOverSkill < 6) {
    probs[4] += 10; // high chance of getting hit for 6
    tacticalBowlerMod = 1;
  }

  // 6. Resolve Outcome
  // Ensure no negative probabilities and calculate total
  probs = probs.map(p => Math.max(1, p));
  const totalWeight = probs.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  let outcomeIndex = 0;
  for (let i = 0; i < probs.length; i++) {
    if (random < probs[i]) { outcomeIndex = i; break; }
    random -= probs[i];
  }

  const OUTCOME_MAP = [0, 1, 2, 4, 6, "W"];
  const outcome = OUTCOME_MAP[outcomeIndex];
  const isWicket = outcome === "W";
  const runs = isWicket ? 0 : outcome;

  // 7. Update Momentum
  if (runs >= 4) momentum = Math.min(10, momentum + 2);
  else if (isWicket) momentum = Math.max(-10, momentum - 5);
  else if (runs === 0) momentum = Math.max(-10, momentum - 1);

  // 8. Update Match State
  let newBall = match.ball + 1;
  let newOver = match.over;
  if (newBall > 6) { newBall = 1; newOver = match.over + 1; }

  const newScore  = match.team2.score + runs;
  const newWickets = match.team2.wickets + (isWicket ? 1 : 0);
  const ballsLeft  = (20 - newOver) * 6 + (6 - newBall);
  const runsLeft   = Math.max(0, match.target - newScore);
  const newRRR     = ballsLeft > 0 ? ((runsLeft / ballsLeft) * 6).toFixed(1) : 0;
  const overStr    = `${match.over}.${match.ball}`;

  const commText = generateCommentary(outcome, runs, isWicket, striker, bowlerData, {
    isDeath, momentum, matchupMod, tacticalFieldMod, tacticalBowlerMod, overStr
  });

  return {
    ...match,
    over:  newOver,
    ball:  newBall,
    battingMomentum: momentum,
    team2: { ...match.team2, score: newScore, wickets: newWickets, overs: parseFloat(`${newOver}.${newBall}`) },
    requiredRuns:    runsLeft,
    requiredBalls:   ballsLeft,
    requiredRunRate: newRRR,
    recentBalls: [isWicket ? "W" : String(runs), ...match.recentBalls].slice(0, 12),
    pressureScore: Math.min(100, Math.max(0, Math.round(newRRR * 8 - momentum * 2))), // momentum reduces pressure
    recentCommentary: commText,
  };
}

export const useMatchStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────
  liveMatch:   MOCK_LIVE_MATCH,
  isLive:      true,
  scorecardTab: "batting",
  notifications: [],
  _tickerRef:  null,

  // ── Actions ────────────────────────────────────────────────
  setLiveMatch: (match) => set({ liveMatch: match }),

  // Ticks the live score forward by one ball
  tickBall: () => set((s) => ({ liveMatch: nextBall(s.liveMatch) })),

  // Start / stop the auto-ticker (call startLiveTicker once at app mount)
  startLiveTicker: () => {
    const existing = get()._tickerRef;
    if (existing) return; // already running
    const ref = setInterval(() => get().tickBall(), 8000); // 1 ball every 8s
    set({ _tickerRef: ref });
  },
  stopLiveTicker: () => {
    const ref = get()._tickerRef;
    if (ref) { clearInterval(ref); set({ _tickerRef: null }); }
  },

  updateScore: (teamId, runs, wickets) =>
    set((s) => ({
      liveMatch: {
        ...s.liveMatch,
        [teamId === s.liveMatch.team1.id ? "team1" : "team2"]: {
          ...(teamId === s.liveMatch.team1.id ? s.liveMatch.team1 : s.liveMatch.team2),
          score: runs,
          wickets,
        },
      },
    })),

  setScorecardTab: (tab) => set({ scorecardTab: tab }),

  addNotification: (notif) =>
    set((s) => ({
      notifications: [{ id: Date.now(), ...notif }, ...s.notifications].slice(0, 10),
    })),

  clearNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}));
