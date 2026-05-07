import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── IMS Sub-Score Weights ────────────────────────────────────────────────────
const CATEGORY_WEIGHTS = {
  FIELD_PLACEMENT: {
    coachingAccuracy:    0.25,
    tacticalIntelligence: 0.20,
    bowlingDecision:     0.00,
    fieldEfficiency:     0.35,
    predictionAccuracy:  0.10,
    riskReward:          0.10,
  },
  BOWLING_CHANGE: {
    coachingAccuracy:    0.20,
    tacticalIntelligence: 0.20,
    bowlingDecision:     0.35,
    fieldEfficiency:     0.05,
    predictionAccuracy:  0.10,
    riskReward:          0.10,
  },
  TACTICAL: {
    coachingAccuracy:    0.20,
    tacticalIntelligence: 0.30,
    bowlingDecision:     0.10,
    fieldEfficiency:     0.10,
    predictionAccuracy:  0.15,
    riskReward:          0.15,
  },
};

// ─── IMS Scoring Engine ────────────────────────────────────────────────────────
function computeDetailedIMS(decision, actualDecision, context) {
  const weights = CATEGORY_WEIGHTS[decision.type] || CATEGORY_WEIGHTS.TACTICAL;
  const isMatch   = decision.value === actualDecision.value;
  const isPartial = !!decision.partialMatch;

  // Match quality factor: 1.0 = perfect, 0.5 = partial, 0.1 = miss
  const matchFactor = isMatch ? 1.0 : isPartial ? 0.55 : 0.12;

  // Context multipliers
  const pressureMult  = context.criticalOver  ? 1.5 : context.highPressure ? 1.2 : 1.0;
  const powerplayMult = context.isPowerplay   ? 1.3 : 1.0;
  const deathMult     = context.isDeathOver   ? 1.4 : 1.0;
  const ctxMult       = Math.max(pressureMult, powerplayMult, deathMult);

  // Generate pseudo-random-but-stable sub-scores based on match quality
  const base = 100 * matchFactor;
  const jitter = () => (Math.random() - 0.5) * 12; // ±6 point variance

  const subScores = {
    coachingAccuracy:     Math.round(Math.min(100, Math.max(0, base * 1.05 + jitter()))),
    tacticalIntelligence: Math.round(Math.min(100, Math.max(0, base * 0.95 + jitter()))),
    bowlingDecision:      Math.round(Math.min(100, Math.max(0, base * 1.00 + jitter()))),
    fieldEfficiency:      Math.round(Math.min(100, Math.max(0, base * 0.90 + jitter()))),
    predictionAccuracy:   Math.round(Math.min(100, Math.max(0, base * 1.10 + jitter()))),
    riskReward:           Math.round(Math.min(100, Math.max(0, base * 0.85 + jitter()))),
  };

  // Weighted composite IMS
  const composite = Object.entries(weights).reduce(
    (sum, [key, w]) => sum + subScores[key] * w,
    0
  );
  const finalIMS = Math.round(composite * ctxMult);

  return {
    subScores,
    composite: Math.round(composite),
    finalIMS: Math.min(150, finalIMS),   // cap at 150 for critical overs
    contextMultiplier: ctxMult,
    matchFactor,
    isMatch,
    isPartial,
  };
}

// ─── XP & Level system ────────────────────────────────────────────────────────
export function calcLevel(xp) {
  // Every 1000 XP is a level, with increasing thresholds
  const thresholds = [0, 500, 1200, 2500, 5000, 8000, 12000, 18000, 25000, 35000, 50000];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) return { level: i + 1, current: xp - thresholds[i], next: thresholds[i + 1] ?? xp, pct: Math.min(100, ((xp - thresholds[i]) / ((thresholds[i + 1] ?? xp + 1) - thresholds[i])) * 100) };
  }
  return { level: 1, current: 0, next: 500, pct: 0 };
}

// ─── Achievement definitions ──────────────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: "first_blood",   label: "First Decision",     icon: "🎯", desc: "Submit your first coaching decision",         req: (s) => s.decisionsCount >= 1   },
  { id: "sharp_mind",    label: "Sharp Mind",          icon: "🧠", desc: "Achieve 75%+ accuracy over 10 decisions",    req: (s) => s.accuracy >= 75 && s.decisionsCount >= 10 },
  { id: "on_fire",       label: "On Fire",             icon: "🔥", desc: "Reach a 5-decision winning streak",           req: (s) => s.streak >= 5            },
  { id: "streak_10",     label: "Unstoppable",         icon: "⚡", desc: "Maintain a 10-decision winning streak",       req: (s) => s.streak >= 10           },
  { id: "centurion",     label: "Centurion",           icon: "💯", desc: "Make 100 coaching decisions",                 req: (s) => s.decisionsCount >= 100  },
  { id: "ims_9k",        label: "Elite Mind",          icon: "👑", desc: "Cross 9,000 IMS points",                     req: (s) => s.imsTotal >= 9000       },
  { id: "perfect_call",  label: "Perfect Call",        icon: "🏆", desc: "Get a perfect 150 IMS on a critical over",   req: (s) => (s.bestSingleIMS ?? 0) >= 140 },
  { id: "field_master",  label: "Field Master",        icon: "🗺️", desc: "Make 20 field placement decisions",           req: (s) => (s.fieldDecisions ?? 0) >= 20 },
  { id: "bowl_guru",     label: "Bowling Guru",        icon: "🎳", desc: "Make 20 bowling strategy decisions",          req: (s) => (s.bowlDecisions ?? 0)  >= 20 },
  { id: "top_10",        label: "Top 10 Coach",        icon: "🏅", desc: "Reach top 10 on the leaderboard",            req: (s) => (s.imsRank ?? 999) <= 10 },
  { id: "accuracy_80",   label: "Mind Reader",         icon: "🔮", desc: "Achieve 80%+ coaching accuracy",              req: (s) => s.accuracy >= 80         },
  { id: "comeback",      label: "Comeback King",       icon: "🦁", desc: "Score 100+ IMS after a previous 0",           req: (s) => (s.comebackCount ?? 0) >= 1 },
];

