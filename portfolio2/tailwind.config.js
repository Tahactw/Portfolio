/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'arena-dark': '#0A0A0A',
        'arena-floor': '#1A1A1A',
        'arena-tile': '#222222',
        'arena-border': '#2A2A2A',
        'accent-cyan': '#00D9FF',
        'accent-purple': '#BD00FF',
        'accent-green': '#00FF88',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'typewriter': 'typewriter 2s steps(40) 1s 1 normal both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        typewriter: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
      },
      fontFamily: {
        'display': ['var(--font-orbitron)'],
        'body': ['var(--font-rajdhani)'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#FFFFFF',
            a: {
              color: '#00D9FF',
              '&:hover': {
                color: '#BD00FF',
              },
            },
            h1: {
              color: '#FFFFFF',
              fontWeight: '700',
              fontFamily: 'var(--font-orbitron)',
            },
            h2: {
              color: '#FFFFFF',
              fontWeight: '700',
              fontFamily: 'var(--font-orbitron)',
            },
            h3: {
              color: '#FFFFFF',
              fontWeight: '600',
              fontFamily: 'var(--font-orbitron)',
            },
            h4: {
              color: '#FFFFFF',
              fontWeight: '600',
              fontFamily: 'var(--font-orbitron)',
            },
            strong: {
              color: '#FFFFFF',
            },
            code: {
              color: '#00FF88',
              backgroundColor: 'rgba(0, 255, 136, 0.1)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
            },
            'ul > li::marker': {
              color: '#00D9FF',
            },
            'ol > li::marker': {
              color: '#00D9FF',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};