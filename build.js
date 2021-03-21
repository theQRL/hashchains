const { Buffer } = require('buffer/')
const {
  HashChains,
  HashChain,
  verifyChain,
  validateMnemonic,
  mnemonicToHexstring
} = require('./src/index.js')

window.HashChains = HashChains
window.HashChain = HashChain
window.verifyChain = verifyChain
window.mnemonicToHexstring = mnemonicToHexstring
window.validateMnemonic = validateMnemonic
window.Buffer = Buffer
