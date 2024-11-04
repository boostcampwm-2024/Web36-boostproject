/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
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
        50: '#F5F7F9',
        100: '#D2DAE0',
        200: '#879298',
        300: '#6E8091',
        400: '#5F6E76',
        500: '#4B5966',
        white: '#FFFFFF',
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
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
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
        '.text-blue': {
          color: theme('blue.400'),
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
        'surface-white': {
          backgroundColor: theme('white'),
        },
      }
      addUtilities(textUtils)
      addUtilities(colorUtils)
    },
    require('tailwindcss-animate'),
  ],
}
