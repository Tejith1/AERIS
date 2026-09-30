/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a12',
          900: '#0b1329',
          800: '#111e3f',
          700: '#1b2d5a',
        },
        command: {
          surface: '#121c33',
          border: '#1e2d4a',
          accent: '#0284c7',
        },
        risk: {
          critical: '#ef4444',
          high: '#f97316',
          moderate: '#eab308',
          low: '#22c55e',
        }
      }
    },
  },
  plugins: [],
}
