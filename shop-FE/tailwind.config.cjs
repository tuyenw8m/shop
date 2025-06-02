const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: '#ee4d2d'
      },
      // Thêm cấu hình maxWidth nếu chưa có
      maxWidth: {
        '7xl': '80rem' // Giá trị mặc định của 7xl trong Tailwind
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      addUtilities({
        '.container': {
          maxWidth: theme('maxWidth.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
    })
  ]
}
