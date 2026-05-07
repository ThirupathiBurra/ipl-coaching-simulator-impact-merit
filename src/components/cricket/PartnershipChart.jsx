import { useMatchStore } from "@store/matchStore";
import { BarChart2 } from "lucide-react";
import clsx from "clsx";

function PartnershipBar({ runs, maxRuns, bat1, bat2 }) {
  const pct = Math.min((runs / maxRuns) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/70 font-medium">{bat1} & {bat2}</span>
        <span className="font-mono font-bold text-white">{runs}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function PartnershipChart({ className }) {
  const partnerships = useMatchStore((s) => s.liveMatch?.partnerships ?? []);
  const maxRuns = Math.max(...partnerships.map((p) => p.runs), 1);

  return (
    <div className={clsx("glass-card p-4 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="section-title">Partnerships</div>
          <div className="section-subtitle">Wicket-by-wicket breakdown</div>
        </div>
        <BarChart2 size={18} className="text-neon-cyan/40" />
      </div>

      <div className="space-y-3">
        {partnerships.map((p, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-white/30 uppercase w-12">
                {i === 0 ? "Opening" : `${i + 1}${["st","nd","rd","th"][Math.min(i,3)]} Wkt`}
              </span>
              <span className="text-[10px] text-white/30 font-mono">({p.balls} balls)</span>
            </div>
            <PartnershipBar runs={p.runs} maxRuns={maxRuns} bat1={p.bat1} bat2={p.bat2} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-white/40 pt-1 border-t border-white/[0.06]">
        <span>Total partnerships tracked</span>
        <span className="font-mono font-bold text-white">{partnerships.reduce((a, p) => a + p.runs, 0)} runs</span>
      </div>
    </div>
  );
}
