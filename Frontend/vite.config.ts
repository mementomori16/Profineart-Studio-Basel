import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 1. Keeps small assets out of the HTML for cleaner crawling
    assetsInlineLimit: 4096, 
    rollupOptions: {
      output: {
        // 2. Splitting these heavy libraries improves your "Time to Interactive" score
        manualChunks: {
          vendor: ['react', 'react-dom', 'firebase/app', 'firebase/firestore'],
        },
      },
    },
  },
})

