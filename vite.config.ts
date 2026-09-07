import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// User-site GitHub Pages (sd2001.github.io) serves from the domain root, so base is '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
