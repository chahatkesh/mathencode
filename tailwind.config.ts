import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#37474F",
        secondary: "#FF6700",
        accent: "#F59E0B",
        purple: "#7C3AED",
        orange: "#F97316",
        bright: {
          yellow: "#FACC15",
          blue: "#263238",
        },
        neutral: "#F3F4F6",
        dark: "#111827",
        "dark-blue": "#1E3A8A",
      },
      fontFamily: {
        sans: ["var(--font-reddit-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        custom:
          "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
