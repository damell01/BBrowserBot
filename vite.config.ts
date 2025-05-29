import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        cookieDomainRewrite: {
          '*': ''
        },
        cookiePathRewrite: {
          '*': '/'
        },
        onProxyRes: (proxyRes) => {
          const cookies = proxyRes.headers['set-cookie'];
          if (cookies) {
            proxyRes.headers['set-cookie'] = cookies.map(cookie =>
              cookie
                .replace(/SameSite=Lax/i, 'SameSite=None')
                .replace(/Secure;?/i, '')
                .replace(/session=/i, 'PHPSESSID=')
            );
          }
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});