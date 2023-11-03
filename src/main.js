// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'
import { createApp } from 'vue'
// import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import VueMeta from 'vue-meta'
import VueTooltip from 'v-tooltip'
import PortalVue from 'portal-vue'
import hljsVuePlugin from "@highlightjs/vue-plugin";
import VueSelect from 'vue-select'

import 'vue-select/dist/vue-select.css'
import 'highlight.js/styles/github.css'

import App from './App.vue'
import {router} from './router'
import stateInit from './state/init'

const app = createApp(App)
app
  .use(router)
  // .use(VueMeta, { keyName: 'head', refreshOnceOnNavigation: true })
  .use(hljsVuePlugin)
  .use(VueTooltip)
  .use(PortalVue)

app.component('v-select', VueSelect)

app.config.productionTip = false
app.config.errorHandler = (error, vm, info) => {
  console.error(error)
  console.info(vm)
  console.info(info)
}

// const root = new Vue({
//   router,
//   mounted: function () {
//     // support redirects from old hash routes
//     if (window.location.hash.startsWith('#/')) {
//       this.$router.replace({ path: window.location.hash.replace('#', '') })
//     }
//   },
//   render: h => h(App),
//   data: function() {
// return {
//     state: stateInit()
//   };
// }
// })

app.mount('#app')

