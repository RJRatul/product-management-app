/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d1821',
        secondary: '#eff1f3', 
        accent1: '#4e6e5d',
        accent2: '#ad8a64',
        accent3: '#a44a3f',
      },
    },
  },
  plugins: [],
}