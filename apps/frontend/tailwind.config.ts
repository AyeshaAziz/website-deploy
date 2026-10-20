import type { Config } from 'tailwindcss';
import {
  borderRadius,
  boxShadow,
  colors,
  fontFamily,
  fontSize,
  maxWidth,
  screens,
  spacing,
} from '@itqa/shared/design';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/website/src/**/*.{ts,tsx}',
    '../../packages/shared/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily,
      fontSize,
      spacing,
      maxWidth,
      borderRadius,
      boxShadow,
      screens,
    },
  },
  plugins: [],
};

export default config;
