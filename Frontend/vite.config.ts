import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🔥 ADDED: Proxy configuration to route API calls
  server: {
    proxy: {
      // Any request starting with /api is redirected to the backend server
      '/api': {
        target: 'http://localhost:3001', // The address where your Express/Node backend is running
        changeOrigin: true, // Needed for proper host header forwarding
        // Note: The path is already correct for your backend structure, so no rewrite is necessary.
      },
    },
  },
});

