/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')
export default {
  content: [
    // Add your content sources here
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        'raptures-light': '#F6F3E7',
        'naval-night': '#011C39',
        'poseidon': '#143C5D',
        'silver-thistle-beige': '#E7D5C5',
        'honey-crusted-chicken': '#FFBB55',
        'autumn-fire': '#C44E4F',
      },
      fontFamily: {
        sans: ['Open Sans', ...fontFamily.sans],
        heading: ['Abril Fatface', ...fontFamily.serif],
      },
      fontSize: {
        'h1': ['3.5rem', { lineHeight: '1.2' }],
        'h2': ['2.5rem', { lineHeight: '1.15' }],
        'h3': ['2rem', { lineHeight: '1.15' }],
        'h4': ['1.5rem', { lineHeight: '1.15' }],
        'h5': ['1.25rem', { lineHeight: '1.15' }],
        'h6': ['1rem', { lineHeight: '1.15' }],
      }
    },
  },
  plugins: [],
}
