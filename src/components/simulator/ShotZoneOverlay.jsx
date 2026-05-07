import { GROUND } from "@data/fieldPositions";

// ─── Shot zones drawn on the field as arc segments ────────────────────────────
// Each zone covers a directional arc. Coverage = how many fielders are in it.

const SHOT_ZONES = [
  { id: "thirdman_zone",    label: "3rd Man",     startA: -30,  endA: 10,   r1: 80,  r2: 178, color: "#00E5FF", zone: "off"  },
  { id: "slip_zone",        label: "Slips",       startA: 10,   endA: 40,   r1: 20,  r2: 80,  color: "#00E5FF", zone: "off"  },
  { id: "point_zone",       label: "Point",       startA: 50,   endA: 90,   r1: 20,  r2: 130, color: "#2979FF", zone: "off"  },
  { id: "cover_zone",       label: "Cover",       startA: 90,   endA: 130,  r1: 20,  r2: 130, color: "#2979FF", zone: "off"  },
  { id: "midoff_zone",      label: "Mid-Off",     startA: 130,  endA: 160,  r1: 20,  r2: 100, color: "#AA00FF", zone: "off"  },
  { id: "midoff_deep",      label: "Long Off",    startA: 130,  endA: 160,  r1: 100, r2: 178, color: "#AA00FF", zone: "off"  },
  { id: "midon_zone",       label: "Mid-On",      startA: 160,  endA: 190,  r1: 20,  r2: 100, color: "#AA00FF", zone: "leg"  },
  { id: "midon_deep",       label: "Long On",     startA: 160,  endA: 190,  r1: 100, r2: 178, color: "#AA00FF", zone: "leg"  },
  { id: "midwicket_zone",   label: "Mid-Wkt",     startA: 190,  endA: 230,  r1: 20,  r2: 130, color: "#7C4DFF", zone: "leg"  },
  { id: "sqleg_zone",       label: "Sq Leg",      startA: 230,  endA: 270,  r1: 20,  r2: 130, color: "#7C4DFF", zone: "leg"  },
  { id: "fineleg_zone",     label: "Fine Leg",    startA: 270,  endA: 330,  r1: 80,  r2: 178, color: "#E040FB", zone: "leg"  },
];

// Map from zone id to position ids that cover it
const ZONE_FIELDERS = {
  thirdman_zone:  ["thirdMan"],
  slip_zone:      ["slip1", "slip2"],
  point_zone:     ["point", "gully"],
  cover_zone:     ["coverPt", "extraCover"],
  midoff_zone:    ["midOff"],
  midoff_deep:    ["longOff"],
  midon_zone:     ["midOn"],
  midon_deep:     ["longOn"],
  midwicket_zone: ["midWicket"],
  sqleg_zone:     ["squareLeg"],
  fineleg_zone:   ["fineLeg", "deepSqLeg"],
};

// Convert polar to Cartesian (angle in degrees, 0=up, clockwise)
function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Build SVG arc path for a zone
function arcPath(cx, cy, r1, r2, startA, endA) {
  const s1 = polarToXY(cx, cy, r1, startA);
  const e1 = polarToXY(cx, cy, r1, endA);
  const s2 = polarToXY(cx, cy, r2, endA);
  const e2 = polarToXY(cx, cy, r2, startA);
  const largeArc = endA - startA > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${r1} ${r1} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${r2} ${r2} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

export default function ShotZoneOverlay({ activeIds, show }) {
  if (!show) return null;
  const { cx, cy } = GROUND;

  return (
    <>
      {SHOT_ZONES.map((zone) => {
        const coverers = ZONE_FIELDERS[zone.id] || [];
        const covered  = coverers.some((id) => activeIds.includes(id));
        const opacity  = covered ? 0.10 : 0.04;
        const strokeOp = covered ? 0.25 : 0.08;

        return (
          <g key={zone.id}>
            <path
              d={arcPath(cx, cy, zone.r1, zone.r2, zone.startA, zone.endA)}
              fill={zone.color}
              stroke={zone.color}
              strokeWidth={0.5}
              fillOpacity={opacity}
              strokeOpacity={strokeOp}
              style={{ transition: "fill-opacity 0.5s, stroke-opacity 0.5s" }}
            />
            {/* Zone label at midpoint arc */}
            {(() => {
              const midA = (zone.startA + zone.endA) / 2;
              const midR = (zone.r1 + zone.r2) / 2;
              const { x, y } = polarToXY(cx, cy, midR, midA);
              return (
                <text
                  x={x} y={y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={5.5} fill={zone.color}
                  fillOpacity={covered ? 0.7 : 0.2}
                  fontWeight={600}
                  style={{ pointerEvents: "none", transition: "fill-opacity 0.5s" }}
                >
                  {zone.label}
                </text>
              );
            })()}
          </g>
        );
      })}
    </>
  );
}
