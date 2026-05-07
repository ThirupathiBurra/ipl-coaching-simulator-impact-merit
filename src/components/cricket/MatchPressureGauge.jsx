import { useMatchStore } from "@store/matchStore";
import clsx from "clsx";

function PressureArc({ score }) {
  // score: 0–100. 0 = batting team dominant, 100 = extreme pressure
  const r = 52, circ = Math.PI * r; // half-circle
  const dash = (score / 100) * circ;
  const zones = [
    { pct: 30, color: "#00E676", label: "Low"     },
    { pct: 60, color: "#FFD600", label: "Medium"  },
    { pct: 85, color: "#FF6D00", label: "High"    },
    { pct:100, color: "#FF1744", label: "Critical" },
  ];
  const zone = zones.find((z) => score <= z.pct) || zones[zones.length - 1];

  // Needle angle (-90 = left, 90 = right, 0 = up)
  const needleAngle = -90 + (score / 100) * 180;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 120 70" width={150} height={90}>
        {/* Background arc track */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} strokeLinecap="round"
        />
        {/* Colored pressure segments */}
        {[
          { start: 10, end: 40, color: "#00E67655" },
          { start: 40, end: 70, color: "#FFD60055" },
          { start: 70, end: 96, color: "#FF6D0055" },
          { start: 96, end: 110, color: "#FF174455" },
        ].map((seg, i) => (
          <path
            key={i}
            d={`M ${seg.start} 60 A 50 50 0 0 1 ${seg.end} ${i === 0 ? 22 : i === 1 ? 10 : i === 2 ? 22 : 60}`}
            fill="none" stroke={seg.color} strokeWidth={12} strokeLinecap="butt"
          />
        ))}
        {/* Filled progress arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={zone.color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 1s ease, stroke 0.5s" }}
          opacity={0.9}
        />
        {/* Needle */}
        <g transform={`rotate(${needleAngle}, 60, 60)`} style={{ transition: "transform 1s ease" }}>
          <line x1={60} y1={60} x2={60} y2={16} stroke="white" strokeWidth={2.5} strokeLinecap="round" opacity={0.9} />
          <circle cx={60} cy={60} r={4} fill="white" />
        </g>
        {/* Score text */}
        <text x={60} y={58} textAnchor="middle" fontSize={14} fontWeight="900" fill={zone.color} fontFamily="monospace">
          {score}
        </text>
      </svg>
    </div>
  );
}

export default function MatchPressureGauge({ className }) {
  const match = useMatchStore((s) => s.liveMatch);
  const score = match?.pressureScore ?? 50;

  const zones = [
    { max: 30, label: "Batting team in control",  color: "text-neon-green",  bg: "bg-neon-green/10  border-neon-green/30"  },
    { max: 60, label: "Evenly poised",             color: "text-neon-gold",   bg: "bg-neon-gold/10   border-neon-gold/30"   },
    { max: 85, label: "Pressure building on CSK",  color: "text-neon-orange", bg: "bg-neon-orange/10 border-neon-orange/30" },
    { max: 100,label: "Critical — must hit!",      color: "text-neon-red",    bg: "bg-neon-red/10    border-neon-red/30"    },
  ];
  const zone = zones.find((z) => score <= z.max) || zones[zones.length - 1];

  const factors = [
    { label: "Wickets lost",      value: `5/10`, impact: "high"   },
    { label: "Run rate gap",      value: `+2.4`, impact: "high"   },
    { label: "Key batter",        value: "Dube",  impact: "medium" },
    { label: "Dhoni in reserve",  value: "✓",     impact: "low"    },
  ];

  return (
    <div className={clsx("glass-card p-4 space-y-3", className)}>
      <div className="section-title">Match Pressure</div>
      <div className="section-subtitle">Real-time pressure on batting team</div>

      <div className="flex items-center gap-4">
        <PressureArc score={score} />
        <div className="flex-1">
          <div className={clsx("text-xs font-bold px-3 py-1.5 rounded-full border mb-3", zone.bg, zone.color)}>
            {zone.label}
          </div>
          <div className="space-y-1.5">
            {factors.map(({ label, value, impact }) => (
              <div key={label} className="flex items-center justify-between text-[11px]">
                <span className="text-white/40">{label}</span>
                <span className={clsx("font-mono font-bold",
                  impact === "high" ? "text-neon-red" : impact === "medium" ? "text-neon-gold" : "text-neon-green"
                )}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pressure bar */}
      <div>
        <div className="flex justify-between text-[9px] text-white/30 mb-1">
          <span>Batting control</span>
          <span>Extreme pressure</span>
        </div>
        <div className="h-2 rounded-full bg-gradient-to-r from-neon-green via-neon-gold via-neon-orange to-neon-red relative overflow-hidden">
          <div className="absolute top-0 h-full w-0.5 bg-white/80 rounded-full transition-all duration-1000"
            style={{ left: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}
