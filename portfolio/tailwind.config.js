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
        'bg-primary': '#1A1611',
        'bg-secondary': '#2A231C',
        'text-primary': '#FDF6E3',
        'text-secondary': '#BAAA8A',
        'accent-warm': '#D4A373',
        'accent-earth': '#8B6F47',
        'accent-leaf': '#556B2F',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
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
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-inter)'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#FDF6E3',
            a: {
              color: '#D4A373',
              '&:hover': {
                color: '#8B6F47',
              },
            },
            h1: {
              color: '#FDF6E3',
              fontWeight: '700',
            },
            h2: {
              color: '#FDF6E3',
              fontWeight: '700',
            },
            h3: {
              color: '#FDF6E3',
              fontWeight: '600',
            },
            h4: {
              color: '#FDF6E3',
              fontWeight: '600',
            },
            strong: {
              color: '#FDF6E3',
            },
            code: {
              color: '#D4A373',
              backgroundColor: 'rgba(212, 163, 115, 0.1)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
            },
            'ul > li::marker': {
              color: '#D4A373',
            },
            'ol > li::marker': {
              color: '#D4A373',
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