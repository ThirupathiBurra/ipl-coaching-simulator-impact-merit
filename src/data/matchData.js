// ─── Enhanced Match Data for Coaching Room ────────────────────────────────────
export const MOCK_LIVE_MATCH = {
  id: "ipl-2025-m42",
  status: "LIVE",
  inning: 2,
  over: 14,
  ball: 3,
  matchTitle: "MI vs CSK",
  venue: "Wankhede Stadium, Mumbai",
  date: "2025-05-06",
  pressureScore: 78, // 0-100, higher = more pressure on batting team
  team1: {
    id: "MI", name: "Mumbai Indians", shortName: "MI",
    color: "#004BA0", accentColor: "#00BFFF",
    score: 187, wickets: 4, overs: 20,
    players: [
      { id: "p1",  name: "Rohit Sharma",      role: "BAT",  battingPos: 1,  isCaptain: true },
      { id: "p2",  name: "Ishan Kishan",      role: "WK",   battingPos: 2  },
      { id: "p3",  name: "Suryakumar Yadav",  role: "BAT",  battingPos: 3  },
      { id: "p4",  name: "Hardik Pandya",     role: "ALL",  battingPos: 4  },
      { id: "p5",  name: "Tim David",         role: "BAT",  battingPos: 5  },
      { id: "p6",  name: "Kieron Pollard",    role: "ALL",  battingPos: 6  },
      { id: "p7",  name: "Romario Shepherd",  role: "ALL",  battingPos: 7  },
      { id: "p8",  name: "Kumar Kartikeya",   role: "BOWL", battingPos: 8  },
      { id: "p9",  name: "Piyush Chawla",     role: "BOWL", battingPos: 9  },
      { id: "p10", name: "Jasprit Bumrah",    role: "BOWL", battingPos: 10 },
      { id: "p11", name: "Trent Boult",       role: "BOWL", battingPos: 11 },
    ],
  },
  team2: {
    id: "CSK", name: "Chennai Super Kings", shortName: "CSK",
    color: "#F5A623", accentColor: "#FFD700",
    score: 134, wickets: 5, overs: 14.3,
    players: [
      { id: "c1",  name: "Ruturaj Gaikwad",   role: "BAT",  battingPos: 1, isCaptain: true },
      { id: "c2",  name: "Devon Conway",       role: "BAT",  battingPos: 2 },
      { id: "c3",  name: "Ajinkya Rahane",     role: "BAT",  battingPos: 3 },
      { id: "c4",  name: "Shivam Dube",        role: "ALL",  battingPos: 4 },
      { id: "c5",  name: "MS Dhoni",           role: "WK",   battingPos: 5 },
      { id: "c6",  name: "Ravindra Jadeja",    role: "ALL",  battingPos: 6 },
      { id: "c7",  name: "Mitchell Santner",   role: "ALL",  battingPos: 7 },
      { id: "c8",  name: "Deepak Chahar",      role: "BOWL", battingPos: 8 },
      { id: "c9",  name: "Matheesha Pathirana",role: "BOWL", battingPos: 9 },
      { id: "c10", name: "Tushar Deshpande",   role: "BOWL", battingPos: 10},
      { id: "c11", name: "Simarjeet Singh",    role: "BOWL", battingPos: 11},
    ],
  },
  battingMomentum: 0, // Scale: -10 to +10
  currentBatsmen: [
    { playerId: "c4", name: "Shivam Dube",     runs: 34, balls: 28, fours: 3, sixes: 2, sr: 121.4, isStriker: true,
      traits: { aggression: 8, paceHandling: 6, spinHandling: 9, pressureHandling: 7, boundarySkill: 8 } },
    { playerId: "c6", name: "Ravindra Jadeja", runs: 12, balls: 11, fours: 1, sixes: 0, sr: 109.1, isStriker: false,
      traits: { aggression: 7, paceHandling: 8, spinHandling: 7, pressureHandling: 9, boundarySkill: 6 } },
  ],
  currentBowler: {
    playerId: "p10", name: "Jasprit Bumrah",
    overs: 3, maidens: 1, runs: 18, wickets: 2, economy: 6.0,
    thisOver: [".", "1", "W"],
  },
  target: 188,
  requiredRunRate: 11.6,
  currentRunRate: 9.2,
  requiredBalls: 33,
  requiredRuns: 54,
  recentBalls: ["1", "W", "4", ".", "6", "2", "1", ".", "4", "W", ".", "1"],
  partnerships: [
    { bat1: "Gaikwad", bat2: "Conway",  runs: 42, balls: 35 },
    { bat1: "Conway",  bat2: "Rahane",  runs: 28, balls: 24 },
    { bat1: "Rahane",  bat2: "Dube",    runs: 51, balls: 40 },
    { bat1: "Dube",    bat2: "Jadeja",  runs: 13, balls: 12 },
  ],
};

