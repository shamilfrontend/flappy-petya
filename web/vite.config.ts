import { defineConfig } from 'vite';
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
});
