/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C1C1E',
        paper: '#FAFAF9',
        surface: '#FFFFFF',
        sunken: '#F3F2EE',
        line: '#E4E4E1',
        'line-soft': '#ECEBE7',
        accent: {
          DEFAULT: '#2F5D50',
          dark: '#21443A',
          light: '#3E7566',
          soft: '#E9F0EC',
        },
        gold: {
          DEFAULT: '#B7862C',
          soft: '#F6EEDD',
        },
        danger: {
          DEFAULT: '#B3452D',
          soft: '#F7EAE5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.04em' }],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28,28,30,0.04), 0 8px 24px -12px rgba(28,28,30,0.12)',
        lift: '0 4px 12px rgba(28,28,30,0.06), 0 16px 40px -16px rgba(28,28,30,0.18)',
        ring: '0 0 0 1px rgba(28,28,30,0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: 0, transform: 'translateX(16px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'slide-up-sheet': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in-up': 'fade-in-up 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up-sheet': 'slide-up-sheet 0.3s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 1.8s ease-in-out infinite',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
};
