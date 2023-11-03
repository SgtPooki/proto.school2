import moment from 'moment'
import { defineAsyncComponent } from 'vue'
// import api from './api/index.js'
import HomePage from './pages/Home.vue'
const lastmod = moment().format('YYYY-MM-DD')

function addSitemapLoc (route) {
  if (route.sitemap) {
    route.sitemap.loc = route.path
  }

  return route
}

// Route types - used to choose which routes are prerendered or added to the sitemap
const TYPES = {
  STATIC: 'static',
  TUTORIAL: 'tutorial',
  LESSON: 'lesson',
  RESOURCES: 'resources',
  COURSE: 'course',
  ERROR: 'error',
  REDIRECT: 'redirect'
}

// Static routes
function statics () {
  return [
    {
      path: '/',
      component: HomePage,
      name: 'Home',
      displayName: 'Home',
      sitemap: { priority: 1, changefreq: 'weekly', lastmod }
    },
    // {
    //   path: '/tutorials/',
    //   component: () => defineAsyncComponent(() => import('./pages/Tutorials.vue')),
    //   name: 'Tutorials',
    //   props: (route) => ({ code: route.query.code, course: route.query.course }),
    //   sitemap: { priority: 0.9, changefreq: 'weekly', lastmod }
    // },
    // {
    //   path: '/events/',
    //   component: () => defineAsyncComponent(() => import('./pages/Events.vue')),
    //   name: 'Events',
    //   sitemap: { priority: 0.8, changefreq: 'weekly', lastmod }
    // },
    // {
    //   path: '/news/',
    //   component: () => defineAsyncComponent(() => import('./pages/News.vue')),
    //   name: 'News',
    //   sitemap: { priority: 0.7, changefreq: 'monthly', lastmod }
    // },
    // {
    //   path: '/host/',
    //   component: () => defineAsyncComponent(() => import('./pages/Host.vue')),
    //   name: 'Host',
    //   sitemap: { priority: 0.6, changefreq: 'monthly', lastmod }
    // },
    // {
    //   path: '/build/',
    //   component: () => defineAsyncComponent(() => import('./pages/Build.vue')),
    //   name: 'Build',
    //   sitemap: { priority: 0.6, changefreq: 'monthly', lastmod }
    // },
    // {
    //   path: '/contribute/',
    //   component: () => defineAsyncComponent(() => import('./pages/Contribute.vue')),
    //   name: 'Contribute',
    //   sitemap: { priority: 0.6, changefreq: 'monthly', lastmod }
    // }
  ].map(route => ({ ...route, type: TYPES.STATIC })).map(addSitemapLoc)
}

// Redirect routes
// Redirects that need to return a 301 status code need to be configured in the server as well
function redirects () {
  // TODO Use API to get the tutorials (needs API to be universal)
  // https://github.com/ProtoSchool/protoschool.github.io/issues/589

  // const tutorialRedirects = Object.values(api.tutorials.list()).reduce((redirects, tutorial) => {
  //   if (tutorial.redirectUrls && tutorial.redirectUrls.length) {
  //     tutorial.redirectUrls.forEach(url => {
  //       redirects.push({ path: `/${url}/`, redirect: `/${tutorial.url}` })
  //       redirects.push({ path: `/${url}/resources/`, redirect: `/${tutorial.url}/resources/` })

  //       tutorial.lessons.forEach(lesson => {
  //         redirects.push({ path: `/${url}/${lesson.formattedId}/`, redirect: `/${lesson.url}/` })
  //       })
  //     })
  //   }

  //   return redirects
  // }, [])

  return [
    // ...tutorialRedirects,
    { path: '/chapters/', redirect: '/events/' },
    { path: '/data-structures/', redirect: '/content-addressing/' },
    { path: '/data-structures/resources/', redirect: '/content-addressing/resources/' },
    { path: '/data-structures/01/', redirect: '/content-addressing/01/' },
    { path: '/data-structures/02/', redirect: '/content-addressing/02/' },
    { path: '/data-structures/03/', redirect: '/content-addressing/03/' },
    { path: '/data-structures/04/', redirect: '/content-addressing/04/' },
    { path: '/data-structures/05/', redirect: '/content-addressing/05/' }
  ].map(route => ({ ...route, type: TYPES.REDIRECT }))
}

// Error routes
function errors () {
  return [
    {
      path: '/404/',
      name: '404',
      component: () => defineAsyncComponent(() => import('./pages/NotFound.vue'))
    }
  ].map(route => ({ ...route, type: TYPES.ERROR })).map(addSitemapLoc)
}

/* Tutorials routes. These are used to prerender and to be added to the sitemap
  e.g.
  /data-structures
  /data-structures/01
  /data-structures/resources

  `redirectUrls` property will also be read to generate equivalent redirect routes
*/
function tutorials () {
  return []
  // return Object.values(api.tutorials.list.get()).reduce((routes, tutorial) => {
  //   routes.push({
  //     type: TYPES.TUTORIAL,
  //     path: `/${tutorial.url}/`,
  //     sitemap: { priority: 1, changefreq: 'monthly', lastmod }
  //   })
  //   routes.push({
  //     type: TYPES.RESOURCES,
  //     path: `/${tutorial.url}/resources/`
  //   })

  //   return routes.concat(tutorial.lessons.map(lesson => ({
  //     type: TYPES.LESSON,
  //     path: `/${lesson.url}/`,
  //     sitemap: { priority: 1, changefreq: 'monthly', lastmod }
  //   })))
  // }, []).map(addSitemapLoc)
}

/* Course routes. These are used to prerender and to be added to the sitemap
  e.g.
  /ipfs
  /filecoin

*/
function courses () {
  return []

  // return api.courses.getCourseNames().map(course => {
  //   return {
  //     type: TYPES.COURSE,
  //     path: `/course/${course}/`,
  //     sitemap: { priority: 1, changefreq: 'monthly', lastmod }
  //   }
  // }).map(addSitemapLoc)
}

function all () {
  return [
    ...statics(),
    ...tutorials(),
    ...courses(),
    ...errors(),
    ...redirects()
  ]
}

export default {
  statics,
  tutorials,
  courses,
  errors,
  redirects,
  all,
  TYPES
}
