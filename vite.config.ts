import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

// The site is published as a GitHub Pages project site, so every asset and
// internal link must resolve beneath /tai-public-finance-home/. Production
// builds and `vite preview` use that base; the dev server runs at the root.
export default defineConfig(({ command, isPreview, isSsrBuild }) => ({
  base: command === 'build' || isPreview ? '/tai-public-finance-home/' : '/',
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: isSsrBuild
    ? {}
    : {
        rolldownOptions: {
          input: {
            home: `${root}index.html`,
            explore: `${root}explore/index.html`,
            research: `${root}research/index.html`,
            dashboard: `${root}dashboard/index.html`,
            notFound: `${root}404.html`,
          },
        },
      },
}));
