import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthInit } from "@hooks/useAuth";
import { useMatchStore } from "@store/matchStore";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import TopBanner from "./TopBanner";
import MatchTicker from "./MatchTicker";
import NotificationPanel from "@components/common/NotificationPanel";
import { AnimatePresence, motion } from "framer-motion";

export default function AppLayout() {
  useAuthInit();
  const location = useLocation();
  const startLiveTicker = useMatchStore((s) => s.startLiveTicker);
  const stopLiveTicker  = useMatchStore((s) => s.stopLiveTicker);

  // Start the live ball-by-ball ticker when the app shell mounts
  useEffect(() => {
    startLiveTicker();
    return () => stopLiveTicker();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <div className="flex h-screen overflow-hidden bg-navy-950 relative">
      {/* ── Ambient Background Energy ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-cyan/[0.03] blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/[0.03] blur-[120px] animate-blob" style={{ animationDelay: "2s" }} />
      </div>

      {/* Desktop Sidebar */}
      <div className="z-10 flex h-full">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        {/* Mobile Nav (hamburger header + drawer) */}
        <MobileNav />

        {/* Live Match Ticker */}
        <MatchTicker />

        {/* Top Banner */}
        <TopBanner />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 lg:p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel />
    </div>
  );
}
