const keccak256 = require ('keccak256');

function browserRandom(count) {
  const nativeArr = new Uint8Array(count);
  const crypto = window.crypto || window.msCrypto;
  crypto.getRandomValues(nativeArr);
  return [].slice.call(nativeArr);
}

function makeHashChain(hashRoot) {
  const hc = [];
  hc.push(hashRoot);
  for (let i = 0; i < 64; i += 1) {
    hc.push(keccak256(`${hc[i]}`).toString("hex"));
  }
  return hc;
}

function makeHashChains(mnemonic, number, index) {
  const startingIndex = index || 0;
  const chainsToMake = number || 2;
  const hashChains = [];
  const hashChainRoots = [];
  for (let i = 0; i < chainsToMake; i += 1) {
    const hashRoot = keccak256(`${mnemonic}${startingIndex + i}`).toString(
      "hex"
    );
    hashChainRoots.push(hashRoot);
    const hc = makeHashChain(hashRoot);
    hashChains.push({
      index: startingIndex + i,
      hashRoot,
      hashReveal: hc[64],
      hashchain: hc,
    });
  }
  return hashChains;
}

module.exports = {
  makeHashChain,
  makeHashChains
}