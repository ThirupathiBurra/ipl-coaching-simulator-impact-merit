// ─── Leaderboard Data — Enhanced ──────────────────────────────────────────────
export const LEADERBOARD_DATA = [
  { rank: 1,  userId: "u001", displayName: "RohitFan99",      avatar: "RF", imsTotal: 9847, xp: 48200, decisionsCount: 124, accuracy: 81, streak: 12, badge: "LEGEND",   trend: "up",   matchesPlayed: 41, fieldDecisions: 52, bowlDecisions: 48, country: "India",     bestMatch: 980  },
  { rank: 2,  userId: "u002", displayName: "CricketGuru",     avatar: "CG", imsTotal: 9612, xp: 44100, decisionsCount: 118, accuracy: 79, streak: 8,  badge: "LEGEND",   trend: "up",   matchesPlayed: 39, fieldDecisions: 48, bowlDecisions: 45, country: "India",     bestMatch: 912  },
  { rank: 3,  userId: "u003", displayName: "TacticalMind",    avatar: "TM", imsTotal: 9380, xp: 40800, decisionsCount: 132, accuracy: 77, streak: 5,  badge: "ELITE",    trend: "down", matchesPlayed: 44, fieldDecisions: 61, bowlDecisions: 50, country: "Australia", bestMatch: 876  },
  { rank: 4,  userId: "u004", displayName: "IPLAnalyst",      avatar: "IA", imsTotal: 8955, xp: 36200, decisionsCount: 98,  accuracy: 75, streak: 3,  badge: "ELITE",    trend: "same", matchesPlayed: 33, fieldDecisions: 40, bowlDecisions: 38, country: "India",     bestMatch: 845  },
  { rank: 5,  userId: "demo-user-001", displayName: "Coach Demo", avatar: "CD", imsTotal: 8731, xp: 32500, decisionsCount: 105, accuracy: 73, streak: 7, badge: "PRO", trend: "up", matchesPlayed: 34, fieldDecisions: 44, bowlDecisions: 41, country: "India", bestMatch: 798 },
  { rank: 6,  userId: "u006", displayName: "FieldMaster",     avatar: "FM", imsTotal: 8504, xp: 28900, decisionsCount: 89,  accuracy: 71, streak: 2,  badge: "PRO",      trend: "down", matchesPlayed: 30, fieldDecisions: 50, bowlDecisions: 22, country: "England",   bestMatch: 762  },
  { rank: 7,  userId: "u007", displayName: "CricketNerd",     avatar: "CN", imsTotal: 8297, xp: 26100, decisionsCount: 112, accuracy: 69, streak: 4,  badge: "PRO",      trend: "up",   matchesPlayed: 37, fieldDecisions: 49, bowlDecisions: 42, country: "India",     bestMatch: 740  },
  { rank: 8,  userId: "u008", displayName: "WicketWatcher",   avatar: "WW", imsTotal: 7988, xp: 22400, decisionsCount: 76,  accuracy: 67, streak: 1,  badge: "SKILLED",  trend: "same", matchesPlayed: 26, fieldDecisions: 32, bowlDecisions: 29, country: "SA",        bestMatch: 711  },
  { rank: 9,  userId: "u009", displayName: "RunChaser",       avatar: "RC", imsTotal: 7654, xp: 19800, decisionsCount: 91,  accuracy: 65, streak: 0,  badge: "SKILLED",  trend: "down", matchesPlayed: 31, fieldDecisions: 38, bowlDecisions: 35, country: "India",     bestMatch: 682  },
  { rank: 10, userId: "u010", displayName: "PowerPlayPro",    avatar: "PP", imsTotal: 7421, xp: 17200, decisionsCount: 83,  accuracy: 62, streak: 6,  badge: "SKILLED",  trend: "up",   matchesPlayed: 28, fieldDecisions: 36, bowlDecisions: 30, country: "NZ",        bestMatch: 654  },
  { rank: 11, userId: "u011", displayName: "DeathOverKing",   avatar: "DK", imsTotal: 7205, xp: 15600, decisionsCount: 72,  accuracy: 61, streak: 0,  badge: "SKILLED",  trend: "up",   matchesPlayed: 25, fieldDecisions: 30, bowlDecisions: 32, country: "India",     bestMatch: 630  },
  { rank: 12, userId: "u012", displayName: "SpinDoctor",      avatar: "SD", imsTotal: 6988, xp: 13900, decisionsCount: 68,  accuracy: 59, streak: 2,  badge: "AMATEUR",  trend: "same", matchesPlayed: 23, fieldDecisions: 28, bowlDecisions: 28, country: "SL",        bestMatch: 608  },
];

