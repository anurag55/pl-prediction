import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/pl-api': {
        target: 'https://footballapi.pulselive.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pl-api/, '/football'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://www.premierleague.com')
            proxyReq.setHeader('Referer', 'https://www.premierleague.com/')
            proxyReq.setHeader('account', 'premierleague')
            proxyReq.setHeader('Accept', 'application/json')
          })
        },
      },
      '/api/pl-badges': {
        target: 'https://resources.premierleague.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pl-badges/, '/premierleague/badges'),
      },
    },
  },
})