// Over-by-over run data for momentum graph
export const OVER_DATA = [
  { over: 1,  runs: 8,  wickets: 0, runRate: 8.0,  target_rr: 9.4  },
  { over: 2,  runs: 6,  wickets: 0, runRate: 7.0,  target_rr: 9.5  },
  { over: 3,  runs: 12, wickets: 0, runRate: 8.7,  target_rr: 9.6  },
  { over: 4,  runs: 5,  wickets: 1, runRate: 7.8,  target_rr: 9.7  },
  { over: 5,  runs: 10, wickets: 0, runRate: 8.2,  target_rr: 9.9  },
  { over: 6,  runs: 14, wickets: 0, runRate: 9.2,  target_rr: 10.0 },
  { over: 7,  runs: 7,  wickets: 0, runRate: 8.9,  target_rr: 10.2 },
  { over: 8,  runs: 3,  wickets: 1, runRate: 8.1,  target_rr: 10.5 },
  { over: 9,  runs: 11, wickets: 0, runRate: 8.4,  target_rr: 10.6 },
  { over: 10, runs: 15, wickets: 0, runRate: 9.1,  target_rr: 10.5 },
  { over: 11, runs: 6,  wickets: 1, runRate: 8.8,  target_rr: 10.9 },
  { over: 12, runs: 9,  wickets: 0, runRate: 8.8,  target_rr: 11.0 },
  { over: 13, runs: 4,  wickets: 1, runRate: 8.5,  target_rr: 11.4 },
  { over: 14, runs: 4,  wickets: 1, runRate: 9.2,  target_rr: 11.6 },
];

export const LIVE_COMMENTARY = [
  { id: 1, over: "14.3", text: "Bumrah to Dube — short of a length outside off. Dube goes for the pull but gets a top edge! Safe.", type: "dot",    highlight: false },
  { id: 2, over: "14.2", text: "WICKET! Bumrah castles Rahane through the gate. The off-stump is uprooted! MI in full control.", type: "wicket", highlight: true  },
  { id: 3, over: "14.1", text: "Back of a length, Dube defends solidly down to mid-on. No run.", type: "dot",    highlight: false },
  { id: 4, over: "13.6", text: "SIX! Jadeja launches Kartikeya over long-on! Crowd goes wild at Wankhede!", type: "six",    highlight: true  },
  { id: 5, over: "13.5", text: "Full toss on middle, Dube hammers it to mid-wicket for a single.", type: "run",    highlight: false },
  { id: 6, over: "13.4", text: "Beaten outside off! Kartikeya's googly foxes Jadeja completely.", type: "dot",    highlight: false },
  { id: 7, over: "13.3", text: "FOUR! Dube steps down and drives through covers. Picturesque timing.", type: "four",   highlight: true  },
  { id: 8, over: "13.2", text: "Defended back. CSK desperately need boundaries to stay in this chase.", type: "dot",    highlight: false },
  { id: 9, over: "13.1", text: "Short delivery, Dube ducks under it. Kartikeya testing him with the bouncer plan.", type: "dot",    highlight: false },
  { id: 10,over: "12.6", text: "FOUR! Jadeja reverse sweeps Chawla to the third-man boundary!", type: "four",   highlight: true  },
];

export const WIN_PROBABILITY_HISTORY = [
  { over: 1,  mi: 58, csk: 42 }, { over: 2,  mi: 57, csk: 43 },
  { over: 4,  mi: 60, csk: 40 }, { over: 6,  mi: 56, csk: 44 },
  { over: 8,  mi: 63, csk: 37 }, { over: 10, mi: 59, csk: 41 },
  { over: 12, mi: 65, csk: 35 }, { over: 14, mi: 72, csk: 28 },
];

