/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D9BC',
        dark: '#0A0E27',
        'dark-light': '#141832',
        'dark-lighter': '#1E2139',
      },
    },
  },
  plugins: [],
}

