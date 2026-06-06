import { defineConfig } from 'vitest/config';

const isAndroidBuild = process.env.VITE_BUILD_TARGET === 'android';

export default defineConfig({
  base: isAndroidBuild ? './' : '/flappy-petya/',
  publicDir: 'public',
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts', 'src/vite-env.d.ts', 'src/**/*.test.ts'],
    },
  },
});
