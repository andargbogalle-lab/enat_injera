/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#a855f7',
        },
        secondary: {
          DEFAULT: '#6366f1'
        }
      }
    },
  },
  plugins: [],
}
