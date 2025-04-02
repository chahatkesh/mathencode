/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#37474F", // Math blue from docs
        secondary: "#FF6700", // Success green
        accent: "#F59E0B", // Warm yellow from docs
        purple: "#7C3AED", // Purple from the image
        orange: "#F97316", // Orange from the image
        bright: {
          yellow: "#FACC15", // Yellow from the image
          blue: "#263238", // Blue from the image
        },
        neutral: "#F3F4F6", // Light grey for backgrounds
        dark: "#111827", // Darker grey for background (updated)
        "dark-blue": "#1E3A8A", // Deep blue for alternate dark backgrounds
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        'custom': '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)',
      }
    },
  },
  plugins: [],
};