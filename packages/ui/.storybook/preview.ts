import type { Preview } from '@storybook/react-vite';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Tokens are still provisional; surface violations without failing the preview.
      test: 'todo',
    },
  },
};

export default preview;
