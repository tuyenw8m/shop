import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: '#ee4d2d'
      },
      maxWidth: {
        '7xl': '80rem'
      },
      animation: {
        scaleIn: 'popup 0.5s ease-out forwards'
      },
      keyframes: {
        popup: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
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

export default config
