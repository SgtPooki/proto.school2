import errorCode from 'err-code'

export default async function dynamicMdImport (path) {
  try {
    const module = await import(path)
    // console.log(`module: `, module);
    const response = await fetch(module.default)

    if (!response.ok) {
      throw errorCode(new Error(`NOT FOUND: "${path}" not found.`), 'MODULE_NOT_FOUND')
    }
    return response.text()
  } catch (err) {
    throw errorCode(new Error(`NOT FOUND: "${path}" not found.`), 'MODULE_NOT_FOUND')
  }

}
