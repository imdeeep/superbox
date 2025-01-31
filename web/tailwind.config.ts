import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: '#131212',
        secondary: '#27272A',
        tertiary: '#55555A',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(0 0% 90%)', // Light gray text
            '--tw-prose-headings': 'hsl(0 0% 98%)', // Nearly white headings
            '--tw-prose-links': 'hsl(210 80% 60%)', // Blue links
            '--tw-prose-pre-code': 'hsl(0 0% 95%)', // Light code text
            '--tw-prose-pre-bg': 'hsl(240 4% 16%)', // Dark code background
            '--tw-prose-bold': 'hsl(0 0% 98%)', // White bold text
            '--tw-prose-counters': 'hsl(0 0% 70%)', // Gray counters
            '--tw-prose-bullets': 'hsl(0 0% 70%)', // Gray bullets
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
