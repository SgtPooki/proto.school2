import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader';
// import { ssr } from 'vite-plugin-ssr/plugin'
// const monacoPrefix = `monaco-editor/esm/vs`
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
console.log(`monacoEditorPlugin: `, monacoEditorPlugin);
console.log(`monacoEditorPlugin.default: `, monacoEditorPlugin.default);


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
    // monacoEditorPlugin.default({languageWorkers: ['json', 'css', 'html', 'typescript']}),
  ],
  // optimizeDeps: {
  //   include: [
  //     `${monacoPrefix}/language/json/json.worker.js`,
  //     `${monacoPrefix}/language/css/css.worker.js`,
  //     `${monacoPrefix}/language/html/html.worker.js`,
  //     `${monacoPrefix}/language/typescript/ts.worker.js`,
  //     `${monacoPrefix}/editor/editor.worker.js`,
  //     `${monacoPrefix}/editor/editor.api.js`,
  //   ]
  // },
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
      // 'monaco-editor/esm/vs/editor/editor.api': `${monacoPrefix}/editor/editor.worker.js`,

      'v-tooltip': 'v-tooltip/dist/v-tooltip.esm.js',
      'vue-select/es': 'node_modules/vue-select/dist/vue-select.es.js',
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }

  },
  ssgOptions: {
    script: 'async',
    formatting: 'prettify',
  },
})
