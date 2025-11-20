import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/daegu': {
        target: 'https://www.daegufood.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/daegu/, '/kor/api/tasty.html'),
      }
    }
  }
})
