const isDebug = (import.meta.env.NODE_ENV === 'development' || import.meta.env.NODE_ENV === 'test') && import.meta.env.DEBUG
export default isDebug
