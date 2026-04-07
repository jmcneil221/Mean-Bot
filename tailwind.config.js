/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#6B1F2A',
          'burgundy-dark': '#4A1219',
          bronze: '#A8896B',
          'bronze-light': '#C4A584',
          charcoal: '#1A1A1A',
          cream: '#F5EFE6',
          green: '#2EC4B6',
          red: '#EF476F',
          // legacy aliases — map old names to new palette so existing pages keep building
          navy: '#1A1A1A',
          blue: '#6B1F2A',
          sky: '#A8896B',
          orange: '#A8896B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
