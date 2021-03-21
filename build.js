const { Buffer } = require('buffer/')
const {
  HashChains,
  HashChain,
  verifyChain,
  validateMnemonic,
  mnemonicToHexstring,
  mnemonicToHexstringSync,
} = require('./src/index.js')

window.HashChains = HashChains
window.HashChain = HashChain
window.verifyChain = verifyChain
window.mnemonicToHexstring = mnemonicToHexstring
window.mnemonicToHexstringSync = mnemonicToHexstringSync
window.validateMnemonic = validateMnemonic
window.Buffer = Buffer
