const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ["**/*.{ejs, js}", "**/**/*.{ejs, js}"],
  theme: {
    screens: {
      'xs': '361px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        'primary-color': '#0fa'
      },
      width:{
        '40' : '40%'
      }
    },
  },
  plugins: [],
}
