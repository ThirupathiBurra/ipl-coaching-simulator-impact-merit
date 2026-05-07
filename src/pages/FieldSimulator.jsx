import { useState, useRef, useCallback, useEffect } from "react";
import { DEFAULT_POSITIONS, FIELD_PRESETS, computeDiff } from "@data/fieldPositions";
import CricketGround, { svgPoint, clampToGround } from "@components/simulator/CricketGround";
import Fielder, { STATUS } from "@components/simulator/Fielder";
import FieldControls from "@components/simulator/FieldControls";
import FieldCompare from "@components/simulator/FieldCompare";
import ShotZoneOverlay from "@components/simulator/ShotZoneOverlay";
import ImpactPanel from "@components/simulator/ImpactPanel";
import { useMatchStore } from "@store/matchStore";
import {
  Target, Eye, EyeOff, Crown, Layers, Save, RotateCcw,
  Activity, Zap, MapPin,
} from "lucide-react";
import clsx from "clsx";

const INITIAL_PRESET = "attacking";

// ─── Animated preset transition ───────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }

function animateToPositions(setPositions, current, target, steps = 12) {
  let step = 0;
  const interval = setInterval(() => {
    step++;
    const t = step / steps;
    setPositions((prev) => {
      const next = { ...prev };
      Object.keys(target).forEach((id) => {
        if (prev[id] && target[id]) {
          next[id] = {
            ...prev[id],
            x: lerp(prev[id].x, target[id].x, t),
            y: lerp(prev[id].y, target[id].y, t),
          };
        }
      });
      return next;
    });
    if (step >= steps) clearInterval(interval);
  }, 30);
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function FieldSimulator() {
  // ── Positions state ──────────────────────────────────────────────────────
  const [positions, setPositions] = useState(() => {
    const p = {};
    Object.values(DEFAULT_POSITIONS).forEach((pos) => { p[pos.id] = { ...pos }; });
    return p;
  });

  const [activeIds, setActiveIds]       = useState([...FIELD_PRESETS[INITIAL_PRESET].active]);
  const [activePreset, setActivePreset] = useState(INITIAL_PRESET);
  const [dragging, setDragging]         = useState(null);   // { id }
  const [hovered, setHovered]           = useState(null);   // fielder id
  const [selected, setSelected]         = useState(null);
  const [showLabels, setShowLabels]     = useState(true);
  const [showZones, setShowZones]       = useState(true);
  const [compareMode, setCompareMode]   = useState(false);
  const [savedMsg, setSavedMsg]         = useState(false);
  const [activeTab, setActiveTab]       = useState("field"); // "field" | "impact"

  const svgRef   = useRef(null);
  const addNotif = useMatchStore((s) => s.addNotification);

  const captainActive = FIELD_PRESETS.captainSetup.active;
  const diff = computeDiff(activeIds, captainActive);

  // ── Fielder status ───────────────────────────────────────────────────────
  function getStatus(id) {
    if (dragging?.id === id || selected === id) return STATUS.SELECTED;
    if (!compareMode) return activeIds.includes(id) ? STATUS.NORMAL : STATUS.REMOVED;
    const inUser = activeIds.includes(id);
    const inCap  = captainActive.includes(id);
    if (!inUser && !inCap) return STATUS.REMOVED;
    if (inUser && inCap)   return STATUS.SHARED;
    if (inUser)            return STATUS.USER_ONLY;
    return STATUS.CAPTAIN;
  }

  // ── Apply preset (animated) ──────────────────────────────────────────────
  function applyPreset(key) {
    const preset = FIELD_PRESETS[key];
    if (!preset) return;

    const targetPositions = {};
    preset.active.forEach((id) => {
      if (DEFAULT_POSITIONS[id]) targetPositions[id] = { ...DEFAULT_POSITIONS[id] };
    });

    animateToPositions(setPositions, positions, targetPositions);
    setTimeout(() => {
      setPositions((prev) => {
        const next = { ...prev };
        preset.active.forEach((id) => {
          if (DEFAULT_POSITIONS[id]) next[id] = { ...DEFAULT_POSITIONS[id] };
        });
        return next;
      });
    }, 400);

    setActiveIds([...preset.active]);
    setActivePreset(key);
    setSelected(null);
  }

  // ── Toggle active ─────────────────────────────────────────────────────────
  function toggleActive(id) {
    if (id === "wk") return;
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 11 ? [...prev, id] : prev
    );
    setActivePreset(null);
  }

  // ── Drag engine (pointer events) ──────────────────────────────────────────
  const handlePointerDown = useCallback((e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!svgRef.current) return;
    if (!activeIds.includes(id)) { toggleActive(id); return; }

    const pt = svgPoint(svgRef.current, e.clientX, e.clientY);
    const pos = positions[id];
    setDragging({ id, offsetX: pt.x - pos.x, offsetY: pt.y - pos.y });
    setSelected(id);
  }, [activeIds, positions]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging || !svgRef.current) return;
    e.preventDefault();
    const raw = svgPoint(svgRef.current, e.clientX, e.clientY);
    const { x, y } = clampToGround(raw.x - dragging.offsetX, raw.y - dragging.offsetY);
    setPositions((prev) => ({ ...prev, [dragging.id]: { ...prev[dragging.id], x, y } }));
  }, [dragging]);

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(null);
    setActivePreset(null);
  }, [dragging]);

  // ── Save / Reset ──────────────────────────────────────────────────────────
  function handleReset() {
    const next = {};
    Object.values(DEFAULT_POSITIONS).forEach((pos) => { next[pos.id] = { ...pos }; });
    animateToPositions(setPositions, positions, next);
    setTimeout(() => setPositions(next), 400);
    setActiveIds([...FIELD_PRESETS[INITIAL_PRESET].active]);
    setActivePreset(INITIAL_PRESET);
    setSelected(null);
  }

  function handleSave() {
    setSavedMsg(true);
    addNotif({ type: "info", title: "Field Saved!", message: `${activeIds.length}-fielder custom setup saved.` });
    setTimeout(() => setSavedMsg(false), 2500);
  }

  // Which ids to render
  const renderIds = compareMode
    ? [...new Set([...activeIds, ...captainActive])]
    : Object.keys(positions);

  const matchScore = diff.matchScore;
  const scoreBg = matchScore >= 80 ? "bg-neon-green/10 border-neon-green/30 text-neon-green"
    : matchScore >= 60 ? "bg-neon-gold/10 border-neon-gold/30 text-neon-gold"
    : "bg-neon-red/10 border-neon-red/30 text-neon-red";

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2.5">
            <MapPin size={22} className="text-neon-cyan" />
            Field Placement Simulator
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            Drag fielders freely • Apply tactical presets • Analyse shot zones • Compare with captain
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowZones((p) => !p)}
            className={clsx("btn-ghost text-xs py-2 px-3 border", showZones ? "border-neon-purple/40 text-neon-purple bg-neon-purple/8" : "border-white/10 text-white/40")}
          >
            <Activity size={13} /> Zones
          </button>
          <button onClick={() => setShowLabels((p) => !p)}
            className={clsx("btn-ghost text-xs py-2 px-3 border", showLabels ? "border-neon-cyan/30 text-neon-cyan" : "border-white/10 text-white/40")}
          >
            {showLabels ? <Eye size={13} /> : <EyeOff size={13} />} Labels
          </button>
          <button onClick={() => setCompareMode((p) => !p)}
            className={clsx("btn-ghost text-xs py-2 px-3 border transition-all", compareMode ? "border-neon-gold/40 text-neon-gold bg-neon-gold/10" : "border-white/10 text-white/40")}
          >
            <Crown size={13} /> {compareMode ? "Compare ON" : "Compare"}
          </button>
          {compareMode && (
            <div className={clsx("text-xs font-black px-3 py-1.5 rounded-full border", scoreBg)}>
              {matchScore}% match
            </div>
          )}
        </div>
      </div>

      {/* ── 3-column Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr_280px] gap-4">

        {/* LEFT: Presets + Coverage */}
        <div className="hidden xl:block">
          <FieldControls
            activeIds={activeIds}
            activePreset={activePreset}
            onPresetApply={applyPreset}
            onReset={handleReset}
            onSave={handleSave}
            fielderCount={activeIds.length}
          />
        </div>

        {/* CENTER: Ground + mobile tabs */}
        <div className="flex flex-col gap-3">
          {/* Status bar */}
          <div className="glass-card px-4 py-2.5 flex items-center gap-4 text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan inline-block" />
              <span className="text-white/50">Your field</span>
            </div>
            {compareMode && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neon-green inline-block" />
                  <span className="text-white/50">Only yours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neon-gold inline-block" />
                  <span className="text-white/50">Only captain</span>
                </div>
              </>
            )}
            {showZones && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1.5 rounded-sm bg-neon-purple/60 inline-block" />
                <span className="text-white/50">Zone overlay</span>
              </div>
            )}
            <div className="ml-auto flex items-center gap-3 font-mono text-white/40">
              <span className={clsx(activeIds.length === 11 ? "text-neon-green" : "text-neon-gold")}>{activeIds.length}/11</span>
              {dragging && <span className="text-neon-cyan animate-pulse font-medium">Moving {positions[dragging.id]?.label}…</span>}
              {savedMsg && <span className="text-neon-green font-medium">✓ Saved!</span>}
            </div>
          </div>

          {/* SVG Ground */}
          <div className="glass-card overflow-hidden border border-white/[0.06] relative"
            style={{ aspectRatio: "1/1", maxHeight: "calc(100vh - 280px)", minHeight: "380px" }}>
            <CricketGround
              svgRef={svgRef}
              onGroundPointerMove={handlePointerMove}
              onGroundPointerUp={handlePointerUp}
            >
              {/* Shot zone overlay — rendered first (behind fielders) */}
              <ShotZoneOverlay activeIds={activeIds} show={showZones} />

              {/* Fielders */}
              {renderIds.map((id) => {
                const pos = positions[id];
                if (!pos) return null;
                const status   = getStatus(id);
                const isActive = activeIds.includes(id) || (compareMode && captainActive.includes(id));
                if (!isActive && !compareMode) return null;

                return (
                  <Fielder
                    key={id}
                    id={id}
                    x={pos.x}
                    y={pos.y}
                    label={pos.label}
                    status={status}
                    isDragging={dragging?.id === id}
                    isActive={hovered === id || selected === id}
                    showLabel={showLabels}
                    onPointerDown={handlePointerDown}
                    onPointerEnter={() => setHovered(id)}
                    onPointerLeave={() => setHovered(null)}
                  />
                );
              })}
            </CricketGround>
          </div>

          {/* Mobile: preset chips */}
          <div className="xl:hidden flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {Object.entries(FIELD_PRESETS).map(([key, p]) => (
              <button key={key} onClick={() => applyPreset(key)}
                className={clsx(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all",
                  activePreset === key ? "text-navy-950 border-transparent" : "border-white/15 text-white/50 hover:text-white"
                )}
                style={activePreset === key ? { background: p.color } : {}}
              >
                {p.icon} {p.name}
              </button>
            ))}
          </div>

          {/* Selected/Hovered info bar */}
          {(selected || hovered) && (() => {
            const id  = hovered || selected;
            const pos = DEFAULT_POSITIONS[id];
            return (
              <div className="glass-card px-4 py-3 flex items-center gap-3 animate-slide-in-up border border-neon-cyan/15">
                <div className="w-8 h-8 rounded-full bg-neon-cyan flex items-center justify-center text-navy-950 text-xs font-black shrink-0">
                  {pos?.label?.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white">{pos?.label}</div>
                  <div className="text-[11px] text-white/40">{pos?.description}</div>
                </div>
                <div className="text-[10px] font-mono text-white/25">
                  {Math.round(positions[id]?.x ?? 0)}, {Math.round(positions[id]?.y ?? 0)}
                </div>
                {selected && <button onClick={() => setSelected(null)} className="btn-icon p-1 text-white/30">✕</button>}
              </div>
            );
          })()}
        </div>

        {/* RIGHT: Tab panel */}
        <div className="space-y-3">
          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl bg-surface-2 border border-white/[0.06]">
            {[
              { id: "field",  label: "Positions", icon: Layers },
              { id: "impact", label: "Impact",    icon: Zap    },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all",
                  activeTab === id ? "bg-neon-cyan text-navy-950 font-black" : "text-white/40 hover:text-white"
                )}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {/* Tab: Positions grid */}
          {activeTab === "field" && (
            <div className="glass-card p-4 space-y-3">
              <div className="text-[10px] text-white/30 uppercase tracking-wider">
                Click to toggle · Drag on ground to move
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto no-scrollbar">
                {Object.values(DEFAULT_POSITIONS).map((pos) => {
                  const isActive = activeIds.includes(pos.id);
                  return (
                    <button key={pos.id} onClick={() => toggleActive(pos.id)} disabled={pos.id === "wk"}
                      className={clsx(
                        "flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-[11px] font-medium transition-all text-left",
                        isActive ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan" : "bg-white/[0.02] border-white/[0.06] text-white/25 hover:text-white/50 hover:border-white/15"
                      )}
                    >
                      <span className={clsx("w-2 h-2 rounded-full shrink-0", isActive ? "bg-neon-cyan" : "bg-white/15")} />
                      <span className="truncate">{pos.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab: Impact analysis */}
          {activeTab === "impact" && (
            <ImpactPanel activeIds={activeIds} hoveredId={hovered} />
          )}

          {/* Captain compare (always visible) */}
          <FieldCompare userActive={activeIds} />

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleReset} className="btn-ghost text-xs py-2.5 border border-white/10 flex items-center gap-1.5 justify-center">
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={handleSave} className="btn-secondary text-xs py-2.5 flex items-center gap-1.5 justify-center">
              <Save size={12} /> Save Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
