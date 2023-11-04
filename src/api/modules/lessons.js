// import { readFileSync, writeFileSync, copyFileSync } from 'fs'

import errorCode from 'err-code'
import marked from 'meta-marked'

import log from '../logger'
import debug from '../debug'
import { boilerplates } from '../config'

const logGroup = log.createLogGroup('lessons')

function getFormattedId (id) {
  return id.toString().padStart(2, 0)
}

function getId (formattedId) {
  return parseInt(formattedId, 10)
}

function getNextLessonId (tutorial) {
  return tutorial.lessons.length > 0
    ? tutorial.lessons.map(lesson => lesson.id).sort().reverse()[0] + 1
    : 1
}

export async function getLesson (tutorial, lessonId) {
  console.log('getLesson')
  const formattedId = getFormattedId(lessonId)
  const lessonFilePrefix = `${tutorial.folderName}/${formattedId}`
  console.log(`lessonFilePrefix: `, lessonFilePrefix);

  let lessonMd
  let lesson

  debug && log.debug(logGroup('get'), tutorial.id, lessonId, formattedId)

  try {
    const mdPath = files.getMarkdownPath(tutorial, lessonId)
    console.log(`mdPath: `, mdPath);
    // const testLessonMd = import.meta.glob(`@/tutorials/${lessonFilePrefix}.md`)
    try {

    lessonMd = await import(/* @vite-ignore */ mdPath)
    console.log(`lessonMd: `, lessonMd);
    // console.log(`testLessonMd: `, testLessonMd);
    } catch (err) {
      // throw ENOENT error if file not found
      // if (err.code === 'ENOENT') {
        throw errorCode(new Error(`ENOENT: Lesson with id "${lessonId}" not found.`), 'ENOENT')
      // }
    }

    if (Math.random() > 0.1) {
      throw new Error('test')
    }
    // lessonMd = readFileSync(files.getMarkdownPath(tutorial, lessonId), 'utf8')
    // lessonMd = `placeHolder for lessonMd for ${tutorial.id} ${lessonId} ${formattedId}}`
    lessonMd =
    console.log(`lessonMd: `, lessonMd);
    lesson = {
      id: lessonId,
      formattedId: formattedId,
      tutorialId: tutorial.id,
      url: `${tutorial.url}/${formattedId}`,
      ...marked(lessonMd).meta
    }

    lesson.files = {
      markdown: files.getMarkdownPath(tutorial, lessonId)
    }

    if (lesson.type !== 'text') {
      lesson.files.js = files.getJsPath(tutorial, lessonId)

      if (lesson.type !== 'multiple-choice') {
        lesson.files.challengeMarkdown = files.getChallengeMarkdownPath(tutorial, lessonId)
      }
    }
  } catch (error) {
    // lesson not found, we reached the end
    if (error.code === 'ENOENT') {
      throw errorCode(new Error(`NOT FOUND: Lesson with id "${lessonId}" not found.`), 'NOT_FOUND')
    }

    // data not well formatted
    if (error.name === 'YAMLException') {
      console.error(
        new Error(`Data improperly formatted in the lesson markdown file "${lessonFilePrefix}.md". Check that the YAML syntax is correct.`)
      )
    }
    console.log(error)
    Object.keys(error).forEach(key => {
      console.log(`error.${key}: `, error[key]);
    })
    console.log(`error.code: `, error.code);
    throw error
  }

  return lesson
}

/**
 * overwrites the JS file for a multiple-choice lesson with new quiz content &
 * removes boilerplate's #PRISTINE# tag (if present) to show edits have been made
 */

function updateQuiz (tutorial, lesson, data) {
  const lessonId = lesson.formattedId
  const newFileContent = `
/* eslint quotes: ["error", "double"]  */

// Question must be a string
const question = "${data.question}"

// Choices must be an array of objects, each with the properties:
// \`answer\` (string), \`correct\` (boolean), and \`feedback\` (string)
// Only one answer can be correct.
const choices = ${JSON.stringify(data.choices, null, 2)}

export default {
  question,
  choices
}
`
  // writeFileSync(files.getJsPath(tutorial, lessonId), newFileContent)
  console.log('not writing file', files.getJsPath(tutorial, lessonId), newFileContent)
  return getLesson(tutorial, lessonId)
}

/**
 * returns true if the quiz was created from the boilerplate and still has
 * #PRISTINE# tag because either:
 * a) it's never been edited, manually or via ProtoWizard
 * b) user edited manually and failed to remove #PRISTINE# tag as instructed
*/

function isQuizPristine (tutorial, lesson) {
  // let quizContent = readFileSync(files.getJsPath(tutorial, lesson.formattedId), 'utf8')
  let quizContent = 'placeHolder for quizContent'
  return quizContent.includes('#PRISTINE#')
}

/**
 * Creates a new lesson in the specified tutorial
 *
 * `data.type` can be one of `text`, `multiple-choice`, `code` or `file-upload`.
 *
 * @param {String} tutorial Tutorial object
 * @param {Object} data Lesson data (mandatory: `title`, `type`)
 *
 * @returns The newly created lesson
 *
 * @example
 * api.lessons.create(tutorial, { title: 'Lesson title', type: 'text' })
 */

function create (tutorial, data) {
  const lessonId = getNextLessonId(tutorial)

  // let lessonMarkdown = readFileSync(boilerplates.markdownPath, 'utf8')
  let lessonMarkdown = 'placeHolder for lessonMarkdown'

  lessonMarkdown = lessonMarkdown.replace(`title: "Lesson title"`, `title: "${data.title}"`)
  lessonMarkdown = lessonMarkdown.replace(`type: "text"`, `type: "${data.type || 'text'}"`)

  if (data.type !== 'text') {
    // copyFileSync(`${boilerplates.path}/boilerplate-${data.type}.js`, files.getJsPath(tutorial, lessonId))
    console.log('not copying file', boilerplates.path, files.getJsPath(tutorial, lessonId))

    if (data.type !== 'multiple-choice') {
      // copyFileSync(boilerplates.challengeMarkdownPath, files.getChallengeMarkdownPath(tutorial, lessonId))
      console.log('not copying file', boilerplates.challengeMarkdownPath, files.getChallengeMarkdownPath(tutorial, lessonId))
    }
  }

  // writeFileSync(files.getMarkdownPath(tutorial, lessonId), lessonMarkdown)
  console.log('not writing file', files.getMarkdownPath(tutorial, lessonId), lessonMarkdown)

  return getLesson(tutorial, lessonId)
}

const files = {}

files.getMarkdownPath = (tutorial, lessonId) => (
  `${tutorial.fullPath}/${getFormattedId(lessonId)}.md`
)

files.getJsPath = (tutorial, lessonId) => (
  `${tutorial.fullPath}/${getFormattedId(lessonId)}.js`
)

files.getChallengeMarkdownPath = (tutorial, lessonId) => (
  `${tutorial.fullPath}/${getFormattedId(lessonId)}-challenge.md`
)

export default {
  getNextLessonId,
  getFormattedId,
  getId,
  getLesson,
  create,
  files,
  updateQuiz,
  isQuizPristine
}
