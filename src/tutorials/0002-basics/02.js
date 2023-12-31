import {CID} from 'multiformats/cid'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }

  if (!CID.isCID(result)) {
    return { fail: 'Did not return a valid CID instance.' }
  }

  if (result.toString() === 'bafyreibmdfd7c5db4kls4ty57zljfhqv36gi43l6txl44pi423wwmeskwy') {
    return { success: 'Everything works!' }
  } else {
    return { fail: `Your function returned a CID, but it doesn't have the right contents. Be sure to \`put\` an object with \`bar\` as the named link and \`cid\` as its value.` }
  }
}

const code = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({ test: 1 })
  // your code goes here
}

return run
`

const solution = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({ test: 1 })
  let cid2 = await ipfs.dag.put({ bar: cid })
  return cid2
}

return run
`

export default {
  validate,
  code,
  solution
}
