/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        'gray': {
          750: '#1a1c23',
          850: '#12141a',
          950: '#0a0b0f',
        },
        // Blue accents
        'accent': {
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066ff',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        }
      },
      backgroundColor: {
        'dark': '#0a0b0f',
        'dark-lighter': '#12141a',
      }
    },
  },
  plugins: [],
};