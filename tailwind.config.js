/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette
        navy: {
          950: "#03050F",
          900: "#060B1A",
          800: "#0C1628",
          700: "#112035",
          600: "#162B47",
        },
        neon: {
          cyan:    "#00E5FF",
          blue:    "#2979FF",
          purple:  "#AA00FF",
          green:   "#00E676",
          gold:    "#FFD600",
          orange:  "#FF6D00",
          red:     "#FF1744",
        },
        // IMS Score bands
        ims: {
          elite:   "#00E676",
          great:   "#76FF03",
          good:    "#FFD600",
          average: "#FF9100",
          poor:    "#FF1744",
        },
        surface: {
          1: "#0C1628",
          2: "#112035",
          3: "#162B47",
          4: "#1D3557",
        },
      },
      fontFamily: {
        sans:  ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "sans-serif"],
        mono:  ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "ipl-gradient":   "linear-gradient(135deg, #060B1A 0%, #0C1628 50%, #112035 100%)",
        "neon-cyan-glow": "linear-gradient(90deg, #00E5FF22, #00E5FF)",
        "gold-gradient":  "linear-gradient(90deg, #FFD600, #FF6D00)",
        "ims-gradient":   "linear-gradient(90deg, #FF1744, #FF9100, #FFD600, #76FF03, #00E676)",
        "card-glass":     "linear-gradient(135deg, rgba(22,43,71,0.6), rgba(11,22,40,0.8))",
      },
      boxShadow: {
        "neon-cyan":   "0 0 20px rgba(0,229,255,0.4), 0 0 40px rgba(0,229,255,0.15)",
        "neon-gold":   "0 0 20px rgba(255,214,0,0.4),  0 0 40px rgba(255,214,0,0.15)",
        "neon-green":  "0 0 20px rgba(0,230,118,0.4),  0 0 40px rgba(0,230,118,0.15)",
        "neon-purple": "0 0 20px rgba(170,0,255,0.4),  0 0 40px rgba(170,0,255,0.15)",
        "card":        "0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.6)",
        "card-hover":  "0 8px 40px rgba(0,229,255,0.15), 0 2px 8px rgba(0,0,0,0.5)",
        "glass":       "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
      },
      borderColor: {
        glass: "rgba(255,255,255,0.08)",
        "glass-cyan": "rgba(0,229,255,0.3)",
        "glass-gold": "rgba(255,214,0,0.3)",
      },
      animation: {
        "pulse-slow":    "pulse 3s ease-in-out infinite",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "slide-in-up":   "slideInUp 0.4s ease-out",
        "fade-in":       "fadeIn 0.3s ease-out",
        "ticker":        "ticker 80s linear infinite",
        "glow-pulse":    "glowPulse 2s ease-in-out infinite",
        "score-pop":     "scorePop 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        "spin-slow":     "spin 8s linear infinite",
        "shimmer":       "shimmer 2s infinite linear",
        "blob":          "blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        slideInLeft: {
          from: { transform: "translateX(-20px)", opacity: "0" },
          to:   { transform: "translateX(0)",      opacity: "1" },
        },
        slideInUp: {
          from: { transform: "translateY(16px)", opacity: "0" },
          to:   { transform: "translateY(0)",     opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        ticker: {
          from: { transform: "translateX(100%)" },
          to:   { transform: "translateX(-100%)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0,229,255,0.3)" },
          "50%":      { boxShadow: "0 0 30px rgba(0,229,255,0.7)" },
        },
        scorePop: {
          from: { transform: "scale(0.6)", opacity: "0" },
          to:   { transform: "scale(1)",   opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },
    },
  },
  plugins: [],
};
