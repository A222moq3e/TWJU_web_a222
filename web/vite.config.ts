import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// install before use:
// npm i -D vite-plugin-javascript-obfuscator javascript-obfuscator terser

// import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    plugins: [
      react(),
      // ...(isBuild ? [
      //   obfuscatorPlugin({
      //     // prefer to exclude vendor and node_modules; plugin may accept regex or globs
      //     // if the plugin doesn't support 'exclude' you can remove this and rely on manualChunks
      //     exclude: ['**/vendor.*.js', /node_modules/],
      //     // options forwarded to javascript-obfuscator
      //     options: {
      //       compact: true,
      //       controlFlowFlattening: true,
      //       controlFlowFlatteningThreshold: 0.75,
      //       deadCodeInjection: false,
      //       debugProtection: false,
      //       identifierNamesGenerator: 'hexadecimal',
      //       stringArray: true,
      //       stringArrayEncoding: ['base64'],
      //       // DO NOT enable sourceMap
      //     }
      //   })
      // ] : [])
    ],
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
    build: isBuild ? {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      cssCodeSplit: false,
      // lowered inline limit to avoid massive bundles; tweak as needed
      assetsInlineLimit: 100_000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) return 'vendor'
            return 'app'
          },
          // optional: control entryFileNames/chunkFileNames if you want predictable names:
          // entryFileNames: 'assets/[name]-[hash].js',
          // chunkFileNames: 'assets/[name]-[hash].js',
        }
      },
      terserOptions: {
        compress: {
          drop_console: false,  // Temporarily keep console.log for debugging
          drop_debugger: true
        },
        format: {
          comments: false
        }
      }
    } : undefined
  }
})
