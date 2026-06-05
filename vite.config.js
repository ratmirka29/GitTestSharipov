import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/GitTestSharipov/',
  server: {
    host: true,      // слушать и на 127.0.0.1 (IPv4), и на [::1] (IPv6)
    port: 5173,
    strictPort: false,
    open: true,      // автоматически открыть браузер на правильном адресе/порте
  },
})
