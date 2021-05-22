/* eslint no-console: 0, max-len: 0 */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const { expect } = require('chai')

const {
  HashChains, HashChain, verifyChain, validateMnemonic, mnemonicToHexstringSync, mnemonicToHexstring
} = require('../src/index.js')

// eslint-disable-next-line
const mnemonic = 'busy field enact street stove sound victory siren alert shadow parent will spend pass rival slender used trigger system shrimp hungry float violin local'

describe('test esm build', function () {
  it('classes should throw if called as functions', function () {
    expect(function () {
      HashChains(mnemonic, 5, 0, 'sha256')
    }).to.throw()
    expect(function () {
      HashChain(mnemonic, 5, 0, 'sha256')
    }).to.throw()
  })
})

describe('make a hashchain', function () {
  it('2 chains should be created if called without quantity parameter', function () {
    const hc = new HashChains(mnemonic)
    expect(hc.chains.length).to.equal(2)
  })
  it('20 chains should be created if called with a quantity parameter of 20', function () {
    const hc = new HashChains(mnemonic, 20)
    expect(hc.chains.length).to.equal(20)
  })
  it('starting index should be 2 if this is specified at creation', function () {
    const hc = new HashChains(mnemonic, 2, 2)
    expect(hc.chains[0].index).to.equal(2)
  })
  it('from test mnemonic first hashchain should have a hashReveal of 23bc...86a6', function () {
    const hc = new HashChains(mnemonic)
    expect(hc.chains[0].hashReveal).to.equal('044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d')
    expect(hc.chains[0].hashchain[0]).to.equal('044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d')
  })
  it('from test mnemonic last hashchain should have a hashChainTerminator of 22a4...26ba', function () {
    const hc = new HashChains(mnemonic)
    expect(hc.chains[0].hashChainTerminator).to.equal('0bb58fdc4f70ecbe0fcbe0bd1a17a8878ceacb759db13501c1abc9d0838cd204')
    expect(hc.chains[0].hashchain[64]).to.equal('0bb58fdc4f70ecbe0fcbe0bd1a17a8878ceacb759db13501c1abc9d0838cd204')
  })
  it('from test mnemonic correctly report hashChainTerminator', function () {
    const hc = new HashChains(mnemonic)
    expect(hc.chains[0].hashChainTerminator).to.equal('0bb58fdc4f70ecbe0fcbe0bd1a17a8878ceacb759db13501c1abc9d0838cd204')
  })
  it('expect overlapping chains to have same data', function () {
    const hc = new HashChains(mnemonic, 5)
    const hc2 = new HashChains(mnemonic, 5, 4)
    expect(hc.chains[4].hashReveal).to.equal(hc2.chains[0].hashReveal)
  })
  it('expect to throw when an unimplemented hash function is used', function () {
    expect(function () {
      const hc = new HashChains(mnemonic, 5, 0, 'sha256') // eslint-disable-line
    }).to.throw()
    expect(function () {
      const hc = new HashChain(mnemonic, 'sha256', 0) // eslint-disable-line
    }).to.throw()
  })
  it('expect not to throw when an implemented hash function is used for single chain', function () {
    expect(function () {
      const hc = new HashChain(mnemonic, 'keccak256', 0) // eslint-disable-line
    }).to.not.throw()
  })
  it('expect not to default to keccak256 for single chain', function () {
    expect(function () {
      const hc = new HashChain(mnemonic, undefined , 0) // eslint-disable-line
    }).to.not.throw()
  })
  it('expect chain with created with a length parameter of 3 to be correctly created', function () {
    const hc = new HashChains(mnemonic, 1, 0, undefined, 3)
    expect(hc.chains[0].hashchain.length).to.equal(4)
  })
  it('expect chain with created with a length parameter of 2 to be correctly created', function () {
    const hc = new HashChains(mnemonic, 1, 0, undefined, 2)
    expect(hc.chains[0].hashchain.length).to.equal(3)
  })
  it('expect chain with created with a length parameter of 1 to be correctly created', function () {
    const hc = new HashChains(mnemonic, 1, 0, undefined, 1)
    expect(hc.chains[0].hashchain.length).to.equal(2)
  })
})

describe('verify a hashchain', function () {
  it('valid chain should correctly verify', function () {
    const hc = new HashChains(mnemonic)
    expect(verifyChain(hc.chains[0].hashReveal, hc.chains[0].hashChainTerminator)).to.equal(true)
  })
  it('valid chain will not verify with invalid length', function () {
    const hc = new HashChains(mnemonic)
    expect(verifyChain(hc.chains[0].hashReveal, hc.chains[0].hashChainTerminator, 65)).to.equal(false)
  })
  it('expect verify to throw if an invalid hashing algorithm is passed', function () {
    const hc = new HashChains(mnemonic)
    expect(function () {
      const verify = verifyChain(hc.chains[0].hashReveal, hc.chains[0].hashChainTerminator, 65, 'sha256') // eslint-disable-line
    }).to.throw()
  })
})

describe('utility functions', function () {
  it('validate correct bip39 mnemonic', function () {
    // eslint-disable-next-line
    const v = validateMnemonic(
      'essay shadow creek eager legal just bench exchange miracle work grace vivid load shed genre angry success guide film spray hotel digital barrel grab'
    )
    expect(v).to.equal(true)
  })
  it('invalidate incorrect bip39 mnemonic', function () {
    // eslint-disable-next-line
    const v = validateMnemonic('remember Joan Clarke and what she achieved')
    expect(v).to.equal(false)
  })
  it('make a mnemonic from hexstring', function () {
    const h = mnemonicToHexstringSync(
      'essay shadow creek eager legal just bench exchange miracle work grace vivid load shed genre angry success guide film spray hotel digital barrel grab'
    )
    expect(h).to.equal(
      '35e92a891583c6b5b7925d9f4084ae8ec9e5591ce7dc84e3631368bacf0b4d262aecc3c89fe89b4480eb6120e8721774efdd81e7f2003416358146add3e243c2'
    )
  })
  it('make a mnemonic from hexstring', async function () {
    const h = mnemonicToHexstring(
      'essay shadow creek eager legal just bench exchange miracle work grace vivid load shed genre angry success guide film spray hotel digital barrel grab'
    )
    expect(h).to.eventually.equal(
      '35e92a891583c6b5b7925d9f4084ae8ec9e5591ce7dc84e3631368bacf0b4d262aecc3c89fe89b4480eb6120e8721774efdd81e7f2003416358146add3e243c2'
    )
  })
})
