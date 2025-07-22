/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{html,ts}',
    './src/app/**/*.{html,ts}',
    './src/environments/**/*.{html,ts}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      fontFamily: {
        quicksand: ['var(--font-primary)', 'sans-serif'],
        roboto: ['var(--font-secondary)', 'sans-serif']
      },

      colors: {
        brand: {
          yellow: 'var(--color-brand-yellow)',
          beige: 'var(--color-brand-beige)',
          dark: 'var(--color-brand-dark)',
          green: 'var(--color-brand-green)',
        },
        gray: {
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
        },
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'var(--color-brand-yellow) var(--color-gray-200)',
        },
        '.scrollbar::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
          background: 'var(--color-gray-100)',
        },
        '.scrollbar::-webkit-scrollbar-thumb': {
          background: 'var(--color-brand-yellow)',
          borderRadius: '50px',
        },
        '.scrollbar::-webkit-scrollbar-thumb:hover': {
          background: '#f59e0b',
        },
        '.scrollbar::-webkit-scrollbar-track': {
          background: 'var(--color-gray-200)',
        },
      });
    }
  ]
};
