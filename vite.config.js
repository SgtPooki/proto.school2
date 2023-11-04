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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
