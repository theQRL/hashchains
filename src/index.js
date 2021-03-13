/* eslint max-classes-per-file: 0 */

const keccak = require('keccak')

class HashChain {
  constructor(hashRoot, hashFunction, length) {
    this.hashRoot = hashRoot
    this.hashFunction = hashFunction || 'keccak256'
    this.length = parseInt(length, 10) || 64
    const hc = []
    hc.push(this.hashRoot)
    for (let i = 0; i < this.length; i += 1) {
      if (this.hashFunction === 'keccak256') {
        hc.push(keccak('keccak256').update(`${hc[i]}`).digest('hex'))
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
    this.length = parseInt(length, 10) || 64
    const startingIndex = parseInt(index, 10) || 0
    const chainsToMake = parseInt(numberToCreate, 10) || 2
    const hashChains = []
    const hashChainRoots = []
    let hashRoot = null
    for (let i = 0; i < chainsToMake; i += 1) {
      if (this.hashFunction === 'keccak256') {
        hashRoot = keccak('keccak256')
          .update(`${mnemonic}${startingIndex + i}`)
          .digest('hex')
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
