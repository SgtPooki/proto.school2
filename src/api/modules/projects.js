// import { readFileSync } from 'fs'
// import { resolve } from 'path'

import { staticPath } from '../config'

const STATIC_FILE = 'projects.json'

function getStaticPath () {
  return [staticPath, STATIC_FILE].join('/')
}

const list = {}

list.get = async function listGet () {
  // console.log(getStaticPath())
  const { projects } = await import(getStaticPath())
  console.log(`projects: `, projects);
  return projects
  // return JSON.parse(readFileSync(getStaticPath(), 'utf8'))
}

export function get (id) {
  return list.get().find(project => project.id === id)
}

export default {
  getStaticPath,
  get,
  list
}