// ─── Decision Store ────────────────────────────────────────────────────────────
export const useDecisionStore = create(
  persist(
    (set, get) => ({
      // ── State ────────────────────────────────────────────────
      pendingDecision: null,
      submittedDecisions: [],  // Array of full result objects
      sessionIMS: 0,
      fieldPlacement: {
        activePositions: ["slip", "gully", "cover", "mid-off", "mid-on", "mid-wicket", "square-leg", "fine-leg", "third-man", "long-on", "long-off"],
      },
      selectedBowler: null,
      isSubmitting: false,
      lastResult: null,
      // Aggregate stats (updated per decision)
      stats: {
        coachingAccuracy:    0,
        tacticalIntelligence: 0,
        bowlingDecision:     0,
        fieldEfficiency:     0,
        predictionAccuracy:  0,
        riskReward:          0,
        totalDecisions:      0,
        fieldDecisions:      0,
        bowlDecisions:       0,
        bestSingleIMS:       0,
        comebackCount:       0,
      },
      unlockedAchievements: [],

      // ── Actions ──────────────────────────────────────────────
      setPendingDecision: (decision) => set({ pendingDecision: decision }),

      toggleFieldPosition: (posId) =>
        set((s) => {
          const active = s.fieldPlacement.activePositions;
          const isActive = active.includes(posId);
          if (!isActive && active.length >= 11) return s;
          return {
            fieldPlacement: {
              activePositions: isActive ? active.filter((p) => p !== posId) : [...active, posId],
            },
          };
        }),

      selectBowler: (bowlerId) => set({ selectedBowler: bowlerId }),

      submitDecision: async (decision, actualDecision, context = {}) => {
        set({ isSubmitting: true });
        await new Promise((r) => setTimeout(r, 700));

        const scoring = computeDetailedIMS(decision, actualDecision, context);
        const { finalIMS, subScores } = scoring;

        const result = {
          id: Date.now(),
          decision,
          actualDecision,
          score:   finalIMS,
          subScores,
          scoring,
          context,
          timestamp: new Date().toISOString(),
          over: context.over ?? "14.3",
        };

        set((s) => {
          const prev    = s.stats;
          const n       = prev.totalDecisions + 1;
          const prevLast = s.submittedDecisions[0];
          const isComeback = prevLast && prevLast.score === 0 && finalIMS >= 100;

          // Running averages for sub-scores
          const avgd = (old, nv) => Math.round((old * (n - 1) + nv) / n);

          const newStats = {
            coachingAccuracy:    avgd(prev.coachingAccuracy,    subScores.coachingAccuracy),
            tacticalIntelligence:avgd(prev.tacticalIntelligence,subScores.tacticalIntelligence),
            bowlingDecision:     avgd(prev.bowlingDecision,     subScores.bowlingDecision),
            fieldEfficiency:     avgd(prev.fieldEfficiency,     subScores.fieldEfficiency),
            predictionAccuracy:  avgd(prev.predictionAccuracy,  subScores.predictionAccuracy),
            riskReward:          avgd(prev.riskReward,          subScores.riskReward),
            totalDecisions:      n,
            fieldDecisions:  prev.fieldDecisions  + (decision.type === "FIELD_PLACEMENT" ? 1 : 0),
            bowlDecisions:   prev.bowlDecisions   + (decision.type === "BOWLING_CHANGE"  ? 1 : 0),
            bestSingleIMS:   Math.max(prev.bestSingleIMS, finalIMS),
            comebackCount:   prev.comebackCount + (isComeback ? 1 : 0),
          };

          return {
            submittedDecisions: [result, ...s.submittedDecisions].slice(0, 50),
            sessionIMS: s.sessionIMS + finalIMS,
            isSubmitting: false,
            lastResult: result,
            pendingDecision: null,
            stats: newStats,
          };
        });

        return result;
      },

      clearLastResult: () => set({ lastResult: null }),

      checkAchievements: (userStats) => {
        const { unlockedAchievements } = get();
        const newlyUnlocked = ACHIEVEMENTS.filter(
          (a) => !unlockedAchievements.includes(a.id) && a.req(userStats)
        ).map((a) => a.id);
        if (newlyUnlocked.length > 0) {
          set((s) => ({ unlockedAchievements: [...s.unlockedAchievements, ...newlyUnlocked] }));
        }
        return newlyUnlocked;
      },
    }),
    {
      name: "ipl-decision-store",
      partialize: (s) => ({
        submittedDecisions: s.submittedDecisions.slice(0, 20),
        sessionIMS: s.sessionIMS,
        stats: s.stats,
        unlockedAchievements: s.unlockedAchievements,
      }),
    }
  )
);
