import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()

// Access the environment variable directly after loading dotenv
const API_BASE_URL = process.env.VITE_BACKEND_URL

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/auth': {
        target: API_BASE_URL,  // Use the environment variable
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: API_BASE_URL,  // Same for the '/user' proxy
        changeOrigin: true,
        secure: false,
      }
    },
  },
  plugins: [react()],
});
