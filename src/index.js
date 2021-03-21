/* eslint max-classes-per-file: 0 */

const keccak = require('keccak')
const bip39 = require('bip39')

class HashChain {
  constructor(hashRoot, hashFunction, length) {
    this.hashRoot = hashRoot
    this.hashFunction = hashFunction || 'keccak256'
    this.length = parseInt(length, 10) || 64
    const hc = []
    hc.push(this.hashRoot)
    for (let i = 0; i < this.length; i += 1) {
      if (this.hashFunction === 'keccak256') {
        const buf = Buffer.from(hc[i], 'hex')
        hc.push(keccak('keccak256').update(buf).digest('hex'))
      } else {
        throw new Error('hash function not implemented')
      }
    }
    this.chain = hc
    return hc
  }
}

class HashChains {
  constructor(seed, numberToCreate, index, hashFunction, length) {
    this.hashFunction = hashFunction || 'keccak256'
    this.length = parseInt(length, 10) || 64
    const startingIndex = parseInt(index, 10) || 0
    const chainsToMake = parseInt(numberToCreate, 10) || 2
    const seedBuf = Buffer.from(seed, 'hex')
    const hashChains = []
    const hashChainRoots = []
    let hashRoot = null
    if (this.hashFunction === 'keccak256') {
      for (let i = 0; i < chainsToMake; i += 1) {
        const iBuf = Buffer.from(`${startingIndex + i}`)
        hashRoot = keccak('keccak256')
          .update(Buffer.concat([seedBuf, iBuf]))
          .digest('hex')
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
    } else {
      throw new Error('hash function not implemented')
    }
  }
}

function verifyChain(hashRoot, hashReveal, length, algorithm) {
  const iterations = length || 64
  const hashFunction = algorithm || 'keccak256'
  let hash = hashRoot
  if (hashFunction === 'keccak256') {
    for (let i = 0; i < iterations; i += 1) {
      hash = keccak('keccak256').update(Buffer.from(hash, 'hex')).digest('hex')
    }
  } else {
    throw new Error('hash function not implemented')
  }
  return (hash === hashReveal)
}

function mnemonicToHexstringSync(mnemonic) {
  return bip39.mnemonicToSeedSync(mnemonic).toString('hex')
}

async function mnemonicToHexstring(mnemonic) {
  return bip39.mnemonicToSeed(mnemonic).toString('hex')
}

function validateMnemonic(mnemonic) {
  return bip39.validateMnemonic(mnemonic)
}

module.exports = {
  HashChain, HashChains, verifyChain, mnemonicToHexstring, mnemonicToHexstringSync, validateMnemonic
}
