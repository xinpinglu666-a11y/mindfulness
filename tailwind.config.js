/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cream: "#FBF7F0",
        forest: "#4A7C59",
        warm: "#C8A882",
        sand: "#E8D5B7",
        serene: "#7B9EA8",
        earth: "#3D3226",
        "forest-light": "#6B9F7A",
        "forest-dark": "#3A6347",
        "warm-light": "#DBC7A8",
        "cream-dark": "#F0E8D8",
      },
      fontFamily: {
        serif: ['"Songti SC"', '"Noto Serif SC"', '"STSong"', '"SimSun"', "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Noto Sans"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "breathe-in": "breatheIn 4s ease-in-out forwards",
        "breathe-hold-in": "holdIn 2s ease-in-out forwards",
        "breathe-out": "breatheOut 6s ease-in-out forwards",
        "breathe-hold-out": "holdOut 2s ease-in-out forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        ripple: "ripple 2s ease-out infinite",
      },
      keyframes: {
        breatheIn: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.35)" },
        },
        holdIn: {
          "0%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1.35)" },
        },
        breatheOut: {
          "0%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
        holdOut: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