// ─── Weekly top performers ────────────────────────────────────────────────────
export const WEEKLY_LEADERBOARD = [
  { rank: 1,  userId: "u003", displayName: "TacticalMind",    avatar: "TM", imsTotal: 2840, accuracy: 85, streak: 5,  badge: "ELITE",  trend: "up"   },
  { rank: 2,  userId: "u001", displayName: "RohitFan99",      avatar: "RF", imsTotal: 2712, accuracy: 82, streak: 4,  badge: "LEGEND", trend: "down" },
  { rank: 3,  userId: "demo-user-001", displayName: "Coach Demo", avatar: "CD", imsTotal: 2680, accuracy: 79, streak: 7, badge: "PRO", trend: "up" },
  { rank: 4,  userId: "u010", displayName: "PowerPlayPro",    avatar: "PP", imsTotal: 2590, accuracy: 76, streak: 6,  badge: "SKILLED", trend: "up" },
  { rank: 5,  userId: "u002", displayName: "CricketGuru",     avatar: "CG", imsTotal: 2450, accuracy: 74, streak: 2,  badge: "LEGEND", trend: "down" },
];

// ─── Match-wise leaderboard ────────────────────────────────────────────────────
export const MATCH_LEADERBOARD = [
  { rank: 1, displayName: "TacticalMind",  avatar: "TM", imsTotal: 980, accuracy: 92, decisions: 8, badge: "ELITE"  },
  { rank: 2, displayName: "RohitFan99",    avatar: "RF", imsTotal: 912, accuracy: 88, decisions: 7, badge: "LEGEND" },
  { rank: 3, displayName: "Coach Demo",    avatar: "CD", imsTotal: 798, accuracy: 76, decisions: 6, badge: "PRO"    },
  { rank: 4, displayName: "IPLAnalyst",    avatar: "IA", imsTotal: 765, accuracy: 73, decisions: 8, badge: "ELITE"  },
  { rank: 5, displayName: "FieldMaster",   avatar: "FM", imsTotal: 720, accuracy: 69, decisions: 7, badge: "PRO"    },
];

// ─── Badge config ─────────────────────────────────────────────────────────────
export const BADGE_CONFIG = {
  LEGEND:  { color: "#FFD600", bg: "bg-neon-gold/15   border-neon-gold/40",   text: "text-neon-gold",   label: "Legend",  minIms: 9500, icon: "👑" },
  ELITE:   { color: "#00E5FF", bg: "bg-neon-cyan/15   border-neon-cyan/40",   text: "text-neon-cyan",   label: "Elite",   minIms: 9000, icon: "💎" },
  PRO:     { color: "#AA00FF", bg: "bg-neon-purple/15 border-neon-purple/40", text: "text-neon-purple", label: "Pro",     minIms: 8000, icon: "⭐" },
  SKILLED: { color: "#00E676", bg: "bg-neon-green/15  border-neon-green/40",  text: "text-neon-green",  label: "Skilled", minIms: 7000, icon: "🎯" },
  AMATEUR: { color: "#ffffff", bg: "bg-white/5        border-white/10",       text: "text-white/50",    label: "Amateur", minIms: 0,    icon: "🏏" },
};

// ─── Sub-score category metadata ──────────────────────────────────────────────
export const SCORE_CATEGORIES = [
  { id: "coachingAccuracy",    label: "Coaching Accuracy",      icon: "🎯", color: "#00E5FF", desc: "How closely your decisions match optimal play"     },
  { id: "tacticalIntelligence",label: "Tactical Intelligence",  icon: "🧠", color: "#AA00FF", desc: "Depth of strategic thinking in your choices"       },
  { id: "bowlingDecision",     label: "Bowling Decision",       icon: "🎳", color: "#FF9100", desc: "Accuracy of bowling changes and plans selected"    },
  { id: "fieldEfficiency",     label: "Field Efficiency",       icon: "🗺️",  color: "#2979FF", desc: "Optimality of field placement vs match situation"  },
  { id: "predictionAccuracy",  label: "Prediction Accuracy",   icon: "🔮", color: "#00E676", desc: "Accuracy of outcome predictions and probability calls"},
  { id: "riskReward",          label: "Risk vs Reward",         icon: "⚖️",  color: "#FF1744", desc: "Balance of risk taken relative to match situation"  },
];
