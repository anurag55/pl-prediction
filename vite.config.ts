import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/pl-api': {
        target: 'https://footballapi.pulselive.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pl-api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://www.premierleague.com')
            proxyReq.setHeader('Referer', 'https://www.premierleague.com/')
            proxyReq.setHeader('account', 'premierleague')
            proxyReq.setHeader('Accept', 'application/json')
          })
        },
      },
      '/pl-badges': {
        target: 'https://resources.premierleague.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pl-badges/, '/premierleague/badges'),
      },
    },
  },
})
