import log from '../logger'
import debug from '../debug'
import tutorialsApi from './tutorials'
import utils from '../utils'

const logGroup = functionMethod => `[resources.${functionMethod}()]`

function add (id, resource) {
  const tutorials = tutorialsApi.list.getJson()

  tutorials[tutorialsApi.getFormattedId(id)].resources.push(resource)

  utils.writeStaticFile(tutorialsApi.STATIC_FILE, tutorials)
}

function get (id) {
  const tutorial = tutorialsApi.get(id)

  debug && log.debug(logGroup('get'), id, tutorial)

  return tutorial.resources
}

export default {
  add,
  get
}
