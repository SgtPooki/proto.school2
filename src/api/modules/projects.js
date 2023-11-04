// import { readFileSync } from 'fs'
// import { resolve } from 'path'

import { staticPath } from '../config'

const STATIC_FILE = 'projects.json'

function getStaticPath () {
  return [staticPath, STATIC_FILE].join('/')
}

const list = {}

list.get = async function listGet () {
  const {default: projects} = await import('../../static/projects.json')

  return projects
  // return JSON.parse(readFileSync(getStaticPath(), 'utf8'))
}

export async function getProject (id) {
  return (await list.get()).find(project => project.id === id)
}

export default {
  getStaticPath,
  getProject,
  list
}
