/* eslint max-classes-per-file: 0 */

const keccak256 = require('keccak256')

class HashChain {
  constructor(hashRoot, hashFunction, length) {
    this.hashRoot = hashRoot
    this.hashFunction = hashFunction || 'keccak256'
    this.length = length || 64
    const hc = []
    hc.push(this.hashRoot)
    for (let i = 0; i < this.length; i += 1) {
      if (this.hashFunction === 'keccak256') {
        hc.push(keccak256(`${hc[i]}`).toString('hex'))
      } else {
        throw new Error('hash function not implemented')
      }
    }
    this.chain = hc
    return hc
  }
}

class HashChains {
  constructor(mnemonic, numberToCreate, index, hashFunction, length) {
    this.hashFunction = hashFunction || 'keccak256'
    this.length = length || 64
    const startingIndex = index || 0
    const chainsToMake = numberToCreate || 2
    const hashChains = []
    const hashChainRoots = []
    let hashRoot = null
    for (let i = 0; i < chainsToMake; i += 1) {
      if (this.hashFunction === 'keccak256') {
        hashRoot = keccak256(`${mnemonic}${startingIndex + i}`).toString('hex')
      } else {
        throw new Error('hash function not implemented')
      }
      hashChainRoots.push(hashRoot)
      const hc = new HashChain(hashRoot)
      hashChains.push({
        index: startingIndex + i,
        hashRoot,
        hashReveal: hc[64],
        hashchain: hc,
      })
    }
    this.chains = hashChains
  }
}

module.exports = {
  HashChains,
  HashChain
}
