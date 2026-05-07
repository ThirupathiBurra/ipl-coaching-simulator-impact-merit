import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUserStore } from "@store/userStore";
import {
  LayoutDashboard, Swords, BrainCircuit, Trophy, UserCircle2,
  Menu, X, Target, ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { to: "/",              icon: LayoutDashboard, label: "Dashboard",    end: true },
  { to: "/coaching-room", icon: Swords,          label: "Coaching Room" },
  { to: "/ai-insights",   icon: BrainCircuit,    label: "AI Insights"   },
  { to: "/leaderboard",   icon: Trophy,          label: "Leaderboard"   },
  { to: "/profile",       icon: UserCircle2,     label: "My Profile"    },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const user = useUserStore((s) => s.user);

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-navy-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
            <Target size={16} className="text-navy-950" />
          </div>
          <span className="font-display font-bold text-white text-sm">IPL Coach</span>
        </div>
        <button onClick={() => setOpen(true)} className="btn-icon">
          <Menu size={20} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={clsx(
        "lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-navy-900 border-r border-white/[0.06] flex flex-col transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
              <Target size={18} className="text-navy-950" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">IPL Coach</div>
              <div className="text-[10px] text-neon-cyan/70 tracking-widest uppercase">Simulator</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="btn-icon"><X size={18} /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-250 group",
                  isActive
                    ? "text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20"
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
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold text-sm">
                {user.displayName?.[0] ?? "C"}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{user.displayName}</div>
                <div className="text-xs text-white/40 font-mono">IMS: {user.imsTotal.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
