/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Math blue from docs
        secondary: "#10B981", // Success green
        accent: "#F59E0B", // Warm yellow from docs
        purple: "#7C3AED", // Purple from the image
        orange: "#F97316", // Orange from the image
        bright: {
          yellow: "#FACC15", // Yellow from the image
          blue: "#2563EB", // Blue from the image
        },
        neutral: "#F3F4F6", // Light grey for backgrounds
        dark: "#1F2937", // Dark grey for text
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
