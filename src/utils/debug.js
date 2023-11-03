import { isProduction } from './env'

export const debugLog = (...log) => !isProduction && console.info('[DEBUG]', ...log)

export const debug = !isProduction && import.meta.env.DEBUG
