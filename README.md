# 🏏 IPL Coaching Simulator

> **An AI-powered virtual cricket coaching platform** — make real-time captaincy decisions during live IPL matches, compare your tactics against actual captain choices, and earn Impact Merit Scores (IMS) powered by Gemini AI analytics.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎮 **Live Coaching Room** | Make field placements & bowling changes during a live over |
| 🧠 **AI Insights (Gemini)** | Real-time tactical intelligence with confidence scores |
| 📊 **Impact Merit Score** | Quantified scoring of every decision vs actual captain |
| 🏆 **Leaderboard** | Global + weekly rankings with badge system |
| 👤 **User Profile** | IMS history, skill radar, and achievement system |
| 🔴 **Live Match Ticker** | Real-time match events scrolling across the top |
| 📡 **Firebase Ready** | Auth + Firestore schema stubs wired and ready to activate |

---

## 🛠 Tech Stack

```
Frontend    →  React 18 + Vite 8
Styling     →  Tailwind CSS 3 (custom IPL theme)
State       →  Zustand (with persist middleware)
Routing     →  React Router v6
Charts      →  Recharts (area, radar, bar, radial)
Icons       →  Lucide React
Auth        →  Firebase Authentication (stub ready)
Database    →  Cloud Firestore (stub ready)
AI          →  Gemini API (stub ready via FastAPI backend)
```

---

## 🚀 Quick Start

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # production build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # AppLayout, Sidebar, MobileNav, TopBanner, MatchTicker
│   ├── cricket/         # ScoreWidget, FieldingMap, BowlerPanel, PartnershipChart, WagonWheel
│   └── common/          # IMSScoreCard, InsightCard, NotificationPanel, PageLoader
├── pages/
│   ├── Dashboard.jsx    # Home — stats, IMS trend chart, skill radar, leaderboard preview
│   ├── CoachingRoom.jsx # Field placement + bowling change + AI assist tabs
│   ├── AIInsights.jsx   # Gemini insights browser with filtering
│   ├── Leaderboard.jsx  # Podium + full ranked table with badges
│   ├── UserProfile.jsx  # Stats, IMS bar chart, skill bars, achievements
│   └── NotFound.jsx     # 404 cricket-themed page
├── store/
│   ├── matchStore.js    # Live match state + notifications
│   ├── userStore.js     # Auth state + IMS total (persisted)
│   └── decisionStore.js # Decision submission + IMS calculation engine
├── services/
│   ├── firebase.js      # Firebase init (env-var driven, swap placeholders)
│   └── geminiService.js # Gemini API stubs (activate when backend ready)
├── hooks/
│   └── useAuth.js       # Firebase auth hooks (stub, uncomment to activate)
├── data/
│   ├── matchData.js     # Mock live match snapshot + field positions
│   ├── leaderboardData.js
│   └── aiInsightsData.js
└── styles/
    └── globals.css      # Tailwind directives + all component utility classes
```

---

## 🔧 Environment Setup

```bash
cp .env.example .env
# Fill in Firebase + Gemini API keys
```

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase project API key |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_GEMINI_API_KEY` | Gemini API key (dev only — use FastAPI backend proxy in prod) |
| `VITE_API_BASE_URL` | FastAPI backend URL (default: `http://localhost:8000`) |

---

## 🎨 Design System

Custom IPL brand palette in `tailwind.config.js`:

| Token | Usage |
|-------|-------|
| `navy-950 → navy-600` | Background depth layers |
| `neon-cyan` | Primary accent — active nav, IMS values, scores |
| `neon-gold` | Secondary accent — targets, legend badge |
| `neon-green / neon-red` | Win probability, wicket indicators |
| `ims-elite → ims-poor` | 5-band IMS score colour system |
| `.glass-card` | Glassmorphism card CSS class |
| `.btn-primary / .btn-secondary` | Button component variants |

---

## 🔌 Activating Firebase & Gemini

1. **Firebase Auth** — In `src/hooks/useAuth.js`, uncomment the `onAuthStateChanged` and `signInWithPopup` lines.
2. **Firestore** — Import `db` from `src/services/firebase.js` and add reads/writes to Zustand stores.
3. **Gemini** — Replace the stub `setTimeout` in `src/services/geminiService.js` with real `fetch` calls to your FastAPI `/api/gemini/*` endpoints.

---

## 📐 IMS Score Formula

```
IMS = BaseScore × TypeWeight × ContextMultiplier

BaseScore         = 100 per decision
TypeWeight        → FIELD_PLACEMENT  : match=1.0 | partial=0.5 | mismatch=0.1
                    BOWLING_CHANGE   : match=1.0 | partial=0.4 | mismatch=0.05
                    TACTICAL         : match=1.0 | partial=0.6 | mismatch=0.2
ContextMultiplier → 1.5x if criticalOver (over ≥ 15), else 1.0x
```

---

## 📄 License

MIT — built for demonstration and educational purposes.
