import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      typography: {
        DEFAULT: {
          css: {
            fontSize: '0.9375rem',
            lineHeight: '1.75',
            maxWidth: 'none',
            p: {
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
            'h2, h3, h4': {
              fontWeight: 600,
              letterSpacing: '-0.02em',
            },
            h2: {
              fontSize: '1.25rem',
              marginTop: '1.75em',
              marginBottom: '0.5em',
            },
            h3: {
              fontSize: '1.125rem',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            a: {
              color: '#2563eb',
              fontWeight: 500,
              textDecoration: 'underline',
              textDecorationThickness: '1px',
              textUnderlineOffset: '3px',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            code: {
              fontSize: '0.8125rem',
              fontWeight: 400,
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              fontSize: '0.8125rem',
              borderRadius: '0.5rem',
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
          },
        },
        invert: {
          css: {
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
