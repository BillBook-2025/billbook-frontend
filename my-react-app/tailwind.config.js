/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
     colors: {
        pistachio: '#CDE8A6',
        'pistachio-dark': '#B0D99A', // hover
        ivory: '#F9F6EE',   // 배경
      }
    }
  },
  plugins: [],
}
