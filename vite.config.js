import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'fe3a56670e3c.ngrok-free.app' // your ngrok URL
    ]
  }
})
