import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    port: 5173,
    proxy: {
      '/aforo': 'http://localhost:8085',
      '/eventos': 'http://localhost:8085',
      '/reportes': 'http://localhost:8085',
      '/usuarios': 'http://localhost:8085',
      '/ws-aforo': {
        target: 'ws://localhost:8085',
        ws: true,
      },
    },
  },
})
