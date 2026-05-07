import { useEffect } from "react";
import { useMatchStore } from "@store/matchStore";
import { X, CheckCircle2, AlertTriangle, Info, Zap } from "lucide-react";
import clsx from "clsx";

const ICON_MAP = {
  success: { Icon: CheckCircle2, color: "text-neon-green", bg: "bg-neon-green/10 border-neon-green/25" },
  warning: { Icon: AlertTriangle, color: "text-neon-gold",  bg: "bg-neon-gold/10 border-neon-gold/25"  },
  info:    { Icon: Info,         color: "text-neon-cyan",  bg: "bg-neon-cyan/10 border-neon-cyan/25"   },
  ims:     { Icon: Zap,          color: "text-neon-purple",bg: "bg-neon-purple/10 border-neon-purple/25"},
};

function NotifCard({ notif }) {
  const clear = useMatchStore((s) => s.clearNotification);
  const cfg = ICON_MAP[notif.type] || ICON_MAP.info;

  useEffect(() => {
    const t = setTimeout(() => clear(notif.id), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={clsx(
      "flex items-start gap-3 p-3 rounded-xl border backdrop-blur-sm shadow-card animate-slide-in-up",
      cfg.bg
    )}>
      <cfg.Icon size={16} className={clsx("shrink-0 mt-0.5", cfg.color)} />
      <div className="flex-1 min-w-0">
        {notif.title && <p className="text-sm font-semibold text-white leading-tight">{notif.title}</p>}
        <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{notif.message}</p>
      </div>
      <button onClick={() => clear(notif.id)} className="btn-icon shrink-0 p-1">
        <X size={12} />
      </button>
    </div>
  );
}

export default function NotificationPanel() {
  const notifications = useMatchStore((s) => s.notifications);
  if (!notifications.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      {notifications.slice(0, 4).map((n) => (
        <NotifCard key={n.id} notif={n} />
      ))}
    </div>
  );
}
