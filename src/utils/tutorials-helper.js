import errorCode from 'err-code'

const tutorialsImports = import.meta.glob('@/tutorials/[0-9]*/**')

export async function getTutorialImport(path) {
  if (import.meta.env.SSR) {
    console.log('SSR MODE')
    console.log('SSR MODE')
    console.log('SSR MODE')
    console.log('SSR MODE')
    console.trace('SSR MODE')
  }

  const key = Object.keys(tutorialsImports).find((key) => {
    return key.includes(path)
  })
  if (key == null) {
    throw errorCode(new Error(`NOT FOUND: "${path}" not found.`), 'MODULE_NOT_FOUND')
  }
  const mod = await tutorialsImports[key]()

  if (mod.default.includes?.(path)) {
    // probably not a JS file
    const response = await fetch(mod.default)

    if (!response.ok) {
      console.log('RESPONSE NOT OK')
      throw errorCode(new Error(`NOT FOUND: "${path}" not found.`), 'MODULE_NOT_FOUND')
    }

    return response.text()
  } else {
    // probably a JS file
  }

  return mod.default ?? mod
}

export async function getTutorialRoutes() {
  const tutorialFolderPaths = import.meta.glob('@/tutorials/[0-9]*/')
  console.log(`tutorialFolderPaths: `, tutorialFolderPaths);
  const tutorials = []
  for (const key in tutorialsImports) {
    const mod = await tutorialsImports[key]()
    const path = key.replace('@/tutorials/', '').replace('/index.js', '')
    tutorials.push({
      path,
      ...mod.default
    })
  }
  return tutorials
}
