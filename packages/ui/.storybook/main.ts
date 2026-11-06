import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    'src/**/*.stories.@(ts|tsx)',
    '../../website/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  /**
   * The monorepo tsconfig sets `"jsx": "preserve"` for Next.js. Vite/esbuild would
   * then emit the classic runtime (`React.createElement`) and fail with
   * "React is not defined". Force the automatic JSX runtime for the preview build.
   */
  viteFinal: async (viteConfig) => {
    viteConfig.esbuild = {
      ...viteConfig.esbuild,
      jsx: 'automatic',
      jsxImportSource: 'react',
    };
    viteConfig.optimizeDeps = {
      ...viteConfig.optimizeDeps,
      esbuildOptions: {
        ...viteConfig.optimizeDeps?.esbuildOptions,
        jsx: 'automatic',
        jsxImportSource: 'react',
      },
    };
    return viteConfig;
  },
};

export default config;
