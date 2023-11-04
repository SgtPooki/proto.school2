// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'

import VueMeta from 'vue-meta'
import VueTooltip from 'v-tooltip'
import PortalVue from 'portal-vue'
// import * as hljsVuePluginMod from "@highlightjs/vue-plugin";
import VueSelect from 'vue-select/es'
// const hljsVuePlugin = hljsVuePluginMod.default;
// console.log(`hljsVuePlugin: `, hljsVuePlugin);

import 'vue-select/dist/vue-select.css'
import 'highlight.js/styles/github.css'

import App from './App.vue'
// import {router} from './router'
import stateInit from './state/init'
import { ViteSSG } from 'vite-ssg'
import routes from './routes'


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
// console.log(`router: `, router);
// console.log(`router.getRoutes(): `, router.getRoutes());
/**
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const allRoutes = await routes.all()
// console.log(`allRoutes: `, allRoutes);

// console.log(tutorialFolders)
export const createApp = ViteSSG(
  App,
  { routes: allRoutes },
  async ({app, initialState, router}) => {
    // console.log(`isClient: `, isClient);
    // console.log('import.meta.env.SSR', import.meta.env.SSR)

    // const fs = await import('node:fs')
    // // import fs from 'node:fs'
    // const path = (await import('node:path')).default
    // // import path from 'node:path'

    // // get all directory names in the tutorials folder
    // const tutorialsPath = path.resolve('src', 'tutorials')
    // const tutorialFolders = fs.readdirSync(tutorialsPath, { withFileTypes: true })
    //   .filter(dirent => dirent.isDirectory())
    //   .map(dirent => dirent.name)
    // console.log(`tutorialFolders: `, tutorialFolders);
    // const routerMod = await import('./router.js')
    // const router = routerMod.router
    // console.log(`routes: `, routes);
      // console.log('router.getRoutes():', router.getRoutes())
      // await router.addRoutes?.(allRoutes)
      // router.addRoute(allRoutes)

      // router.replace(router.currentRoute.value.fullPath)
      // console.log('router.getRoutes():', router.getRoutes())
    if (import.meta.env.SSR) {
      await router.isReady()
      // Set initial state during server side
      // initialState = {...stateInit()}
      initialState.data = await stateInit()
      // await loadTutorials()
      // const tutorialRedirects = await ssgOnly.redirects()
      // console.log(`tutorialRedirects: `, tutorialRedirects);
      // await router.addRoutes(tutorialRedirects)
      // router.replace(router.currentRoute.value.fullPath)

    } else {

      // initialState = {...stateInit()}
      // Restore or read the initial state on the client side in the browser
      console.log(initialState.data) // => { cats: 2, dogs: 3 }
      console.log(`initialState: `, initialState);
    }

    app
      // .use(router)
      // .use(VueMeta, { keyName: 'head', refreshOnceOnNavigation: true })
      // .use(hljsVuePlugin)
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
  },
  { rootContainer: '#app'}
  // async ({router}) => {
  //   await router.isReady()
  // }
)

