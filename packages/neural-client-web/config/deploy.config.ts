import { defineConfig } from 'vite';
import path from 'path';
import config from './share.config';

export function getDeployConfig() {
  return defineConfig({
    ...config,
    define: {
      'process.env.PUBLIC_PATH': JSON.stringify(process.env.PUBLIC_PATH),
      'process.env.ENV': JSON.stringify(process.env.ENV),
      'process.env.npm_lifecycle_event': JSON.stringify(process.env?.npm_lifecycle_event),
    },
    base: `${process.env.PUBLIC_PATH || ''}`,
    build: {
      outDir: path.resolve(__dirname, '../dist'),
      rollupOptions: {
        treeshake: true,
        output: {
          // 用于指定哪些模块应该被打包到独立的代码块中而不是默认的代码块中,这对于优化代码加载性能非常有用，因为它允许您将页面上不同部分的代码分开加载，以实现更快的页面加载速度和更好的用户体验
          manualChunks: {
            common: ['@vueuse/core'],
          },
          entryFileNames: 'main.[hash].js',
          assetFileNames: '[name].[hash].[ext]',
          chunkFileNames: 'chunk.[name].[hash].js',
        },
        // remove the __webpack_exports__ object and the module signature
        preserveEntrySignatures: 'exports-only',
      },
    },
  });
}
