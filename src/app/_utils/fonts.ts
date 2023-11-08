import { Roboto_Mono, Montserrat } from 'next/font/google';

const fontPrimary = Roboto_Mono({
  weight: ['100', '300', '500', '700'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-primary',
});

const fontSecondary = Montserrat({
  weight: ['100', '300', '500', '700', '900'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-secondary',
});

export { fontPrimary, fontSecondary };
