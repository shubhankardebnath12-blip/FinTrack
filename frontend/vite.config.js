import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Dev server — proxies /api to the local backend
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },

  // Production build optimisations
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Vite 8 (rolldown) uses oxc by default — do NOT set minify: 'esbuild'
    target: 'es2020',
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Vite 8 / rolldown requires manualChunks as a function
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3') || id.includes('victory')) return 'vendor-charts';
            if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('axios')) return 'vendor-utils';
            if (id.includes('date-fns')) return 'vendor-utils';
            if (id.includes('react-hot-toast')) return 'vendor-toast';
            return 'vendor-misc';
          }
        },
      },
    },
  },
});
