/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1E3A5F',
          blue: '#0070F3',
          sky: '#00B4D8',
          orange: '#FF6B35',
          green: '#2EC4B6',
          red: '#EF476F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
