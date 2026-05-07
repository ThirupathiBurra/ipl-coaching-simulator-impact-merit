import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-64 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-neon-cyan/20 animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={20} className="text-neon-cyan animate-spin" />
        </div>
      </div>
      <p className="text-sm text-white/40 font-medium animate-pulse">Loading…</p>
    </div>
  );
}
