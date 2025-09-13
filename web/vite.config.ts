// web/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 10002,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:10003',
          changeOrigin: true,
        }
      }
    },
    // Only apply these on build
    build: isBuild
      ? {
          sourcemap: false,
          minify: 'esbuild',
          cssCodeSplit: false,          // put all CSS into single file
          assetsInlineLimit: 10_000_000, // inline assets <= 10MB as base64 (tweak as needed)
          rollupOptions: {
            output: {
              // force a single JS chunk (prevents chunking into many files)
              manualChunks: () => 'everything.js'
            }
          },
          // Optional: tweak output dir if you want
          outDir: path.resolve(__dirname, 'dist')
        }
      : undefined
  }
})
