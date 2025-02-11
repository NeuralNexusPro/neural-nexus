import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postCssPrefixSelector from 'postcss-prefix-selector';
import { viteExternalsPlugin } from "vite-plugin-externals";
import dts from 'vite-plugin-dts';
import path from 'path'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: 'example',
  build: {
    outDir: '../dist',
    lib: {
      entry: resolve(__dirname, "./src/index.tsx"),
      name: "chatui-sdk",
      fileName: (format) => `index.${format}.js`,
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    react(),
    viteExternalsPlugin({
      react: 'React',
      'react-dom': 'ReactDOM',
    }),
    dts()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  css: {
    postcss: {
      plugins: [
        postCssPrefixSelector({
          prefix: '.chatui',
          transform: function (prefix: string, selector: string) {
            if (selector.match(/\.ant/)) return selector.replace(/\.ant/g, prefix);
            return selector;
          },
        }),
      ]
    }
  },
  server: {
    host: '0.0.0.0'
  }
})
