/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "loop-scroll": "loop-scroll 50s linear infinite",
        'shine': 'shine 1s',
      },
      keyframes: {
        "loop-scroll": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        shine: {
          '100%': { left: '125%' },
        },
      },
      colors: {
        primary: "#D97706",
        secondary: "#f3f3f3",
      },
      boxShadow: {
        "custom-inset":
          "px 3px 4px rgba(0, 0, 0, 0.25), inset 2px 5px 6px rgba(255, 255, 255, 0.37), inset 0px -5px 6px rgba(0, 0, 0, 0.37)",
      },
      containers: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
    },
  },
  plugins: [],
};
