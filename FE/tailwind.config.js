/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      fontSize: {
        L: '24px',
        M: '16px',
        R: '14px',
        S: '12px',
      },
      fontWeight: {
        Bold: '700',
        Medium: '500',
      },
      grayscale: {
        white: '#FFFFFF',
        50: '#F5F7F9',
        100: '#D2DAE0',
        200: '#879298',
        300: '#6E8091',
        400: '#5F6E76',
        500: '#4B5966',
        black: '#14212B',
      },
      blue: {
        100: '#EEF2FF',
        200: '#DDE4FF',
        300: '#7890E7',
        400: '#4462D0',
      },
      borderRadius: {
        radiusuFull: '999px',
        radiusu100: '8px',
      },
      borderWidth: {
        default: '1px',
      },
      gap: {
        default: '1px',
      },
      lineWeight: {
        default: '1px',
      },
      boxShadow: {
        popup:
          '0px 4px 2px rgba(20, 33, 43, 0.02), 0px 2px 18px rgba(20, 33, 43, 0.08)',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const textUtils = {
        '.BoldL-none': {
          fontSize: theme('fontSize.L'),
          fontWeight: theme('fontWeight.bold'),
          textDecoration: 'none',
        },
        '.BoldM-none': {
          fontSize: theme('fontSize.M'),
          fontWeight: theme('fontWeight.bold'),
          textDecoration: 'none',
        },
        '.BoldR-none': {
          fontSize: theme('fontSize.R'),
          fontWeight: theme('fontWeight.bold'),
          textDecoration: 'none',
        },
        '.BoldS-none': {
          fontSize: theme('fontSize.S'),
          fontWeight: theme('fontWeight.bold'),
          textDecoration: 'none',
        },
        '.MediumL-none': {
          fontSize: theme('fontSize.L'),
          fontWeight: theme('fontWeight.medium'),
          textDecoration: 'none',
        },
        '.MediumM-none': {
          fontSize: theme('fontSize.M'),
          fontWeight: theme('fontWeight.medium'),
          textDecoration: 'none',
        },
        '.MediumR-none': {
          fontSize: theme('fontSize.R'),
          fontWeight: theme('fontWeight.medium'),
          textDecoration: 'none',
        },
        '.MediumS-none': {
          fontSize: theme('fontSize.S'),
          fontWeight: theme('fontWeight.medium'),
          textDecoration: 'none',
        },
      }
      const colorUtils = {
        '.text-default': {
          color: theme('grayscale.500'),
        },
        '.text-strong': {
          color: theme('black'),
        },
        '.text-white': {
          color: theme('grayscale.50'),
        },
        '.surface-default': {
          backgroundColor: theme('grayscale.50'),
        },
        '.surface-box-light': {
          backgroundColor: theme('blue.100'),
        },
        '.surface-box-dark': {
          backgroundColor: theme('blue.400'),
        },
        'surface-selected': {
          backgroundColor: theme('blue.300'),
        },
      }
      addUtilities(textUtils)
      addUtilities(colorUtils)
    },
  ],
}
