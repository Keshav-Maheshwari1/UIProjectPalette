/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-light': '0 2px 4px rgba(255, 255, 255, 0.1)', // light shadow for dark background
      }
    },
  },
  plugins: [],
}

