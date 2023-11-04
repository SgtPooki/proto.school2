/**
 * Tutorials module which includes all CRUD operations for tutorials.
 *
 * @module api/tutorials
 */

// import { mkdirSync, readFileSync } from 'fs'
// import { resolve } from 'path'

import errorCode from 'err-code'
import { findKey } from 'lodash-es'
// import { deleteSync as sync } from 'del'

import { createLogGroup, debug as _debug } from '../logger'
import debug from '../debug'
import { tutorialsPath, staticPath } from '../config'
import { deriveShortname, writeStaticFile } from '../utils'
import { getLesson } from './lessons'
import { getProject } from './projects'
import tutorialsJsonImport from '../../static/tutorials.json'

const STATIC_FILE = 'tutorials.json'

const logGroup = createLogGroup('tutorials')

function getNextTutorialId () {
  return list.getLatest().id + 1
}

export function getFormattedId (id) {
  return id.toString().padStart(4, 0)
}

function getId (formattedId) {
  return parseInt(formattedId, 10)
}

/**
 * Fetches Tutorial data
 *
 * @param {String|Object} id Tutorial id or simple tutorial object from static JSON file with at least a `url` property
 *
 * @returns Final tutorial data
 */
async function getProcessedTutorial (id) {
  const tutorialsJson = list.getJson()
  let tutorialId = id

  if (typeof id === 'object') {
    tutorialId = findKey(tutorialsJson, tutorial => tutorial.url === id.url)
  }

  const formattedId = getFormattedId(tutorialId)

  if (!tutorialsJson[formattedId]) {
    throw errorCode(new Error(`NOT FOUND: Tutorial with id ${id} not found.`), 'NOT_FOUND')
  }

  const tutorial = { ...tutorialsJson[formattedId] }

  // populate object with more data
  tutorial.id = getId(tutorialId)
  tutorial.formattedId = formattedId
  tutorial.shortTitle = deriveShortname(tutorial.url)
  tutorial.folderName = `${tutorial.formattedId}-${tutorial.url}`
  // tutorial.fullPath = resolve(`${tutorialsPath}/${tutorial.folderName}`)
  // TODO: migrate to import.meta.glob
  tutorial.fullPath = `../../tutorials/${tutorial.folderName}`
  // console.log('tutorial.fullPath', tutorial.fullPath)
  tutorial.lessons = await getLessons(tutorial)
  tutorial.project = await getProject(tutorial.project)

  debug && _debug(logGroup('get'), tutorial)

  return tutorial
}

function getByUrl (url) {
  const tutorialsList = list.getJson()

  const tutorial = list.get(Object.values(tutorialsList).find(tutorial => tutorial.url === url))
  debug && _debug(logGroup('getByUrl'), url, tutorial)

  if (!tutorial) {
    throw new Error(`NOT FOUND: Tutorial with url ${url} not found.`)
  }

  return tutorial
}

async function getLessons (tutorial, lessons = [], lessonId = 1) {
  let lesson

  try {
    lesson = await getLesson(tutorial, lessonId)
  } catch (error) {
    // lesson not found, we reached the end
    if (error.code === 'NOT_FOUND') {
      return lessons
    }
    return lessons;

    // throw error
  }

  lessons.push(lesson)

  return getLessons(tutorial, lessons, lessonId + 1)
}

function getFolderName (id, url) {
  const urlSuffix = url || (list.getJson())[getFormattedId(id)].url

  return `${getFormattedId(id)}-${urlSuffix}`
}

// function getFullPath (id, url) {
//   // return resolve(tutorialsPath, getFolderName(id, url))
//   return `${tutorialsPath}/${getFolderName(id, url)}`
// }

/**
 * Creates a new tutorial.
 *
 * 1. Creates tutorial folder in tutorials directory
 * 2. Adds a new entry to the tutorials static file
 *
 * @param {Object} data Tutorial data (mandatory: `title`, `url`, `project`  and `description`)
 * @returns New Tutorial object
 *
 * @example
 * api.tutorials.create({
 *    title: 'libp2p Peers',
 *    url: 'libp2p-peers',
 *    project: 'libp2p',
 *    description: 'Learn how peers interact with each other in libp2p.'
 * })
 */
// function create (data) {
//   const newTutorialId = getNextTutorialId()

//   debug && _debug(logGroup('create'), newTutorialId, data.url)

//   // create new directory
//   mkdirSync(getFullPath(newTutorialId, data.url))

//   const tutorial = {
//     id: newTutorialId,
//     formattedId: getFormattedId(newTutorialId),
//     url: data.url,
//     project: data.project,
//     title: data.title,
//     description: data.description || '',
//     newMessage: data.newMessage || '',
//     updateMessage: '',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     resources: []
//   }

//   list.add(tutorial)

//   return get(newTutorialId)
// }

// function remove (id) {
//   // delete tutorial folder
//   sync(getFullPath(id))

//   const tutorials = list.getJson()

//   debug && _debug(logGroup('remove'), id, tutorials[getFormattedId(id)].url)

//   // delete tutorial metadata from static file
//   delete tutorials[getFormattedId(id)]
//   writeStaticFile(STATIC_FILE, tutorials)
// }

export const list = {}

list.getStaticPath = function getStaticPath () {
  return 'static/tutorials.json'
}

list.getJson = function getJson () {
  // const tutorialsJson = readFileSync(list.getStaticPath(), 'utf8')
  // const tutorialsJson =

  return tutorialsJsonImport
}

list.get = async function listGet () {
  const tutorialsJson = list.getJson()
  const tutorials = {}

  for (let id in tutorialsJson) {
    tutorials[id] = await getProcessedTutorial(id)
  }

  return tutorials
}

list.getLatest = function getLatest () {
  const tutorials = list.get()

  return Object.values(tutorials)
    .sort((tutorial1, tutorial2) => tutorial2.id - tutorial1.id)[0]
}

list.add = function listAdd (data) {
  const tutorials = list.getJson()

  tutorials[data.formattedId] = data

  writeStaticFile(STATIC_FILE, tutorials)
}

export default {
  STATIC_FILE,

  // methods
  getFormattedId,
  getId,
  getProcessedTutorial,
  getByUrl,
  getFolderName,
  // getFullPath,
  getLessons,
  getNextTutorialId,
  // create,
  // remove,
  list
}
