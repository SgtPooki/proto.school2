import data from '../static/projects.json'
import { defineAsyncComponent } from 'vue'
// import projectLogos from '../static/images/projects/*.svg'

// Populate data with more properties

data.forEach(project => {
  project.logo = defineAsyncComponent(() => import(`@/static/images/projects/${project.id}.svg`))
})

export function get (id) {
  return getAll().find(project => project.id === id)
}

export function getAll () {
  return data
}

export function getNewsletters () {
  return getAll().filter(project => Object.prototype.hasOwnProperty.call(project, 'newsletterUrl'))
}

export default {
  get,
  getAll,
  getNewsletters
}
