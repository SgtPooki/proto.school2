// import VueRouter from 'vue-router'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import { migrateCache } from './utils/paths.js'
import routes from './routes.js'
import { defineAsyncComponent } from 'vue'

// const routes = require('./routes')

// Migrate cache using configured redirects
migrateCache()

// const redirectRoutes = await routes.redirects()

export const router = new createRouter({
  routes: [
    ...routes.statics(),
    ...routes.errors(),
    // ...redirectRoutes,
    // Dynamic routes
    {
      path: '/course/:courseUrl',
      component: () => defineAsyncComponent(() => import('./pages/Course.vue')),
      props: true
    },
    {
      path: '/:tutorialUrl',
      component: () => defineAsyncComponent(() => import('./pages/Landing.vue')),
      props: true
    },
    {
      path: '/:tutorialUrl/resources',
      component: () => defineAsyncComponent(() => import('./pages/ResourcesLesson.vue')),
      props: true,
      name: 'Resources'
    },
    {
      path: '/:tutorialUrl/:lessonId',
      component: () => defineAsyncComponent(() => import('./pages/Lesson.vue')),
      props: true
    },
    // 404
    // {
    //   path: '*',
    //   redirect: '404'
    // }
  ],
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

// track page view via Countly when route changes
router.afterEach((to) => {
  if (!window.Countly) return
  window.Countly.q.push(['track_pageview', to.path])
})

// To be used in the onError handler
let nextRoute = null

router.beforeEach((to, from, next) => {
  nextRoute = { ...to }

  // Remove trailing slash on client side only
  if (to.path !== '/' && to.path.endsWith('/')) {
    next({ path: to.path.substring(0, to.path.length - 1), replace: true, query: to.query, hash: to.hash })
  } else {
    next()
  }
})

router.onError(error => {
  // https://github.com/ProtoSchool/protoschool.github.io/issues/555
  // When a user comes back to a tab with ProtoSchool open after a deployment,
  // they might get this ChunkLoadError error
  // because the chunk's name does not exist anymore (because of cache busting hashes in the filenames).
  // When it happens, we can force the page to reload and the new files will
  // fetched instead.
  if (error.name === 'ChunkLoadError') {
    console.warn('Failed to load chunk due to new version of the website published - will reload page')

    if (!import.meta.env.SSR) {
      window.location.pathname = nextRoute ? nextRoute.path : window.location.pathname
    }
  }
})

export default router
