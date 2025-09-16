import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material'],
    force: true, // Force re-optimization
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      port: 5173,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    dedupe: ['react', 'react-dom'], // Deduplicate React
  },
});
