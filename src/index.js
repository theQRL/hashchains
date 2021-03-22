/* eslint max-classes-per-file: 0 */

const keccak = require('keccak')
const bip39 = require('bip39')

class HashChain {
  constructor(hashReveal, hashFunction, length) {
    this.hashReveal = hashReveal
    this.hashFunction = hashFunction || 'keccak256'
    this.length = parseInt(length, 10) || 64
    const hc = []
    hc.push(this.hashReveal)
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
    let hashReveal = null
    if (this.hashFunction === 'keccak256') {
      for (let i = 0; i < chainsToMake; i += 1) {
        const iBuf = Buffer.from(`${startingIndex + i}`)
        hashReveal = keccak('keccak256')
          .update(Buffer.concat([seedBuf, iBuf]))
          .digest('hex')
        hashChainRoots.push(hashReveal)
        const hc = new HashChain(hashReveal)
        hashChains.push({
          index: startingIndex + i,
          hashReveal,
          hashChainTerminator: hc[64],
          hashchain: hc,
        })
      }
      this.chains = hashChains
    } else {
      throw new Error('hash function not implemented')
    }
  }
}

function verifyChain(hashReveal, hashChainTerminator, length, hashFunction) {
  const iterations = length || 64
  const algorithm = hashFunction || 'keccak256'
  let hash = hashReveal
  if (algorithm === 'keccak256') {
    for (let i = 0; i < iterations; i += 1) {
      hash = keccak('keccak256').update(Buffer.from(hash, 'hex')).digest('hex')
    }
  } else {
    throw new Error('hash function not implemented')
  }
  return (hash === hashChainTerminator)
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
