/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Glassmorphism primary colors - soft gradients
        primary: {
          50: '#F8FAFC',
          100: '#E0F2FE',
          200: '#C7ECEE',
          300: '#9BD5D9',
          400: '#67BBBF',
          500: '#00C2FF', // Cyan for primary actions
          600: '#0EA5E9',
          700: '#0284C7',
          800: '#0369A1',
          900: '#0C4A6E',
        },
        // Liquid glass accent colors
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Glass/crystal whites and transparency
        glass: {
          50: '#ffffff',
          100: '#fefefe',
          200: '#fdfdfd',
          300: '#fbfbfb',
          400: '#f8f9fa',
          500: '#f1f3f4',
          600: '#e8eaed',
          700: '#dadce0',
          800: '#bdc1c6',
          900: '#9aa0a6',
        },
        // Water ripple blues
        wave: {
          50: '#ebf8ff',
          100: '#bee3f8',
          200: '#90cdf4',
          300: '#63b3ed',
          400: '#4299e1',
          500: '#3182ce',
          600: '#2b77cb',
          700: '#2c5aa0',
          800: '#2a4365',
          900: '#1a365d',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'wave': 'wave 3s ease-in-out infinite',
        'ripple': 'ripple 1.5s ease-out infinite',
        'liquid': 'liquid 4s ease-in-out infinite',
        'glass-shine': 'glassShine 2.5s ease-in-out infinite',
        'water-flow': 'waterFlow 8s linear infinite',
        'liquid-bounce': 'liquidBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'glass-morph': 'glassMorph 3s ease-in-out infinite',
        'stagger-up': 'staggerUp 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        wave: {
          '0%, 100%': {
            transform: 'translateX(0px) translateY(0px) rotate(0deg)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
          },
          '50%': {
            transform: 'translateX(5px) translateY(-10px) rotate(180deg)',
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%'
          },
        },
        ripple: {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '1'
          },
          '100%': {
            transform: 'scale(2.4)',
            opacity: '0'
          },
        },
        liquid: {
          '0%, 100%': {
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'translateX(0px) rotate(0deg)'
          },
          '50%': {
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
            transform: 'translateX(10px) rotate(180deg)'
          },
        },
        glassShine: {
          '0%': {
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(100%)'
          },
        },
        waterFlow: {
          '0%': {
            backgroundPosition: '0% 50%'
          },
          '50%': {
            backgroundPosition: '100% 50%'
          },
          '100%': {
            backgroundPosition: '0% 50%'
          },
        },
        liquidBounce: {
          '0%': {
            transform: 'scale(1) translateY(0px)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.05) translateY(-5px)',
            opacity: '0.9'
          },
          '100%': {
            transform: 'scale(1) translateY(0px)',
            opacity: '1'
          },
        },
        glassMorph: {
          '0%, 100%': {
            backdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
          },
          '50%': {
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          },
        },
        staggerUp: {
          '0%': {
            transform: 'translateY(60px) scale(0.9)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0px) scale(1)',
            opacity: '1'
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}