export const CAPTAIN_DECISIONS = {
  FIELD_PLACEMENT: {
    label: "Bumrah set: Slip, Gully, Fine Leg, Third Man (boundary), 7 others split",
    positions: ["slip", "gully", "fine-leg", "third-man", "mid-off", "mid-on", "mid-wicket", "point", "cover", "deep-cover", "long-on"],
    reasoning: "Bumrah's stock ball angles across Dube. Slip for the edge, boundary protection on the leg side.",
  },
  BOWLING_CHANGE: {
    label: "Bumrah — Continue (last over saved for death)",
    bowlerId: "p10",
    reasoning: "Bumrah has Dube's number. His 4th over held back for overs 16-20 only if wicket falls now.",
  },
};

export const BOWLER_STATS = [
  { id: "p10", name: "Jasprit Bumrah",   overs: 3,   runs: 18, wickets: 2, economy: 6.0,  recentForm: "Good",    isCurrentBowler: true,
    traits: { type: "PACE", economyControl: 10, wicketTaking: 9, deathOverSkill: 10 } },
  { id: "p8",  name: "Kumar Kartikeya",  overs: 3,   runs: 24, wickets: 1, economy: 8.0,  recentForm: "Good",    isCurrentBowler: false,
    traits: { type: "SPIN", economyControl: 7, wicketTaking: 6, deathOverSkill: 4 } },
  { id: "p11", name: "Trent Boult",      overs: 3,   runs: 32, wickets: 1, economy: 10.7, recentForm: "Average", isCurrentBowler: false,
    traits: { type: "PACE", economyControl: 7, wicketTaking: 8, deathOverSkill: 7 } },
  { id: "p4",  name: "Hardik Pandya",    overs: 2,   runs: 20, wickets: 1, economy: 10.0, recentForm: "Average", isCurrentBowler: false,
    traits: { type: "PACE", economyControl: 6, wicketTaking: 7, deathOverSkill: 6 } },
  { id: "p9",  name: "Piyush Chawla",    overs: 2,   runs: 22, wickets: 0, economy: 11.0, recentForm: "Poor",    isCurrentBowler: false,
    traits: { type: "SPIN", economyControl: 5, wicketTaking: 7, deathOverSkill: 3 } },
  { id: "p6",  name: "Romario Shepherd", overs: 1.3, runs: 18, wickets: 0, economy: 12.0, recentForm: "Poor",    isCurrentBowler: false,
    traits: { type: "PACE", economyControl: 4, wicketTaking: 5, deathOverSkill: 5 } },
];

export const FIELD_POSITIONS = [
  { id: "slip",           label: "1st Slip",        x: 62, y: 38, zone: "off"  },
  { id: "gully",          label: "Gully",           x: 68, y: 44, zone: "off"  },
  { id: "point",          label: "Point",           x: 78, y: 50, zone: "off"  },
  { id: "cover",          label: "Cover",           x: 72, y: 60, zone: "off"  },
  { id: "mid-off",        label: "Mid-Off",         x: 55, y: 75, zone: "off"  },
  { id: "mid-on",         label: "Mid-On",          x: 45, y: 75, zone: "leg"  },
  { id: "mid-wicket",     label: "Mid-Wicket",      x: 28, y: 60, zone: "leg"  },
  { id: "square-leg",     label: "Square Leg",      x: 22, y: 50, zone: "leg"  },
  { id: "fine-leg",       label: "Fine Leg",        x: 32, y: 36, zone: "leg"  },
  { id: "third-man",      label: "Third Man",       x: 55, y: 30, zone: "off"  },
  { id: "deep-cover",     label: "Deep Cover",      x: 85, y: 65, zone: "off"  },
  { id: "long-on",        label: "Long On",         x: 48, y: 88, zone: "leg"  },
  { id: "long-off",       label: "Long Off",        x: 58, y: 88, zone: "off"  },
  { id: "deep-sq-leg",    label: "Deep Sq Leg",     x: 12, y: 58, zone: "leg"  },
  { id: "deep-midwicket", label: "Deep Mid-Wkt",    x: 15, y: 70, zone: "leg"  },
  { id: "cow-corner",     label: "Cow Corner",      x: 25, y: 82, zone: "leg"  },
];
