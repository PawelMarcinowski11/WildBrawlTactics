/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        'md': '640px',
      },
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('hoverable', '@media(hover: hover) and (pointer: fine)')
    })
  ]
}