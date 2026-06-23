import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

const isNativeBuild = process.env.VITE_BUILD_TARGET === 'android'
  || process.env.VITE_BUILD_TARGET === 'ios';
const base = isNativeBuild ? './' : '/flappy-petya/';

export default defineConfig({
  base,
  publicDir: 'public',
  test: {
    environment: 'node',
  },
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      minify: false,
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
      injectManifest: {
        // Снижаем риск падения terser-хука при сборке SW.
        minify: false,
      },
    }),
  ],
});
