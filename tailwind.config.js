/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      colors: {
        brand: { DEFAULT: "#3B82F6", dark: "#2563EB", soft: "#0D1526", accent: "#60A5FA" },
        ink: "#F8FAFC",          // main text (now light!)
        muted: "#94A3B8",        // secondary text
        line: "#232838",         // borders
        surface: "#0A0C10",      // page background
        card: "#11141B",         // card background
        card2: "#161A23",        // elevated card
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4)",
        "card-hover": "0 16px 40px -12px rgba(59,130,246,0.25)",
        glow: "0 0 60px rgba(59,130,246,0.35)",
      },
    },
  },
  plugins: [],
}