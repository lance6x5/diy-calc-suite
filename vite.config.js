import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// `base` must match the GitHub repo name so assets resolve on GitHub Pages.
export default defineConfig({
  base: '/diy-calc-suite/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-maskable.svg'],
      manifest: {
        name: 'DIY Project Calculator Suite',
        short_name: 'DIY Calc',
        description: 'Home-improvement material estimators that work offline.',
        start_url: '/diy-calc-suite/',
        scope: '/diy-calc-suite/',
        display: 'standalone',
        background_color: '#1f2933',
        theme_color: '#d9480f',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}'],
        navigateFallback: 'index.html'
      }
    })
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.js']
  }
});
