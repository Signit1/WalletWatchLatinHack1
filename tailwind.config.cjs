/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f17',
        card: '#121826',
        text: '#e5e7eb',
        muted: '#9aa4b2',
        primary: '#4f46e5'
      }
    }
  },
  plugins: []
};


