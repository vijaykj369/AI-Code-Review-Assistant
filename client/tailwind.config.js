/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0D1117',
          surface: '#161B22',
          hover: '#1C2330',
          border: '#30363D',
        },
        accent: {
          DEFAULT: '#388BFD',
          hover: '#1F6FEB',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}