/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
      },
      colors: {
        primary: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe',
          300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81',
        },
        violet: {
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
        },
        surface: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0',
          700: '#334155', 800: '#1e293b', 850: '#161f2e',
          900: '#0d1117', 925: '#090d14', 950: '#060910',
        },
        success: { 400: '#4ade80', 500: '#22c55e', 600: '#16a34a' },
        warning: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
        danger:  { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-success': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gradient-danger':  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'gradient-gold':    'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
        'gradient-mesh':    `
          radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.05) 0%, transparent 60%)
        `,
      },
      boxShadow: {
        'glass':    '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        'glass-lg': '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)',
        'glow':     '0 0 30px rgba(99,102,241,0.35)',
        'glow-sm':  '0 0 12px rgba(99,102,241,0.25)',
        'glow-lg':  '0 0 60px rgba(99,102,241,0.4)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.08)',
        'card':     '0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover': '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.15)',
        'sidebar':  '4px 0 24px rgba(0,0,0,0.3)',
        'modal':    '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease both',
        'slide-up':   'fadeSlideUp 0.4s cubic-bezier(0.4,0,0.2,1) both',
        'slide-down': 'slideDown 0.3s ease both',
        'scale-in':   'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
        'shimmer':    'shimmer 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'float':      'float 4s ease-in-out infinite',
        'spin-slow':  'spin 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(99,102,241,0.3)' },
          '50%':       { boxShadow: '0 0 28px rgba(99,102,241,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-6px)' },
        },
      },
      backdropBlur: { xs: '2px', '4xl': '72px' },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight:   '-0.02em',
      },
    },
  },
  plugins: [],
};
