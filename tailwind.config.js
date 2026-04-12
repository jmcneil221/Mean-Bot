/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Quiet Luxury palette
        parchment: '#F9F8F6',
        'parchment-dark': '#F0EDE8',
        charcoal: '#2C2C2C',
        burgundy: '#6B1D2F',
        'burgundy-dark': '#4A1219',
        'burgundy-light': '#8A2A40',
        gold: '#A8896B',
        'gold-light': '#C4A584',

        // Brand namespace (for backward compat with existing pages)
        brand: {
          burgundy: '#6B1D2F',
          'burgundy-dark': '#4A1219',
          bronze: '#A8896B',
          'bronze-light': '#C4A584',
          charcoal: '#2C2C2C',
          cream: '#F9F8F6',
          green: '#2EC4B6',
          red: '#EF476F',
          // legacy aliases
          navy: '#2C2C2C',
          blue: '#6B1D2F',
          sky: '#A8896B',
          orange: '#A8896B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        premium: '0.15em',
      },
      borderColor: {
        DEFAULT: '#E8E4DE',
      },
    },
  },
  plugins: [],
};
