const { Buffer } = require('buffer/')
const {
  HashChains,
  HashChain,
  verifyChain,
  mnemonicToHexstring
} = require('./src/index.js')

window.HashChains = HashChains
window.HashChain = HashChain
window.verifyChain = verifyChain
window.mnemonicToHexstring = mnemonicToHexstring
window.Buffer = Buffer
