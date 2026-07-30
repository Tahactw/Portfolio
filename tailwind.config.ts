import type { Config } from 'tailwindcss';

/**
 * Colours, fonts and easings live in src/styles/tokens.css as CSS custom
 * properties (the theme system swaps them per [data-theme]). Tailwind only
 * maps names onto those variables, so no colour value is duplicated here.
 */
export default {
  content: ['./src/**/*.{astro,ts,tsx,html}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: 'var(--c-ink)',
      panel: 'var(--c-panel)',
      line: 'var(--c-line)',
      text: 'var(--c-text)',
      muted: 'var(--c-muted)',
      accent: 'var(--c-accent)',
      'accent-text': 'var(--c-accent-text)',
      'accent-ink': 'var(--c-accent-ink)',
    },
    fontFamily: {
      sans: ['Archivo', 'system-ui', 'sans-serif'],
      mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
    },
    extend: {
      maxWidth: {
        wrap: '72rem',
      },
      transitionTimingFunction: {
        settle: 'var(--ease-settle)',
        brisk: 'var(--ease-brisk)',
      },
    },
  },
  plugins: [],
} satisfies Config;
