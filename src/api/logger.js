const log = {

}
export function debug (...args) {
  console.log('⚙️ api', ...args)
}
log.debug = debug

export const createLogGroup = module => functionMethod => `[${module}.${functionMethod}()]`
log.createLogGroup = createLogGroup
export default log
