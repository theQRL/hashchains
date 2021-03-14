/* @theqrl/hashchains v0.1.2 - Copyright (C) Die QRL Stiftung. License: MIT */
import keccak from 'keccak';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var HashChain = function HashChain(hashRoot, hashFunction, length) {
  _classCallCheck(this, HashChain);

  this.hashRoot = hashRoot;
  this.hashFunction = hashFunction || 'keccak256';
  this.length = parseInt(length, 10) || 64;
  var hc = [];
  hc.push(this.hashRoot);

  for (var i = 0; i < this.length; i += 1) {
    if (this.hashFunction === 'keccak256') {
      hc.push(keccak('keccak256').update("".concat(hc[i])).digest('hex'));
    } else {
      throw new Error('hash function not implemented');
    }
  }

  this.chain = hc;
  return hc;
};
var HashChains = function HashChains(mnemonic, numberToCreate, index, hashFunction, length) {
  _classCallCheck(this, HashChains);

  this.hashFunction = hashFunction || 'keccak256';
  this.length = parseInt(length, 10) || 64;
  var startingIndex = parseInt(index, 10) || 0;
  var chainsToMake = parseInt(numberToCreate, 10) || 2;
  var hashChains = [];
  var hashRoot = null;

  for (var i = 0; i < chainsToMake; i += 1) {
    if (this.hashFunction === 'keccak256') {
      hashRoot = keccak('keccak256').update("".concat(mnemonic).concat(startingIndex + i)).digest('hex');
    } else {
      throw new Error('hash function not implemented');
    }
    var hc = new HashChain(hashRoot);
    hashChains.push({
      index: startingIndex + i,
      hashRoot: hashRoot,
      hashReveal: hc[64],
      hashchain: hc
    });
  }

  this.chains = hashChains;
};

export { HashChain, HashChains };
