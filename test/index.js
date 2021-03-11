const { expect } = require('chai')
const hashchains = require ('../src/index.js')
const mnemonic =
  "busy field enact street stove sound victory siren alert shadow parent will spend pass rival slender used trigger system shrimp hungry float violin local"

describe('make a hashchain', function() {
  it('2 chains should be created if called without length parameter', function() {
    const hc = hashchains.makeHashChains(mnemonic)
    expect(hc.length).to.equal(2)
  })
  it("20 chains should be created if called with a length parameter of 20", function () {
    const hc = hashchains.makeHashChains(mnemonic, 20);
    expect(hc.length).to.equal(20);
  });
  it('starting index should be 2 if this is specified at creation', function() {
    const hc = hashchains.makeHashChains(mnemonic, 2, 2)
    expect(hc[0].index).to.equal(2)
  })
  it('from test mnemonic first hashchain should have a hashroot of 23bc...86a6', function() {
    const hc = hashchains.makeHashChains(mnemonic)
    expect(hc[0].hashRoot).to.equal('23bc761a62c2d555691292fb8e5f315cfab56ce8fc49b79543cafd39b15486a6')
    expect(hc[0].hashchain[0]).to.equal('23bc761a62c2d555691292fb8e5f315cfab56ce8fc49b79543cafd39b15486a6')
  })
  it('from test mnemonic last hashchain should have a hashreveal of 22a4...26ba', function() {
    const hc = hashchains.makeHashChains(mnemonic)
    expect(hc[0].hashReveal).to.equal('22a4c39faafd3d54f69b458a5bea0ab679b9d7dfcd4ba9a12ec4818fe0d926ba')
    expect(hc[0].hashchain[64]).to.equal('22a4c39faafd3d54f69b458a5bea0ab679b9d7dfcd4ba9a12ec4818fe0d926ba')
  })
})
