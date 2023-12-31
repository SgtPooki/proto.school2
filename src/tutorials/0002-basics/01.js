import {CID} from 'multiformats/cid'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }

  if (!CID.isCID(result)) {
    return { fail: 'Did not return a valid CID instance.' }
  }

  if (result.toString() === 'bafyreicaoyussrycqolu4k2iaxleu2uakjlq57tuxq3djxn4wnyfp4yk3y') {
    return { success: 'Everything works!' }
  } else {
    const obj = await ipfs.dag.get(result)
    const expected = JSON.stringify({ test: 1 })
    const got = JSON.stringify(obj.value)

    return { fail: `Your function returned a CID, but it doesn't have the right contents. It looks like you stored the data \`${got}\` instead of \`${expected}\`.` }
  }
}

const solution = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({ test: 1 })
  return cid
}

return run
`

export default {
  validate,
  solution
}
