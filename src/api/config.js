/* eslint-disable no-unused-expressions */

const config = {}

export const staticPath = import.meta.env.DATA_STATIC_PATH || 'src/static'
config.staticPath = staticPath
config.tutorialsPath = import.meta.env.DATA_TUTORIALS_PATH || 'src/tutorials'

export const boilerplates = {}
boilerplates.path = import.meta.env.LESSON_BOILERPLATES_PATH || `${config.tutorialsPath}/boilerplates`
boilerplates.markdownPath = `${boilerplates.path}/boilerplate.md`
boilerplates.challengeMarkdownPath = `${boilerplates.path}/boilerplate-challenge.md`
boilerplates.multipleChoiceJsPath = `${boilerplates.path}/boilerplate-multiple-choice.js`
boilerplates.codeJsPath = `${boilerplates.path}/boilerplate-code.js`
boilerplates.fileUploadJsPath = `${boilerplates.path}/boilerplate-file-upload.js`
config.boilerplates = boilerplates

export default config
