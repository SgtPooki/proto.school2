// import { readFileSync } from 'fs'
// import { resolve } from 'path'

import { staticPath } from '../config'
import { writeStaticFile } from '../utils'
import { getFormattedId } from './tutorials'
import coursesJsonImport from '../../static/courses.json'
const coursesPath = import.meta.glob('../../static/courses.json')
console.log(`coursesPath: `, coursesPath['../../static/courses.json']);
const STATIC_FILE = 'courses.json'
const coursesModule = await coursesPath['../../static/courses.json']()
console.log(`coursesModule: `, coursesModule);

// function getStaticPath () {
//   return resolve(staticPath, STATIC_FILE)
// }

function get () {
  const coursesJson = coursesJsonImport

  // return JSON.parse(coursesJson)
  return coursesJson
}

function getAll () {
  return get().all
}

function getFeatured () {
  return get().featured
}

function getCourseNames () {
  return Object.keys(get()).filter(course => (course !== 'all' && course !== 'featured'))
}

function save (courses) {
  writeStaticFile(STATIC_FILE, courses)
}

function add (id) {
  const formattedId = getFormattedId(id)
  const courses = get()

  if (courses.all.find(courseId => courseId === formattedId)) {
    return
  }

  courses.all.push(formattedId)

  save(courses)
}

async function remove (id) {
  const tutorialFormattedId = getFormattedId(id)
  const courses = get()

  courses.all = courses.all.filter(courseId => courseId !== tutorialFormattedId)
  courses.featured = courses.featured.filter(courseId => courseId !== tutorialFormattedId)

  writeStaticFile(STATIC_FILE, courses)
}

export default {
  // getStaticPath,
  get,
  getAll,
  getFeatured,
  getCourseNames,
  save,
  add,
  remove
}
