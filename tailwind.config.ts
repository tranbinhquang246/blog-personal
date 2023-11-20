import type { Config } from 'tailwindcss';

const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      ...colors,
      yellow: '#FFD050',
      purple: '#592EA9',
      dark: '#232536',
      darkgrey: '#4C4C4C',
      mediumgray: '#6D6E76',
      lightgrey: '#F4F4F4',
      lavender: '#F4F0F8',
    },
    screens: {
      xs: '480px',
      ...defaultTheme.screens,
    },
    fontFamily: {
      // Roboto mono
      primary: ['var(--font-primary)', 'sans-serif'],

      // Montserrat
      secondary: ['var(--font-secondary)', 'sans-serif'],
    },
    extend: {
      backgroundImage: {},
    },
  },
  plugins: [],
};
export default config;
