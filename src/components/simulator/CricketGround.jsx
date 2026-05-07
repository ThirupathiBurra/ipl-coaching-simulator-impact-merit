import { GROUND } from "@data/fieldPositions";

// ─── SVG coordinate helpers ────────────────────────────────────────────────────
export function svgPoint(svg, clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

export function clampToGround(x, y, maxR = GROUND.outerR - 10) {
  const dx = x - GROUND.cx;
  const dy = y - GROUND.cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= maxR) return { x, y };
  return {
    x: GROUND.cx + (dx / dist) * maxR,
    y: GROUND.cy + (dy / dist) * maxR,
  };
}

// ─── The SVG Cricket Ground ────────────────────────────────────────────────────
export default function CricketGround({ svgRef, children, onGroundPointerMove, onGroundPointerUp }) {
  const { cx, cy, outerR, innerR, pitchX, pitchY, pitchW, pitchH } = GROUND;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      className="w-full h-full select-none touch-none"
      onPointerMove={onGroundPointerMove}
      onPointerUp={onGroundPointerUp}
      onPointerLeave={onGroundPointerUp}
    >
      <defs>
        {/* Ground radial gradient */}
        <radialGradient id="groundFill" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#1a3a1a" />
          <stop offset="55%"  stopColor="#142b14" />
          <stop offset="100%" stopColor="#0d1f0d" />
        </radialGradient>
        {/* Neon glow filter */}
        <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glowRed" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Fielder shadow */}
        <filter id="fielderShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.6)" />
        </filter>
      </defs>

      {/* Outer boundary */}
      <ellipse cx={cx} cy={cy} rx={outerR} ry={outerR * 0.95}
        fill="url(#groundFill)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={1.5}
      />

      {/* Mowing stripes (alternating light/dark bands) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse key={i} cx={cx} cy={cy}
          rx={outerR - i * 22} ry={(outerR - i * 22) * 0.95}
          fill="none"
          stroke={i % 2 === 0 ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.04)"}
          strokeWidth={20}
        />
      ))}

      {/* 30-yard inner circle */}
      <ellipse cx={cx} cy={cy} rx={innerR} ry={innerR * 0.95}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={0.8}
        strokeDasharray="6 4"
      />

      {/* Field zone highlights (off-side / leg-side) */}
      <path
        d={`M ${cx} ${cy - outerR * 0.95} A ${outerR} ${outerR * 0.95} 0 0 1 ${cx} ${cy + outerR * 0.95} Z`}
        fill="rgba(0,229,255,0.018)"
      />
      <path
        d={`M ${cx} ${cy - outerR * 0.95} A ${outerR} ${outerR * 0.95} 0 0 0 ${cx} ${cy + outerR * 0.95} Z`}
        fill="rgba(170,0,255,0.018)"
      />

      {/* Center dividing line (pitch line) */}
      <line x1={cx} y1={cy - outerR * 0.95} x2={cx} y2={cy + outerR * 0.95}
        stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} strokeDasharray="3 6"
      />

      {/* Pitch */}
      <rect x={pitchX} y={pitchY} width={pitchW} height={pitchH}
        rx={2} fill="#c8a96e" opacity={0.7}
      />
      {/* Pitch shading */}
      <rect x={pitchX + 1} y={pitchY + 1} width={pitchW - 2} height={pitchH - 2}
        rx={1.5} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={0.5}
      />

      {/* Bowling crease */}
      <line x1={pitchX - 8} y1={pitchY + 8} x2={pitchX + pitchW + 8} y2={pitchY + 8}
        stroke="white" strokeWidth={1} opacity={0.55}
      />
      {/* Batting crease */}
      <line x1={pitchX - 8} y1={pitchY + pitchH - 8} x2={pitchX + pitchW + 8} y2={pitchY + pitchH - 8}
        stroke="white" strokeWidth={1} opacity={0.55}
      />

      {/* Stumps (bowling end) */}
      {[-3, 0, 3].map((dx, i) => (
        <rect key={i} x={cx + dx - 0.8} y={pitchY + 5} width={1.6} height={6}
          rx={0.5} fill="white" opacity={0.85}
        />
      ))}
      {/* Stumps (batting end) */}
      {[-3, 0, 3].map((dx, i) => (
        <rect key={i} x={cx + dx - 0.8} y={pitchY + pitchH - 11} width={1.6} height={6}
          rx={0.5} fill="white" opacity={0.85}
        />
      ))}

      {/* Batsman marker */}
      <circle cx={cx} cy={pitchY + pitchH - 14} r={3.5}
        fill="rgba(255,214,0,0.8)" stroke="#FFD600" strokeWidth={1}
        filter="url(#glowGold)"
      />
      <text x={cx + 6} y={pitchY + pitchH - 11} fontSize={7} fill="rgba(255,214,0,0.7)" fontWeight="600">BAT</text>

      {/* Bowler direction arrow */}
      <line x1={cx} y1={pitchY - 20} x2={cx} y2={pitchY + 2}
        stroke="rgba(255,255,255,0.12)" strokeWidth={1} markerEnd="url(#arrow)"
      />

      {/* Zone labels */}
      <text x={cx + 55} y={cy + 5} fontSize={7} fill="rgba(0,229,255,0.3)" textAnchor="middle" fontWeight="600" letterSpacing={1}>OFF SIDE</text>
      <text x={cx - 55} y={cy + 5} fontSize={7} fill="rgba(170,0,255,0.3)" textAnchor="middle" fontWeight="600" letterSpacing={1}>LEG SIDE</text>

      {/* Children (fielders) */}
      {children}
    </svg>
  );
}
