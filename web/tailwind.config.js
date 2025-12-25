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
          DEFAULT: '#00D9BC',
          dark: '#00B09A',
          light: '#33E3CC',
        },
        dark: {
          DEFAULT: '#0A0F1E',
          light: '#1A1F2E',
          lighter: '#2A2F3E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
