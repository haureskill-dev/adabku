// Batasi thread Rust/Rayon untuk mencegah kehabisan alokasi memori pada sistem RAM terbatas
process.env.RAYON_NUM_THREADS = process.env.RAYON_NUM_THREADS || '1'

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-vendor'
          }
          if (id.includes('node_modules/@react-three')) {
            return 'r3f-vendor'
          }
          if (id.includes('node_modules/peerjs')) {
            return 'peerjs-vendor'
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
        },
      },
    },
  },
})
