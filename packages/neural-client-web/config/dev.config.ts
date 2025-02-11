import { defineConfig } from 'vite';
import config from './share.config';

export function getViteDevConfig() {
  return defineConfig({
    ...config,
    server: {
      strictPort: false,
      open: true,
      host: '0.0.0.0',
      proxy: {
        '/api/': {
          target: 'http://localhost:8084/',
          ws: true,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, 'http://localhost:8084/'),
        },
      },
    },
  });
}
