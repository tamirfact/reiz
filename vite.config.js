import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: '/reiz/', // This should match your repository name
  build: {
    outDir: 'dist', // Changed from 'public' to 'dist' for GitHub Pages
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true
  }
}) 