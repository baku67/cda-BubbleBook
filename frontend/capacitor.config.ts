import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fun.bubblebook.app',
  appName: 'Bubblebook',
  // webDir: 'dist/angular/browser', // local
  webDir: 'www', // docker
  server: {
    url: 'http://localhost:4200', // front
    cleartext: true // Autorise les requêtes HTTP en clair
  }
};

export default config;
