import { NavLink, useLocation } from "react-router-dom";
import { useUserStore } from "@store/userStore";
import { useDecisionStore } from "@store/decisionStore";
import {
  LayoutDashboard,
  Swords,
  BrainCircuit,
  Trophy,
  UserCircle2,
  Zap,
  Target,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { to: "/",              icon: LayoutDashboard, label: "Dashboard",    end: true },
  { to: "/coaching-room", icon: Swords,          label: "Coaching Room" },
  { to: "/ai-insights",   icon: BrainCircuit,    label: "AI Insights"   },
  { to: "/leaderboard",   icon: Trophy,          label: "Leaderboard"   },
  { to: "/profile",       icon: UserCircle2,     label: "My Profile"    },
];

const BADGE_COLORS = {
  LEGEND:  "text-neon-gold border-neon-gold/40 bg-neon-gold/10",
  ELITE:   "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
  PRO:     "text-neon-purple border-neon-purple/40 bg-neon-purple/10",
  SKILLED: "text-neon-green border-neon-green/40 bg-neon-green/10",
  AMATEUR: "text-white/60 border-white/20 bg-white/5",
};

export default function Sidebar() {
  const user = useUserStore((s) => s.user);
  const sessionIMS = useDecisionStore((s) => s.sessionIMS);

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-white/[0.06] bg-navy-900/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center shadow-neon-cyan">
          <Target size={22} className="text-navy-950 font-bold" />
        </div>
        <div>
          <div className="font-display font-bold text-white text-base leading-tight">IPL Coach</div>
          <div className="text-[10px] text-neon-cyan/70 tracking-widest uppercase">Simulator</div>
        </div>
      </div>

      {/* Session IMS Banner */}
      {sessionIMS > 0 && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-neon-green/10 border border-neon-green/25 flex items-center gap-2">
          <Zap size={14} className="text-neon-green shrink-0" />
          <span className="text-xs text-white/80">Session IMS</span>
          <span className="ml-auto font-mono font-bold text-neon-green text-sm">+{sessionIMS}</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Menu</p>
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 group",
                isActive
                  ? "text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 shadow-neon-cyan"
                  : "text-white/60 hover:text-white hover:bg-white/[0.06] border border-transparent"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? "text-neon-cyan" : "text-white/40 group-hover:text-white/70"} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-neon-cyan/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      {user && (
        <div className="m-3 p-3 rounded-xl bg-surface-2 border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.displayName?.[0] ?? "C"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user.displayName}</div>
              <div className={clsx("text-[10px] font-bold border px-1.5 py-0.5 rounded mt-0.5 inline-block", BADGE_COLORS[user.badge])}>
                {user.badge}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
            <div className="text-center">
              <div className="font-mono text-sm font-bold text-white">{user.imsTotal.toLocaleString()}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">IMS</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-sm font-bold text-white">#{user.imsRank}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Rank</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-sm font-bold text-neon-green">{user.accuracy}%</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Accuracy</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
