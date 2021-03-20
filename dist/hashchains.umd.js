/* @theqrl/hashchains v0.3.1 - Copyright (C) Die QRL Stiftung. License: MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('buffer')) :
  typeof define === 'function' && define.amd ? define(['buffer'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.HashChains = factory(global.buffer));
}(this, (function (buffer) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function getAugmentedNamespace(n) {
  	if (n.__esModule) return n;
  	var a = Object.defineProperty({}, '__esModule', {value: true});
  	Object.keys(n).forEach(function (k) {
  		var d = Object.getOwnPropertyDescriptor(n, k);
  		Object.defineProperty(a, k, d.get ? d : {
  			enumerable: true,
  			get: function () {
  				return n[k];
  			}
  		});
  	});
  	return a;
  }

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var __dirname = '/Users/jp/hashchains/node_modules/keccak';

  module.exports = require('./lib/api')(require('node-gyp-build')(__dirname));

  var bindings = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var _require$1 = require('stream'),
      Transform$1 = _require$1.Transform;

  module.exports = function (KeccakState) {
    return /*#__PURE__*/function (_Transform) {
      _inherits(Keccak, _Transform);

      var _super = _createSuper(Keccak);

      function Keccak(rate, capacity, delimitedSuffix, hashBitLength, options) {
        var _this;

        _classCallCheck(this, Keccak);

        _this = _super.call(this, options);
        _this._rate = rate;
        _this._capacity = capacity;
        _this._delimitedSuffix = delimitedSuffix;
        _this._hashBitLength = hashBitLength;
        _this._options = options;
        _this._state = new KeccakState();

        _this._state.initialize(rate, capacity);

        _this._finalized = false;
        return _this;
      }

      _createClass(Keccak, [{
        key: "_transform",
        value: function _transform(chunk, encoding, callback) {
          var error = null;

          try {
            this.update(chunk, encoding);
          } catch (err) {
            error = err;
          }

          callback(error);
        }
      }, {
        key: "_flush",
        value: function _flush(callback) {
          var error = null;

          try {
            this.push(this.digest());
          } catch (err) {
            error = err;
          }

          callback(error);
        }
      }, {
        key: "update",
        value: function update(data, encoding) {
          if (!buffer.Buffer.isBuffer(data) && typeof data !== 'string') throw new TypeError('Data must be a string or a buffer');
          if (this._finalized) throw new Error('Digest already called');
          if (!buffer.Buffer.isBuffer(data)) data = buffer.Buffer.from(data, encoding);

          this._state.absorb(data);

          return this;
        }
      }, {
        key: "digest",
        value: function digest(encoding) {
          if (this._finalized) throw new Error('Digest already called');
          this._finalized = true;
          if (this._delimitedSuffix) this._state.absorbLastFewBits(this._delimitedSuffix);

          var digest = this._state.squeeze(this._hashBitLength / 8);

          if (encoding !== undefined) digest = digest.toString(encoding);

          this._resetState();

          return digest;
        } // remove result from memory

      }, {
        key: "_resetState",
        value: function _resetState() {
          this._state.initialize(this._rate, this._capacity);

          return this;
        } // because sometimes we need hash right now and little later

      }, {
        key: "_clone",
        value: function _clone() {
          var clone = new Keccak(this._rate, this._capacity, this._delimitedSuffix, this._hashBitLength, this._options);

          this._state.copy(clone._state);

          clone._finalized = this._finalized;
          return clone;
        }
      }]);

      return Keccak;
    }(Transform$1);
  };

  var keccak$2 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var _require = require('stream'),
      Transform = _require.Transform;

  module.exports = function (KeccakState) {
    return /*#__PURE__*/function (_Transform) {
      _inherits(Shake, _Transform);

      var _super = _createSuper(Shake);

      function Shake(rate, capacity, delimitedSuffix, options) {
        var _this;

        _classCallCheck(this, Shake);

        _this = _super.call(this, options);
        _this._rate = rate;
        _this._capacity = capacity;
        _this._delimitedSuffix = delimitedSuffix;
        _this._options = options;
        _this._state = new KeccakState();

        _this._state.initialize(rate, capacity);

        _this._finalized = false;
        return _this;
      }

      _createClass(Shake, [{
        key: "_transform",
        value: function _transform(chunk, encoding, callback) {
          var error = null;

          try {
            this.update(chunk, encoding);
          } catch (err) {
            error = err;
          }

          callback(error);
        }
      }, {
        key: "_flush",
        value: function _flush() {}
      }, {
        key: "_read",
        value: function _read(size) {
          this.push(this.squeeze(size));
        }
      }, {
        key: "update",
        value: function update(data, encoding) {
          if (!buffer.Buffer.isBuffer(data) && typeof data !== 'string') throw new TypeError('Data must be a string or a buffer');
          if (this._finalized) throw new Error('Squeeze already called');
          if (!buffer.Buffer.isBuffer(data)) data = buffer.Buffer.from(data, encoding);

          this._state.absorb(data);

          return this;
        }
      }, {
        key: "squeeze",
        value: function squeeze(dataByteLength, encoding) {
          if (!this._finalized) {
            this._finalized = true;

            this._state.absorbLastFewBits(this._delimitedSuffix);
          }

          var data = this._state.squeeze(dataByteLength);

          if (encoding !== undefined) data = data.toString(encoding);
          return data;
        }
      }, {
        key: "_resetState",
        value: function _resetState() {
          this._state.initialize(this._rate, this._capacity);

          return this;
        }
      }, {
        key: "_clone",
        value: function _clone() {
          var clone = new Shake(this._rate, this._capacity, this._delimitedSuffix, this._options);

          this._state.copy(clone._state);

          clone._finalized = this._finalized;
          return clone;
        }
      }]);

      return Shake;
    }(Transform);
  };

  var shake = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var createKeccak = /*@__PURE__*/getAugmentedNamespace(keccak$2);

  var createShake = /*@__PURE__*/getAugmentedNamespace(shake);

  var api = function api(KeccakState) {
    var Keccak = createKeccak(KeccakState);
    var Shake = createShake(KeccakState);
    return function (algorithm, options) {
      var hash = typeof algorithm === 'string' ? algorithm.toLowerCase() : algorithm;

      switch (hash) {
        case 'keccak224':
          return new Keccak(1152, 448, null, 224, options);

        case 'keccak256':
          return new Keccak(1088, 512, null, 256, options);

        case 'keccak384':
          return new Keccak(832, 768, null, 384, options);

        case 'keccak512':
          return new Keccak(576, 1024, null, 512, options);

        case 'sha3-224':
          return new Keccak(1152, 448, 0x06, 224, options);

        case 'sha3-256':
          return new Keccak(1088, 512, 0x06, 256, options);

        case 'sha3-384':
          return new Keccak(832, 768, 0x06, 384, options);

        case 'sha3-512':
          return new Keccak(576, 1024, 0x06, 512, options);

        case 'shake128':
          return new Shake(1344, 256, 0x1f, options);

        case 'shake256':
          return new Shake(1088, 512, 0x1f, options);

        default:
          throw new Error('Invald algorithm: ' + algorithm);
      }
    };
  };

  var keccakState = require('./keccak-state-unroll');

  function Keccak() {
    // much faster than `new Array(50)`
    this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.blockSize = null;
    this.count = 0;
    this.squeezing = false;
  }

  Keccak.prototype.initialize = function (rate, capacity) {
    for (var i = 0; i < 50; ++i) {
      this.state[i] = 0;
    }

    this.blockSize = rate / 8;
    this.count = 0;
    this.squeezing = false;
  };

  Keccak.prototype.absorb = function (data) {
    for (var i = 0; i < data.length; ++i) {
      this.state[~~(this.count / 4)] ^= data[i] << 8 * (this.count % 4);
      this.count += 1;

      if (this.count === this.blockSize) {
        keccakState.p1600(this.state);
        this.count = 0;
      }
    }
  };

  Keccak.prototype.absorbLastFewBits = function (bits) {
    this.state[~~(this.count / 4)] ^= bits << 8 * (this.count % 4);
    if ((bits & 0x80) !== 0 && this.count === this.blockSize - 1) keccakState.p1600(this.state);
    this.state[~~((this.blockSize - 1) / 4)] ^= 0x80 << 8 * ((this.blockSize - 1) % 4);
    keccakState.p1600(this.state);
    this.count = 0;
    this.squeezing = true;
  };

  Keccak.prototype.squeeze = function (length) {
    if (!this.squeezing) this.absorbLastFewBits(0x01);
    var output = buffer.Buffer.alloc(length);

    for (var i = 0; i < length; ++i) {
      output[i] = this.state[~~(this.count / 4)] >>> 8 * (this.count % 4) & 0xff;
      this.count += 1;

      if (this.count === this.blockSize) {
        keccakState.p1600(this.state);
        this.count = 0;
      }
    }

    return output;
  };

  Keccak.prototype.copy = function (dest) {
    for (var i = 0; i < 50; ++i) {
      dest.state[i] = this.state[i];
    }

    dest.blockSize = this.blockSize;
    dest.count = this.count;
    dest.squeezing = this.squeezing;
  };

  module.exports = Keccak;

  var keccak$1 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$1 = /*@__PURE__*/getAugmentedNamespace(keccak$1);

  var js = api(require$$1);

  var require$$0 = /*@__PURE__*/getAugmentedNamespace(bindings);

  var keccak = createCommonjsModule(function (module) {
    try {
      module.exports = require$$0;
    } catch (err) {
      module.exports = js;
    }
  });

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

  function verifyChain(hashRoot, hashReveal, length, algorithm) {
    var iterations = length || 64;
    var hashFunction = algorithm || 'keccak256';
    var hash = hashRoot;

    if (hashFunction === 'keccak256') {
      for (var i = 0; i < iterations; i += 1) {
        hash = keccak('keccak256').update(hash).digest('hex');
      }
    } else {
      throw new Error('hash function not implemented');
    }

    return hash === hashReveal;
  }

  var src = {
    HashChain: HashChain,
    HashChains: HashChains,
    verifyChain: verifyChain
  };

  return src;

})));
