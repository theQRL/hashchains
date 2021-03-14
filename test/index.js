/* eslint no-console: 0 */

const { expect } = require('chai')
const { HashChains, HashChain } = require('../dist/hashchains.cjs.js')

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
  it('2 chains should be created if called without length parameter', function () {
    const hc = new HashChains(mnemonic)
    expect(hc.chains.length).to.equal(2)
  })
  it('20 chains should be created if called with a length parameter of 20', function () {
    const hc = new HashChains(mnemonic, 20)
    expect(hc.chains.length).to.equal(20)
  })
  it('starting index should be 2 if this is specified at creation', function () {
    const hc = new HashChains(mnemonic, 2, 2)
    expect(hc.chains[0].index).to.equal(2)
  })
  it('from test mnemonic first hashchain should have a hashroot of 23bc...86a6', function () {
    const hc = new HashChains(mnemonic)
    expect(hc.chains[0].hashRoot).to.equal('23bc761a62c2d555691292fb8e5f315cfab56ce8fc49b79543cafd39b15486a6')
    expect(hc.chains[0].hashchain[0]).to.equal('23bc761a62c2d555691292fb8e5f315cfab56ce8fc49b79543cafd39b15486a6')
  })
  it('from test mnemonic last hashchain should have a hashreveal of 22a4...26ba', function () {
    const hc = new HashChains(mnemonic)
    expect(hc.chains[0].hashReveal).to.equal('22a4c39faafd3d54f69b458a5bea0ab679b9d7dfcd4ba9a12ec4818fe0d926ba')
    expect(hc.chains[0].hashchain[64]).to.equal('22a4c39faafd3d54f69b458a5bea0ab679b9d7dfcd4ba9a12ec4818fe0d926ba')
  })
  it('expect overlapping chains to have same data', function () {
    const hc = new HashChains(mnemonic, 5)
    const hc2 = new HashChains(mnemonic, 5, 4)
    expect(hc.chains[4].hashRoot).to.equal(hc2.chains[0].hashRoot)
  })
  it('expect to throw when an unimplemented hash function is used', function () {
    expect(function () {
      const hc = new HashChains(mnemonic, 5, 0, 'sha256') // eslint-disable-line
    }).to.throw()
    expect(function () {
      const hc = new HashChain(mnemonic, 5, 0, 'sha256') // eslint-disable-line
    }).to.throw()
  })
})
