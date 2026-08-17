/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sunrise: {
          50: '#FFF6EE',
          100: '#FFEBD8',
          200: '#FFD3AF',
          300: '#FFB37C',
          400: '#FF8B47',
          500: '#FF6B1F',
          600: '#F25410',
          700: '#C93D0C',
          800: '#A13312',
          900: '#822D13',
        },
        ink: {
          50: '#F4F6F9',
          100: '#E8ECF2',
          200: '#D2DAE6',
          300: '#ADBCCA',
          400: '#8098AB',
          500: '#5F7A90',
          600: '#4A6278',
          700: '#3D5063',
          800: '#243649',
          900: '#16222F',
          950: '#0D1620',
        },
      },
      spacing: {
        container: '72rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(13, 22, 32, 0.08)',
        card: '0 4px 24px -6px rgba(13, 22, 32, 0.12)',
        lift: '0 12px 32px -8px rgba(13, 22, 32, 0.18)',
        glow: '0 0 0 4px rgba(255, 107, 31, 0.15)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.35s ease-out',
        'pulse-ring': 'pulse-ring 1.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}
