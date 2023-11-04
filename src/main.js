// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'
// import { createApp } from 'vue'
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
import { ViteSSG } from 'vite-ssg/single-page'
import routes from './routes'

// import * as ssgOnly from './ssg-only/index.js'


async function loadTutorials() {
  const fs = await import('fs/promises')
  console.log('fs:', fs);
}

// const app = createApp(App)
// app
//   .use(router)
//   // .use(VueMeta, { keyName: 'head', refreshOnceOnNavigation: true })
//   .use(hljsVuePlugin)
//   .use(VueTooltip)
//   .use(PortalVue)

// app.component('v-select', VueSelect)

// app.config.productionTip = false
// app.config.errorHandler = (error, vm, info) => {
//   console.error(error)
//   console.info(vm)
//   console.info(info)
// }

// // const root = new Vue({
// //   router,
// //   mounted: function () {
// //     // support redirects from old hash routes
// //     if (window.location.hash.startsWith('#/')) {
// //       this.$router.replace({ path: window.location.hash.replace('#', '') })
// //     }
// //   },
// //   render: h => h(App),
// //   data: function() {
// // return {
// //     state: stateInit()
// //   };
// // }
// // })

// app.mount('#app')
console.log(`router: `, router);
console.log(`router.getRoutes(): `, router.getRoutes());
export const createApp = ViteSSG(
  App,
  // { routes: routes.all() },
  async ({app, initialState}) => {
    // console.log(`routes: `, routes);

    if (import.meta.env.SSR) {
      // Set initial state during server side
      // initialState = {...stateInit()}
      initialState.data = await stateInit()
      // await loadTutorials()
      // const tutorialRedirects = await ssgOnly.redirects()
      // console.log(`tutorialRedirects: `, tutorialRedirects);
      // await router.addRoutes(tutorialRedirects)
      await router.addRoutes(await routes.redirects())

    } else {

      // initialState = {...stateInit()}
      // Restore or read the initial state on the client side in the browser
      console.log(initialState.data) // => { cats: 2, dogs: 3 }
    }
    console.log(`initialState: `, initialState);
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

    // app.mount('#app')
  }
)

