/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f17",
        accent: "#4ea1ff",
        accent2: "#8b5bff",
      },
      boxShadow: {
        glow: "0 0 0 4px rgba(78, 161, 255, 0.18)",
      },
    },
  },
  plugins: [],
};

