import nextConfig from 'eslint-config-next';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    rules: {
      // The birthday template uses <img> for Supabase/Unsplash URLs. Next/Image
      // requires known hostnames at build time, which conflicts with user uploads.
      '@next/next/no-img-element': 'warn',
      // App Router loads fonts in the root layout <head>, not pages/_document.
      // This is the correct approach for Next.js 13+ App Router.
      '@next/next/no-page-custom-font': 'off',
    },
  },
];

export default config;
