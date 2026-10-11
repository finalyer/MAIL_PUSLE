import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        cookieDomainRewrite: '',
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Rewrite Set-Cookie so the browser stores it under localhost:5173
            const cookies = proxyRes.headers['set-cookie']
            if (cookies) {
              proxyRes.headers['set-cookie'] = cookies.map(c =>
                c.replace(/; ?SameSite=None/i, '; SameSite=Lax')
                 .replace(/; ?Secure/i, '')
              )
            }
          })
        },
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})

