/* @theqrl/hashchains v0.6.1 - Copyright (C) Die QRL Stiftung. License: MIT */
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  /* eslint max-classes-per-file: 0 */
  var keccak = require('keccak');

  var bip39 = require('bip39');

  var HashChain = function HashChain(hashReveal, hashFunction, length) {
    _classCallCheck(this, HashChain);

    this.hashReveal = hashReveal;
    this.hashFunction = hashFunction || 'keccak256';
    this.length = parseInt(length, 10) || 64;
    var l = this.length;
    var hc = [];
    hc.push(this.hashReveal);

    for (var i = 0; i < l; i += 1) {
      if (this.hashFunction === 'keccak256') {
        var buf = Buffer.from(hc[i], 'hex');
        hc.push(keccak('keccak256').update(buf).digest('hex'));
      } else {
        throw new Error('hash function not implemented');
      }
    }

    this.chain = hc;
    return hc;
  };

  var HashChains = function HashChains(seed, numberToCreate, index, hashFunction, length) {
    _classCallCheck(this, HashChains);

    this.hashFunction = hashFunction || 'keccak256';
    this.length = parseInt(length, 10) || 64;
    var l = this.length;
    var startingIndex = parseInt(index, 10) || 0;
    var chainsToMake = parseInt(numberToCreate, 10) || 2;
    var seedBuf = Buffer.from(seed, 'hex');
    var hashChains = [];
    var hashReveal = null;

    if (this.hashFunction === 'keccak256') {
      for (var i = 0; i < chainsToMake; i += 1) {
        var iBuf = Buffer.from("".concat(startingIndex + i));
        hashReveal = keccak('keccak256').update(Buffer.concat([seedBuf, iBuf])).digest('hex');
        var hc = new HashChain(hashReveal, this.hashFunction, l);
        hashChains.push({
          index: startingIndex + i,
          hashReveal: hashReveal,
          hashChainTerminator: hc[l],
          hashchain: hc
        });
      }

      this.chains = hashChains;
    } else {
      throw new Error('hash function not implemented');
    }
  };

  function verifyChain(hashReveal, hashChainTerminator, length, hashFunction) {
    var iterations = length || 64;
    var algorithm = hashFunction || 'keccak256';
    var hash = hashReveal;

    if (algorithm === 'keccak256') {
      for (var i = 0; i < iterations; i += 1) {
        hash = keccak('keccak256').update(Buffer.from(hash, 'hex')).digest('hex');
      }
    } else {
      throw new Error('hash function not implemented');
    }

    return hash === hashChainTerminator;
  }

  function mnemonicToHexstringSync(mnemonic) {
    return bip39.mnemonicToSeedSync(mnemonic).toString('hex');
  }

  function mnemonicToHexstring(_x) {
    return _mnemonicToHexstring.apply(this, arguments);
  }

  function _mnemonicToHexstring() {
    _mnemonicToHexstring = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(mnemonic) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", bip39.mnemonicToSeed(mnemonic).toString('hex'));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _mnemonicToHexstring.apply(this, arguments);
  }

  function validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  }

  module.exports = {
    HashChain: HashChain,
    HashChains: HashChains,
    verifyChain: verifyChain,
    mnemonicToHexstring: mnemonicToHexstring,
    mnemonicToHexstringSync: mnemonicToHexstringSync,
    validateMnemonic: validateMnemonic
  };

})));
