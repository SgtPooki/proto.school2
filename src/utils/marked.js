import marked from 'meta-marked'
import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
// import hljsVuePlugin from "@highlightjs/vue-plugin";
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)

const renderer = new marked.Renderer()
renderer.link = function (href, title, text) {
  const link = marked.Renderer.prototype.link.call(this, href, title, text)
  return link.replace('<a', '<a target="_blank"')
}

marked.setOptions({
  renderer: renderer,
  highlight: code => {
    return hljs.highlightAuto(code).value
  }
})

export default marked
