import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nextEnv from '@next/env';

// Load the monorepo-root .env so one file configures every package.
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
nextEnv.loadEnvConfig(root);

// TODO: add a Content-Security-Policy (needs nonces with Next.js) during the hardening step.
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

transpilePackages: [
    '@itqa/website',
    '@itqa/ui',
    '@itqasys/core',
  ],

  serverExternalPackages: ['bcryptjs'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;