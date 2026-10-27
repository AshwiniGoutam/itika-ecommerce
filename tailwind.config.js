/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0A1A4A', deep: '#06102E', soft: '#1B2C68', line: '#22346F' },
        paper: '#F3F6FB',
        line: '#E1E6EF',
        ink: '#0F1B3D',
        orange: { DEFAULT: '#FF6A13', light: '#FF9A4D', dark: '#E2550A' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
