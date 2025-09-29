/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
     colors: {
        'pistachio': '#CDE8A6', // 기본 색
        'pistachio-dark': '#B0D99A', // hover
        'ivory': '#F9F6EE',   // 배경
        'darkbrown': '#4c3814'  // 어두운색 포인트
      }
    }
  },
  plugins: [],
}
