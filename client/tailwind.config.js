/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Romantic Glow Palette
        rose: {
          cream: 'var(--rose-cream)',
          blush: 'var(--rose-blush)',
          petal: '#d4a0a0',
          deep: 'var(--rose-deep)',
          wine: '#8b4a6b',
        },
        noir: {
          midnight: 'var(--noir-midnight)',
          deep: 'var(--noir-deep)',
          purple: 'var(--noir-purple)',
          mist: '#3d2465',
        },
        gold: {
          soft: 'var(--gold-soft)',
          warm: '#c9a55a',
          rose: '#b8956a',
        },
        // Cinematic Palette
        cinema: {
          dark: '#0a0a0f',
          warm: '#1a1510',
          amber: '#d4a654',
          silver: '#c8c8d0',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        script: ['Dancing Script', 'cursive'],
        sans: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['Courier Prime', 'Courier New', 'monospace'],
        display: ['Libre Baskerville', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'romantic-gradient': 'linear-gradient(135deg, #1a0a2e 0%, #2d1650 50%, #1a0a2e 100%)',
        'rose-gradient': 'linear-gradient(135deg, #e8c4b8 0%, #c4a882 100%)',
        'cinema-gradient': 'linear-gradient(180deg, #0a0a0f 0%, #1a1510 100%)',
        'glow-radial': 'radial-gradient(ellipse at center, rgba(232, 196, 184, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fade-up 0.8s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'particle': 'particle 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
      },
      boxShadow: {
        'romantic': '0 0 40px rgba(232, 196, 184, 0.2)',
        'glow': '0 0 60px rgba(232, 196, 184, 0.3)',
        'deep': '0 20px 60px rgba(0, 0, 0, 0.5)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
