import type { Config } from 'tailwindcss';

const colors = require('tailwindcss/colors');

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
      // Define more color
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
