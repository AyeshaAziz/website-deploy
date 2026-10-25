import type { Config } from 'tailwindcss';
import {
  borderRadius,
  boxShadow,
  colors,
  fontFamily,
  fontSize,
  gradients,
  maxWidth,
  screens,
  spacing,
} from '@itqasys/core/design';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/website/src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/core/src/**/*.{ts,tsx}',
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
      backgroundImage: gradients,
      screens,
    },
  },
  plugins: [],
};

export default config;
