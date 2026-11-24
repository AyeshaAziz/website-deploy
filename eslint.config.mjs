import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
    ...nextVitals,
    {
        rules: {
            // Pages Router only; this monorepo is App Router (`apps/main/app`).
            '@next/next/no-html-link-for-pages': 'off',
        },
    },
    {
        // `@next/next` rules target Next.js app code. `packages/*` are shared React
        // libraries with their own Vite Storybook, so `next/image` is not available
        // and native <img> is intentional.
        files: ['packages/**/*.{js,jsx,ts,tsx}'],
        rules: {
            '@next/next/no-img-element': 'off',
        },
    },
    globalIgnores([
        '**/.next/**',
        '**/dist/**',
        '**/storybook-static/**',
        '**/next-env.d.ts',
    ]),
]);
