import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

const isNativeBuild = process.env.VITE_BUILD_TARGET === 'android'
  || process.env.VITE_BUILD_TARGET === 'ios';
const base = isNativeBuild ? './' : '/flappy-petya/';

export default defineConfig({
  base,
  publicDir: 'public',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'favicon-192x192.png',
        'favicon-512x512.png',
        'apple-touch-icon.png',
        'site.webmanifest',
      ],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,webp,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(firestore|identitytoolkit|securetoken)\.googleapis\.com\//,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/.*\.firebaseapp\.com\//,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts', 'src/vite-env.d.ts', 'src/**/*.test.ts'],
      thresholds: {
        lines: 90,
        branches: 82,
        functions: 90,
        statements: 90,
      },
    },
  },
});
