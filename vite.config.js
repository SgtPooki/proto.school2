import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader';
import { ssr } from 'vite-plugin-ssr/plugin'


// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: [
    /\.md$/,
    /\.svg$/,
  ],
  plugins: [
    vue(),
    // ssr({ prerender: true }),
    svgLoader(),
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [
        'fs',
        'human-signals',
        'execa',
        'default-gateway',
        'freeport-promise',
        '@achingbrain/ssdp',
        '@achingbrain/nat-port-mapper'
      ]
    }
  },
  define: {
    // 'window': 'globalThis',
  },
  resolve: {
    alias: {
      'vue-select/es': 'node_modules/vue-select/dist/vue-select.es.js',
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }

  },
  server: {
    fs: {
      deny: [
        './src/ssg-only',
        'fs'
      ]
    }
  }
})
