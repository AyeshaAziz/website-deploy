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
} from '@itqa/core/design';

/**
 * Package-local Tailwind config so the UI can be built and previewed
 * (Storybook) without the Next.js app. Values come from the shared tokens.
 */
const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../core/src/**/*.{ts,tsx}',
    '../website/src/**/*.{ts,tsx}',
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
