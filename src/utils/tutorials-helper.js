import errorCode from 'err-code'

const tutorialsJavascriptImports = import.meta.glob('@/tutorials/[0-9][0-9][0-9][0-9]-*/**/*.js')
const tutorialsMarkdownImports = import.meta.glob('@/tutorials/[0-9][0-9][0-9][0-9]-*/**/*.md', { as: 'raw', eager: true })

const tutorialsImports = {
  ...tutorialsJavascriptImports,
  ...tutorialsMarkdownImports
}

export function getRealPathForTutorialImport(path) {

  const key = Object.keys(tutorialsImports).find((key) => {
    return key.includes(path)
  })

  if (key == null) {
    throw errorCode(new Error(`NOT FOUND: "${path}" not found.`), 'MODULE_NOT_FOUND')
  }

  return key;
}

export function getTutorialMarkdown(path) {
  const key = Object.keys(tutorialsMarkdownImports).find((key) => {
    return key.includes(path)
  })
  if (key == null) {
    throw errorCode(new Error(`NOT FOUND: "${path}" not found.`), 'MODULE_NOT_FOUND')
  }
  return tutorialsMarkdownImports[key]
}

export async function getTutorialJavaScript(path) {
  const key = Object.keys(tutorialsJavascriptImports).find((key) => {
    return key.includes(path)
  })
  if (key == null) {
    throw errorCode(new Error(`NOT FOUND: "${path}" not found.`), 'MODULE_NOT_FOUND')
  }

  const mod = await tutorialsJavascriptImports[key]()
  return mod.default ?? mod
}

export async function getTutorialImport(path) {
  if (import.meta.env.SSR) {
    console.log('SSR MODE')
    console.log('SSR MODE')
    console.log('SSR MODE')
    console.log('SSR MODE')
    console.trace('SSR MODE')
    // console.log(tutorialsImports)
  }
  try {
    if (/\.md$/.test(path)) {
      return getTutorialMarkdown(path)
    } else {
      return await getTutorialJavaScript(path)
    }
  } catch (err) {
    throw errorCode(new Error(`NOT FOUND: "${path}" not found.`), 'MODULE_NOT_FOUND')
  }
}

// export async function getTutorialRoutes() {
//   const tutorialFolderPaths = import.meta.glob('@/tutorials/[0-9]*/')
//   console.log(`tutorialFolderPaths: `, tutorialFolderPaths);
//   const tutorials = []
//   for (const key in tutorialsImports) {
//     const mod = await tutorialsImports[key]()
//     const path = key.replace('@/tutorials/', '').replace('/index.js', '')
//     tutorials.push({
//       path,
//       ...mod.default
//     })
//   }
//   return tutorials
// }
