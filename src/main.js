// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'

import VueMeta from 'vue-meta'
// import VueTooltip from 'v-tooltip'
import {default as VueTooltip, VTooltip} from 'floating-vue'
console.log(`VTooltip: `, VTooltip);

console.log(`VueTooltip: `, VueTooltip);
console.log(`VueTooltip.default: `, VueTooltip.default);
console.log(`VueTooltip.VTooltip: `, VueTooltip.VTooltip);
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

// hack to get around build failure that 'localStorage' is not defined.. it's used everywhere without guards for SSG.
if (typeof localStorage === 'undefined') {
  globalThis.window = globalThis.window ?? {
    location: {pathname: ''},
    history: {state: {}},
    addEventListener: () => {},
  }
  globalThis.document = globalThis.document ?? {
    referrer: '',
    window: globalThis.window,
  }
  globalThis.localStorage = globalThis.localStorage ?? {}
}
export const createApp = ViteSSG(
  App,
  { routes: allRoutes, base: '/' },
  async ({app, initialState, router, isClient}) => {
  //   // eslint-disable-next-line no-debugger
  //   debugger;
  //   console.log(`isClient: `, isClient);
  //   console.log('import.meta.env.SSR', import.meta.env.SSR)

  //   if (import.meta.env.SSR && !isClient) {
  //     await router.isReady()
  //   }
  //   if (import.meta.env.SSR) {


  //     // Set initial state during server side
  //     // initialState = {...stateInit()}
  //     initialState.data = await stateInit()
  //     // await loadTutorials()
  //     // const tutorialRedirects = await ssgOnly.redirects()
  //     // console.log(`tutorialRedirects: `, tutorialRedirects);
  //     // await router.addRoutes(tutorialRedirects)
  //     // router.replace(router.currentRoute.value.fullPath)

  //   } else {

  //     // initialState = {...stateInit()}
  //     // Restore or read the initial state on the client side in the browser
  //     console.log(initialState.data) // => { cats: 2, dogs: 3 }
  //     console.log(`initialState: `, initialState);
  //   }
    app.directive('tooltip', VueTooltip)

    app
  //     // .use(router)
  //     // .use(VueMeta, { keyName: 'head', refreshOnceOnNavigation: true })
  //     // .use(hljsVuePlugin)
      // .use(VueTooltip)
      .use(PortalVue)


    app.component('v-select', VueSelect)

  //   app.config.productionTip = false
  //   app.config.errorHandler = (error, vm, info) => {
  //     console.error(error)
  //     console.info(vm)
  //     console.info(info)
  //   }

  //   // app.mount('#app')
  },
  // { rootContainer: '#app'}
  // async ({router}) => {
  //   await router.isReady()
  // }
)

