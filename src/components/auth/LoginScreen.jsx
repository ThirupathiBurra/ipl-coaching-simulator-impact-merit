import { useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { isFirebaseReady } from "@services/firebase";
import { BrainCircuit, Loader2, Eye, EyeOff, AlertCircle, Zap } from "lucide-react";
import clsx from "clsx";

// ─── Tab switcher ──────────────────────────────────────────────────────────────
const TABS = ["Sign In", "Register"];

// ─── Login Screen ──────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, authError, isSigningIn, clearError } = useAuth();
  const [tab,      setTab]      = useState("Sign In");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [showPass, setShowPass] = useState(false);
  const firebaseReady = isFirebaseReady();

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    if (tab === "Sign In") {
      await loginWithEmail(email, password);
    } else {
      await registerWithEmail(email, password, name);
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ── Animated background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/5 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-neon-purple/5 blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        {/* Cricket field lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 800 600">
          <ellipse cx="400" cy="300" rx="350" ry="250" fill="none" stroke="#00E5FF" strokeWidth="1" />
          <ellipse cx="400" cy="300" rx="100" ry="80"  fill="none" stroke="#00E5FF" strokeWidth="1" />
          <line x1="400" y1="50"  x2="400" y2="550" stroke="#00E5FF" strokeWidth="0.5" />
          <line x1="50"  y1="300" x2="750" y2="300" stroke="#00E5FF" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        {/* ── Brand header ── */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,229,255,0.3)]">
            <BrainCircuit size={32} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-black text-white tracking-tight">IPL Coach AI</h1>
            <p className="text-white/40 text-sm mt-1">Gemini-powered IPL Coaching Simulator</p>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] text-white/25">
            {["🎯 Real-time IMS", "🧠 Gemini AI", "🏆 Leaderboards"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── Card ── */}
        <div className="glass-card p-7 space-y-5 border-white/10">
          {/* Firebase status */}
          {!firebaseReady && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neon-gold/8 border border-neon-gold/25 text-xs text-white/60">
              <Zap size={13} className="text-neon-gold shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-neon-gold">Demo Mode</span> — Firebase not configured.{" "}
                Add credentials to <code className="text-neon-cyan text-[11px] px-1 bg-white/10 rounded">.env</code> to enable real auth.
                The app is fully functional with mock data.
              </div>
            </div>
          )}

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl bg-surface-2 border border-white/[0.06]">
            {TABS.map((t) => (
              <button key={t} onClick={() => { setTab(t); clearError?.(); }}
                className={clsx("flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                  tab === t ? "bg-neon-cyan text-navy-950 font-black" : "text-white/40 hover:text-white"
                )}
              >{t}</button>
            ))}
          </div>

          {/* Error */}
          {authError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-neon-red/8 border border-neon-red/25 text-xs text-neon-red/90 animate-fade-in">
              <AlertCircle size={13} className="shrink-0" />
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === "Register" && (
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">Display Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Coach Name" required
                  className="input-field w-full text-sm" />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="input-field w-full text-sm" />
            </div>
            <div className="space-y-1 relative">
              <label className="text-[10px] text-white/40 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  className="input-field w-full text-sm pr-10" />
                <button type="button" onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isSigningIn || !firebaseReady}
              className="btn-primary w-full py-3 mt-1 disabled:opacity-50">
              {isSigningIn ? <><Loader2 size={15} className="animate-spin" /> {tab === "Sign In" ? "Signing in…" : "Creating account…"}</> : tab}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[10px] text-white/25">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Google button */}
          <button
            onClick={loginWithGoogle}
            disabled={isSigningIn || !firebaseReady}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 transition-all text-sm font-semibold text-white/80 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2a10.34 10.34 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z"/><path fill="#34A853" d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.92-2.26a5.43 5.43 0 0 1-8.09-2.85H.78v2.34A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.95 10.71a5.41 5.41 0 0 1 0-3.42V4.95H.78a9 9 0 0 0 0 8.1l3.17-2.34z"/><path fill="#EA4335" d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.58A8.64 8.64 0 0 0 9 0a9 9 0 0 0-8.22 4.95L3.95 7.3A5.36 5.36 0 0 1 9 3.58z"/></svg>
            )}
            Continue with Google
          </button>

          {/* Demo mode bypass */}
          {!firebaseReady && (
            <p className="text-center text-[10px] text-white/25">
              Running in demo mode — all features work with mock data.
            </p>
          )}
        </div>

        <p className="text-center text-[10px] text-white/20">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
