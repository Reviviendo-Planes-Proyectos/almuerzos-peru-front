/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,scss}',
  ],
  theme: {
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
      },

      borderRadius: {
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
    },
  },
  plugins: [],
};
