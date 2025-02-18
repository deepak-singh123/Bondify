import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/auth': {
        target: 'https://bondify-1lzw.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: 'https://bondify-1lzw.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  plugins: [react()],
});