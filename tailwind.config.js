/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pantryOrange: "#FF8A3D",
        pantryCream: "#FFF7ED",
        pantryGreen: "#4CAF50",
        pantryText: "#1F2937",
        pantryBeige: "#F6E7D8"
      },
      fontFamily: {
        heading: ["Be Vietnam Pro", "system-ui", "sans-serif"],
        body: ["Be Vietnam Pro", "system-ui", "sans-serif"]
      },
      boxShadow: {
        pantry: "0 24px 70px rgba(88, 52, 23, 0.18)"
      }
    }
  },
  plugins: []
};
