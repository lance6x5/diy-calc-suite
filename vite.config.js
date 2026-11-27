import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

// `base` must match the GitHub repo name so assets resolve on GitHub Pages.
export default defineConfig({
  base: '/diy-calc-suite/',
  // Expose the semantic version to the UI (shown in the footer).
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.svg', 'logo-mark.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Measure Twice: DIY Project Calculators',
        short_name: 'Measure Twice',
        description: 'Measure Twice. Cut once, buy right: home-improvement material estimators that work offline.',
        start_url: '/diy-calc-suite/',
        scope: '/diy-calc-suite/',
        display: 'standalone',
        background_color: '#0f1724',
        theme_color: '#1b4f8a',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'logo-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        navigateFallback: 'index.html'
      }
    })
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.js']
  }
});
