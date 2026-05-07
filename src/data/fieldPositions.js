// ─── Cricket Field Simulator — Position & Preset Data ─────────────────────────
// SVG coordinate system: viewBox "0 0 400 400"
// Ground center: (200, 195), Pitch runs vertically center
// Off-side = RIGHT (right-handed batsman), Leg-side = LEFT

export const GROUND = {
  cx: 200, cy: 195,   // center
  outerR: 178,         // boundary radius
  innerR: 98,          // 30-yard circle radius
  pitchW: 14, pitchH: 80,
  pitchX: 193, pitchY: 155,  // top-left of pitch rect
};

// ─── Default fielder positions ─────────────────────────────────────────────────
export const DEFAULT_POSITIONS = {
  wk:           { id: "wk",           label: "Keeper",          x: 200, y: 255, zone: "leg",  infield: true,  description: "Wicketkeeper behind stumps"     },
  slip1:        { id: "slip1",        label: "1st Slip",        x: 230, y: 238, zone: "off",  infield: true,  description: "First slip cordon"              },
  slip2:        { id: "slip2",        label: "2nd Slip",        x: 249, y: 242, zone: "off",  infield: true,  description: "Second slip"                    },
  gully:        { id: "gully",        label: "Gully",           x: 265, y: 215, zone: "off",  infield: true,  description: "Gully off the bat"              },
  point:        { id: "point",        label: "Point",           x: 296, y: 195, zone: "off",  infield: true,  description: "Point — square off-side"        },
  coverPt:      { id: "coverPt",      label: "Cover Pt",        x: 288, y: 235, zone: "off",  infield: true,  description: "Cover point"                    },
  extraCover:   { id: "extraCover",   label: "Extra Cover",     x: 270, y: 265, zone: "off",  infield: true,  description: "Extra cover"                    },
  midOff:       { id: "midOff",       label: "Mid-Off",         x: 235, y: 295, zone: "off",  infield: true,  description: "Mid-off inside the circle"      },
  midOn:        { id: "midOn",        label: "Mid-On",          x: 165, y: 295, zone: "leg",  infield: true,  description: "Mid-on inside the circle"       },
  midWicket:    { id: "midWicket",    label: "Mid-Wkt",         x: 128, y: 265, zone: "leg",  infield: true,  description: "Mid-wicket"                     },
  squareLeg:    { id: "squareLeg",    label: "Square Leg",      x: 108, y: 195, zone: "leg",  infield: true,  description: "Square leg — square on-side"    },
  fineLeg:      { id: "fineLeg",      label: "Fine Leg",        x: 148, y: 140, zone: "leg",  infield: false, description: "Fine leg behind batsman"         },
  thirdMan:     { id: "thirdMan",     label: "Third Man",       x: 218, y: 130, zone: "off",  infield: false, description: "Third man — behind keeper"       },
  longOff:      { id: "longOff",      label: "Long Off",        x: 258, y: 348, zone: "off",  infield: false, description: "Long off at boundary"            },
  longOn:       { id: "longOn",       label: "Long On",         x: 142, y: 348, zone: "leg",  infield: false, description: "Long on at boundary"             },
  deepCover:    { id: "deepCover",    label: "Deep Cover",      x: 340, y: 242, zone: "off",  infield: false, description: "Deep cover on boundary"          },
  deepPoint:    { id: "deepPoint",    label: "Deep Point",      x: 342, y: 190, zone: "off",  infield: false, description: "Deep point / sweeper"            },
  deepSqLeg:    { id: "deepSqLeg",    label: "Deep Sq Leg",     x: 62,  y: 195, zone: "leg",  infield: false, description: "Deep square leg on boundary"     },
  deepMidWkt:   { id: "deepMidWkt",   label: "Deep Mid-Wkt",    x: 65,  y: 265, zone: "leg",  infield: false, description: "Deep mid-wicket on boundary"     },
  cowCorner:    { id: "cowCorner",    label: "Cow Corner",      x: 118, y: 346, zone: "leg",  infield: false, description: "Cow corner — deep leg boundary"  },
};

// Standard 11-fielder lineups (wk always included as non-optional)
export const FIELD_PRESETS = {
  attacking: {
    name: "Attacking",
    icon: "⚔️",
    description: "Slip cordon + inner ring — maximise wicket chances",
    color: "#FF1744",
    active: ["wk","slip1","slip2","gully","point","midOff","midOn","midWicket","squareLeg","fineLeg","thirdMan"],
  },
  defensive: {
    name: "Defensive",
    icon: "🛡️",
    description: "Boundary protection — concede singles, save boundaries",
    color: "#2979FF",
    active: ["wk","thirdMan","deepCover","deepPoint","longOff","longOn","deepSqLeg","deepMidWkt","cowCorner","midOff","midOn"],
  },
  deathOvers: {
    name: "Death Overs",
    icon: "💀",
    description: "Two men up, rest on boundary — overs 17-20",
    color: "#FF6D00",
    active: ["wk","thirdMan","longOff","longOn","deepCover","deepSqLeg","deepMidWkt","cowCorner","midOff","midOn","point"],
  },
  powerplay: {
    name: "Powerplay",
    icon: "⚡",
    description: "Max 2 outside inner ring — aggressive catching positions",
    color: "#AA00FF",
    active: ["wk","slip1","gully","point","coverPt","midOff","midOn","midWicket","squareLeg","fineLeg","thirdMan"],
  },
  spinTrap: {
    name: "Spin Trap",
    icon: "🌀",
    description: "Sweep-trap for spin bowling — short leg + silly mid-on",
    color: "#00BCD4",
    active: ["wk","slip1","point","coverPt","extraCover","midOff","midOn","midWicket","squareLeg","longOff","longOn"],
  },
  captainSetup: {
    name: "Captain's Setup",
    icon: "👑",
    description: "Bumrah's actual field against Dube in over 14",
    color: "#FFD600",
    active: ["wk","slip1","gully","point","midOff","midOn","midWicket","fineLeg","thirdMan","deepCover","longOn"],
  },
};

// ─── Tactical impact scoring ───────────────────────────────────────────────────
// How well a position covers each shot zone
export const ZONE_COVERAGE = {
  offSideInfield:  ["slip1","slip2","gully","point","coverPt","extraCover","midOff"],
  legSideInfield:  ["midOn","midWicket","squareLeg"],
  offSideBoundary: ["thirdMan","deepCover","deepPoint","longOff"],
  legSideBoundary: ["fineLeg","deepSqLeg","deepMidWkt","cowCorner","longOn"],
};

export function computeCoverage(activeIds) {
  const scores = {};
  Object.entries(ZONE_COVERAGE).forEach(([zone, positions]) => {
    const covered = positions.filter((p) => activeIds.includes(p)).length;
    scores[zone] = Math.round((covered / positions.length) * 100);
  });
  return scores;
}

export function computeDiff(userActive, captainActive) {
  const userSet    = new Set(userActive);
  const captainSet = new Set(captainActive);
  return {
    onlyUser:    userActive.filter((id) => !captainSet.has(id)),
    onlyCaptain: captainActive.filter((id) => !userSet.has(id)),
    shared:      userActive.filter((id) => captainSet.has(id)),
    matchScore:  Math.round((userActive.filter((id) => captainSet.has(id)).length / Math.max(captainActive.length, 1)) * 100),
  };
}
