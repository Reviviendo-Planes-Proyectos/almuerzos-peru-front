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
  plugins: [],
};
