import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
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
  }
})
