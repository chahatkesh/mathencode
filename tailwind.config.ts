import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        admin: "var(--admin-radius)",
      },
      colors: {
        "admin-background": "hsl(var(--admin-background) / <alpha-value>)",
        "admin-foreground": "hsl(var(--admin-foreground) / <alpha-value>)",
        "admin-card": {
          DEFAULT: "hsl(var(--admin-card) / <alpha-value>)",
          foreground: "hsl(var(--admin-card-foreground) / <alpha-value>)",
        },
        "admin-popover": {
          DEFAULT: "hsl(var(--admin-popover) / <alpha-value>)",
          foreground: "hsl(var(--admin-popover-foreground) / <alpha-value>)",
        },
        "admin-primary": {
          DEFAULT: "hsl(var(--admin-primary) / <alpha-value>)",
          foreground: "hsl(var(--admin-primary-foreground) / <alpha-value>)",
        },
        "admin-secondary": {
          DEFAULT: "hsl(var(--admin-secondary) / <alpha-value>)",
          foreground: "hsl(var(--admin-secondary-foreground) / <alpha-value>)",
        },
        "admin-muted": {
          DEFAULT: "hsl(var(--admin-muted) / <alpha-value>)",
          foreground: "hsl(var(--admin-muted-foreground) / <alpha-value>)",
        },
        "admin-accent": {
          DEFAULT: "hsl(var(--admin-accent) / <alpha-value>)",
          foreground: "hsl(var(--admin-accent-foreground) / <alpha-value>)",
        },
        "admin-destructive": {
          DEFAULT: "hsl(var(--admin-destructive) / <alpha-value>)",
          foreground:
            "hsl(var(--admin-destructive-foreground) / <alpha-value>)",
        },
        "admin-border": "hsl(var(--admin-border) / <alpha-value>)",
        "admin-input": "hsl(var(--admin-input) / <alpha-value>)",
        "admin-ring": "hsl(var(--admin-ring) / <alpha-value>)",
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
  plugins: [animate],
};

export default config;
