import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flappypetya.app',
  appName: 'Flappy Petya',
  webDir: 'dist',
  android: {
    path: '../android',
  },
  ios: {
    path: '../ios',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
