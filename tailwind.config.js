// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#007AFF",
        secondary: "#5856D6",
        tertiary: "#FF2D55",
        background: {
          light: "#F2F2F7",
          dark: "#1C1C1E"
        },
        card: {
          light: "rgba(255, 255, 255, 0.8)",
          dark: "rgba(44, 44, 46, 0.8)"
        }
      }
    },
  },
  plugins: [],
}