/* @theqrl/hashchains v0.1.3 - Copyright (C) Die QRL Stiftung. License: MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('stream'), require('fs'), require('path'), require('os')) :
  typeof define === 'function' && define.amd ? define(['stream', 'fs', 'path', 'os'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.require$$0, global.fs, global.path, global.os));
}(this, (function (require$$0, fs, path, os) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
  var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
  var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
  var os__default = /*#__PURE__*/_interopDefaultLegacy(os);

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  function commonjsRequire (target) {
  	throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
  }

  const { Transform: Transform$1 } = require$$0__default['default'];

  var keccak$2 = (KeccakState) => class Keccak extends Transform$1 {
    constructor (rate, capacity, delimitedSuffix, hashBitLength, options) {
      super(options);

      this._rate = rate;
      this._capacity = capacity;
      this._delimitedSuffix = delimitedSuffix;
      this._hashBitLength = hashBitLength;
      this._options = options;

      this._state = new KeccakState();
      this._state.initialize(rate, capacity);
      this._finalized = false;
    }

    _transform (chunk, encoding, callback) {
      let error = null;
      try {
        this.update(chunk, encoding);
      } catch (err) {
        error = err;
      }

      callback(error);
    }

    _flush (callback) {
      let error = null;
      try {
        this.push(this.digest());
      } catch (err) {
        error = err;
      }

      callback(error);
    }

    update (data, encoding) {
      if (!Buffer.isBuffer(data) && typeof data !== 'string') throw new TypeError('Data must be a string or a buffer')
      if (this._finalized) throw new Error('Digest already called')
      if (!Buffer.isBuffer(data)) data = Buffer.from(data, encoding);

      this._state.absorb(data);

      return this
    }

    digest (encoding) {
      if (this._finalized) throw new Error('Digest already called')
      this._finalized = true;

      if (this._delimitedSuffix) this._state.absorbLastFewBits(this._delimitedSuffix);
      let digest = this._state.squeeze(this._hashBitLength / 8);
      if (encoding !== undefined) digest = digest.toString(encoding);

      this._resetState();

      return digest
    }

    // remove result from memory
    _resetState () {
      this._state.initialize(this._rate, this._capacity);
      return this
    }

    // because sometimes we need hash right now and little later
    _clone () {
      const clone = new Keccak(this._rate, this._capacity, this._delimitedSuffix, this._hashBitLength, this._options);
      this._state.copy(clone._state);
      clone._finalized = this._finalized;

      return clone
    }
  };

  const { Transform } = require$$0__default['default'];

  var shake = (KeccakState) => class Shake extends Transform {
    constructor (rate, capacity, delimitedSuffix, options) {
      super(options);

      this._rate = rate;
      this._capacity = capacity;
      this._delimitedSuffix = delimitedSuffix;
      this._options = options;

      this._state = new KeccakState();
      this._state.initialize(rate, capacity);
      this._finalized = false;
    }

    _transform (chunk, encoding, callback) {
      let error = null;
      try {
        this.update(chunk, encoding);
      } catch (err) {
        error = err;
      }

      callback(error);
    }

    _flush () {}

    _read (size) {
      this.push(this.squeeze(size));
    }

    update (data, encoding) {
      if (!Buffer.isBuffer(data) && typeof data !== 'string') throw new TypeError('Data must be a string or a buffer')
      if (this._finalized) throw new Error('Squeeze already called')
      if (!Buffer.isBuffer(data)) data = Buffer.from(data, encoding);

      this._state.absorb(data);

      return this
    }

    squeeze (dataByteLength, encoding) {
      if (!this._finalized) {
        this._finalized = true;
        this._state.absorbLastFewBits(this._delimitedSuffix);
      }

      let data = this._state.squeeze(dataByteLength);
      if (encoding !== undefined) data = data.toString(encoding);

      return data
    }

    _resetState () {
      this._state.initialize(this._rate, this._capacity);
      return this
    }

    _clone () {
      const clone = new Shake(this._rate, this._capacity, this._delimitedSuffix, this._options);
      this._state.copy(clone._state);
      clone._finalized = this._finalized;

      return clone
    }
  };

  var api = function (KeccakState) {
    const Keccak = keccak$2(KeccakState);
    const Shake = shake(KeccakState);

    return function (algorithm, options) {
      const hash = typeof algorithm === 'string' ? algorithm.toLowerCase() : algorithm;
      switch (hash) {
        case 'keccak224': return new Keccak(1152, 448, null, 224, options)
        case 'keccak256': return new Keccak(1088, 512, null, 256, options)
        case 'keccak384': return new Keccak(832, 768, null, 384, options)
        case 'keccak512': return new Keccak(576, 1024, null, 512, options)

        case 'sha3-224': return new Keccak(1152, 448, 0x06, 224, options)
        case 'sha3-256': return new Keccak(1088, 512, 0x06, 256, options)
        case 'sha3-384': return new Keccak(832, 768, 0x06, 384, options)
        case 'sha3-512': return new Keccak(576, 1024, 0x06, 512, options)

        case 'shake128': return new Shake(1344, 256, 0x1f, options)
        case 'shake256': return new Shake(1088, 512, 0x1f, options)

        default: throw new Error('Invald algorithm: ' + algorithm)
      }
    }
  };

  // Workaround to fix webpack's build warnings: 'the request of a dependency is an expression'
  var runtimeRequire = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : commonjsRequire; // eslint-disable-line

  var vars = (process.config && process.config.variables) || {};
  var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
  var abi = process.versions.modules; // TODO: support old node where this is undef
  var runtime = isElectron() ? 'electron' : 'node';
  var arch = os__default['default'].arch();
  var platform = os__default['default'].platform();
  var libc = process.env.LIBC || (isAlpine(platform) ? 'musl' : 'glibc');
  var armv = process.env.ARM_VERSION || (arch === 'arm64' ? '8' : vars.arm_version) || '';
  var uv = (process.versions.uv || '').split('.')[0];

  var nodeGypBuild = load;

  function load (dir) {
    return runtimeRequire(load.path(dir))
  }

  load.path = function (dir) {
    dir = path__default['default'].resolve(dir || '.');

    try {
      var name = runtimeRequire(path__default['default'].join(dir, 'package.json')).name.toUpperCase().replace(/-/g, '_');
      if (process.env[name + '_PREBUILD']) dir = process.env[name + '_PREBUILD'];
    } catch (err) {}

    if (!prebuildsOnly) {
      var release = getFirst(path__default['default'].join(dir, 'build/Release'), matchBuild);
      if (release) return release

      var debug = getFirst(path__default['default'].join(dir, 'build/Debug'), matchBuild);
      if (debug) return debug
    }

    var prebuild = resolve(dir);
    if (prebuild) return prebuild

    var nearby = resolve(path__default['default'].dirname(process.execPath));
    if (nearby) return nearby

    var target = [
      'platform=' + platform,
      'arch=' + arch,
      'runtime=' + runtime,
      'abi=' + abi,
      'uv=' + uv,
      armv ? 'armv=' + armv : '',
      'libc=' + libc,
      'node=' + process.versions.node,
      (process.versions && process.versions.electron) ? 'electron=' + process.versions.electron : '',
      typeof __webpack_require__ === 'function' ? 'webpack=true' : '' // eslint-disable-line
    ].filter(Boolean).join(' ');

    throw new Error('No native build was found for ' + target + '\n    loaded from: ' + dir + '\n')

    function resolve (dir) {
      // Find most specific flavor first
      var prebuilds = path__default['default'].join(dir, 'prebuilds', platform + '-' + arch);
      var parsed = readdirSync(prebuilds).map(parseTags);
      var candidates = parsed.filter(matchTags(runtime, abi));
      var winner = candidates.sort(compareTags(runtime))[0];
      if (winner) return path__default['default'].join(prebuilds, winner.file)
    }
  };

  function readdirSync (dir) {
    try {
      return fs__default['default'].readdirSync(dir)
    } catch (err) {
      return []
    }
  }

  function getFirst (dir, filter) {
    var files = readdirSync(dir).filter(filter);
    return files[0] && path__default['default'].join(dir, files[0])
  }

  function matchBuild (name) {
    return /\.node$/.test(name)
  }

  function parseTags (file) {
    var arr = file.split('.');
    var extension = arr.pop();
    var tags = { file: file, specificity: 0 };

    if (extension !== 'node') return

    for (var i = 0; i < arr.length; i++) {
      var tag = arr[i];

      if (tag === 'node' || tag === 'electron' || tag === 'node-webkit') {
        tags.runtime = tag;
      } else if (tag === 'napi') {
        tags.napi = true;
      } else if (tag.slice(0, 3) === 'abi') {
        tags.abi = tag.slice(3);
      } else if (tag.slice(0, 2) === 'uv') {
        tags.uv = tag.slice(2);
      } else if (tag.slice(0, 4) === 'armv') {
        tags.armv = tag.slice(4);
      } else if (tag === 'glibc' || tag === 'musl') {
        tags.libc = tag;
      } else {
        continue
      }

      tags.specificity++;
    }

    return tags
  }

  function matchTags (runtime, abi) {
    return function (tags) {
      if (tags == null) return false
      if (tags.runtime !== runtime && !runtimeAgnostic(tags)) return false
      if (tags.abi !== abi && !tags.napi) return false
      if (tags.uv && tags.uv !== uv) return false
      if (tags.armv && tags.armv !== armv) return false
      if (tags.libc && tags.libc !== libc) return false

      return true
    }
  }

  function runtimeAgnostic (tags) {
    return tags.runtime === 'node' && tags.napi
  }

  function compareTags (runtime) {
    // Precedence: non-agnostic runtime, abi over napi, then by specificity.
    return function (a, b) {
      if (a.runtime !== b.runtime) {
        return a.runtime === runtime ? -1 : 1
      } else if (a.abi !== b.abi) {
        return a.abi ? -1 : 1
      } else if (a.specificity !== b.specificity) {
        return a.specificity > b.specificity ? -1 : 1
      } else {
        return 0
      }
    }
  }

  function isElectron () {
    if (process.versions && process.versions.electron) return true
    if (process.env.ELECTRON_RUN_AS_NODE) return true
    return typeof window !== 'undefined' && window.process && window.process.type === 'renderer'
  }

  function isAlpine (platform) {
    return platform === 'linux' && fs__default['default'].existsSync('/etc/alpine-release')
  }

  // Exposed for unit tests
  // TODO: move to lib
  load.parseTags = parseTags;
  load.matchTags = matchTags;
  load.compareTags = compareTags;

  var bindings = api(nodeGypBuild(__dirname));

  const P1600_ROUND_CONSTANTS = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649, 0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0, 2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771, 2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648, 2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];

  var p1600 = function (s) {
    for (let round = 0; round < 24; ++round) {
      // theta
      const lo0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
      const hi0 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
      const lo1 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
      const hi1 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
      const lo2 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
      const hi2 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
      const lo3 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
      const hi3 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
      const lo4 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
      const hi4 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

      let lo = lo4 ^ (lo1 << 1 | hi1 >>> 31);
      let hi = hi4 ^ (hi1 << 1 | lo1 >>> 31);
      const t1slo0 = s[0] ^ lo;
      const t1shi0 = s[1] ^ hi;
      const t1slo5 = s[10] ^ lo;
      const t1shi5 = s[11] ^ hi;
      const t1slo10 = s[20] ^ lo;
      const t1shi10 = s[21] ^ hi;
      const t1slo15 = s[30] ^ lo;
      const t1shi15 = s[31] ^ hi;
      const t1slo20 = s[40] ^ lo;
      const t1shi20 = s[41] ^ hi;
      lo = lo0 ^ (lo2 << 1 | hi2 >>> 31);
      hi = hi0 ^ (hi2 << 1 | lo2 >>> 31);
      const t1slo1 = s[2] ^ lo;
      const t1shi1 = s[3] ^ hi;
      const t1slo6 = s[12] ^ lo;
      const t1shi6 = s[13] ^ hi;
      const t1slo11 = s[22] ^ lo;
      const t1shi11 = s[23] ^ hi;
      const t1slo16 = s[32] ^ lo;
      const t1shi16 = s[33] ^ hi;
      const t1slo21 = s[42] ^ lo;
      const t1shi21 = s[43] ^ hi;
      lo = lo1 ^ (lo3 << 1 | hi3 >>> 31);
      hi = hi1 ^ (hi3 << 1 | lo3 >>> 31);
      const t1slo2 = s[4] ^ lo;
      const t1shi2 = s[5] ^ hi;
      const t1slo7 = s[14] ^ lo;
      const t1shi7 = s[15] ^ hi;
      const t1slo12 = s[24] ^ lo;
      const t1shi12 = s[25] ^ hi;
      const t1slo17 = s[34] ^ lo;
      const t1shi17 = s[35] ^ hi;
      const t1slo22 = s[44] ^ lo;
      const t1shi22 = s[45] ^ hi;
      lo = lo2 ^ (lo4 << 1 | hi4 >>> 31);
      hi = hi2 ^ (hi4 << 1 | lo4 >>> 31);
      const t1slo3 = s[6] ^ lo;
      const t1shi3 = s[7] ^ hi;
      const t1slo8 = s[16] ^ lo;
      const t1shi8 = s[17] ^ hi;
      const t1slo13 = s[26] ^ lo;
      const t1shi13 = s[27] ^ hi;
      const t1slo18 = s[36] ^ lo;
      const t1shi18 = s[37] ^ hi;
      const t1slo23 = s[46] ^ lo;
      const t1shi23 = s[47] ^ hi;
      lo = lo3 ^ (lo0 << 1 | hi0 >>> 31);
      hi = hi3 ^ (hi0 << 1 | lo0 >>> 31);
      const t1slo4 = s[8] ^ lo;
      const t1shi4 = s[9] ^ hi;
      const t1slo9 = s[18] ^ lo;
      const t1shi9 = s[19] ^ hi;
      const t1slo14 = s[28] ^ lo;
      const t1shi14 = s[29] ^ hi;
      const t1slo19 = s[38] ^ lo;
      const t1shi19 = s[39] ^ hi;
      const t1slo24 = s[48] ^ lo;
      const t1shi24 = s[49] ^ hi;

      // rho & pi
      const t2slo0 = t1slo0;
      const t2shi0 = t1shi0;
      const t2slo16 = (t1shi5 << 4 | t1slo5 >>> 28);
      const t2shi16 = (t1slo5 << 4 | t1shi5 >>> 28);
      const t2slo7 = (t1slo10 << 3 | t1shi10 >>> 29);
      const t2shi7 = (t1shi10 << 3 | t1slo10 >>> 29);
      const t2slo23 = (t1shi15 << 9 | t1slo15 >>> 23);
      const t2shi23 = (t1slo15 << 9 | t1shi15 >>> 23);
      const t2slo14 = (t1slo20 << 18 | t1shi20 >>> 14);
      const t2shi14 = (t1shi20 << 18 | t1slo20 >>> 14);
      const t2slo10 = (t1slo1 << 1 | t1shi1 >>> 31);
      const t2shi10 = (t1shi1 << 1 | t1slo1 >>> 31);
      const t2slo1 = (t1shi6 << 12 | t1slo6 >>> 20);
      const t2shi1 = (t1slo6 << 12 | t1shi6 >>> 20);
      const t2slo17 = (t1slo11 << 10 | t1shi11 >>> 22);
      const t2shi17 = (t1shi11 << 10 | t1slo11 >>> 22);
      const t2slo8 = (t1shi16 << 13 | t1slo16 >>> 19);
      const t2shi8 = (t1slo16 << 13 | t1shi16 >>> 19);
      const t2slo24 = (t1slo21 << 2 | t1shi21 >>> 30);
      const t2shi24 = (t1shi21 << 2 | t1slo21 >>> 30);
      const t2slo20 = (t1shi2 << 30 | t1slo2 >>> 2);
      const t2shi20 = (t1slo2 << 30 | t1shi2 >>> 2);
      const t2slo11 = (t1slo7 << 6 | t1shi7 >>> 26);
      const t2shi11 = (t1shi7 << 6 | t1slo7 >>> 26);
      const t2slo2 = (t1shi12 << 11 | t1slo12 >>> 21);
      const t2shi2 = (t1slo12 << 11 | t1shi12 >>> 21);
      const t2slo18 = (t1slo17 << 15 | t1shi17 >>> 17);
      const t2shi18 = (t1shi17 << 15 | t1slo17 >>> 17);
      const t2slo9 = (t1shi22 << 29 | t1slo22 >>> 3);
      const t2shi9 = (t1slo22 << 29 | t1shi22 >>> 3);
      const t2slo5 = (t1slo3 << 28 | t1shi3 >>> 4);
      const t2shi5 = (t1shi3 << 28 | t1slo3 >>> 4);
      const t2slo21 = (t1shi8 << 23 | t1slo8 >>> 9);
      const t2shi21 = (t1slo8 << 23 | t1shi8 >>> 9);
      const t2slo12 = (t1slo13 << 25 | t1shi13 >>> 7);
      const t2shi12 = (t1shi13 << 25 | t1slo13 >>> 7);
      const t2slo3 = (t1slo18 << 21 | t1shi18 >>> 11);
      const t2shi3 = (t1shi18 << 21 | t1slo18 >>> 11);
      const t2slo19 = (t1shi23 << 24 | t1slo23 >>> 8);
      const t2shi19 = (t1slo23 << 24 | t1shi23 >>> 8);
      const t2slo15 = (t1slo4 << 27 | t1shi4 >>> 5);
      const t2shi15 = (t1shi4 << 27 | t1slo4 >>> 5);
      const t2slo6 = (t1slo9 << 20 | t1shi9 >>> 12);
      const t2shi6 = (t1shi9 << 20 | t1slo9 >>> 12);
      const t2slo22 = (t1shi14 << 7 | t1slo14 >>> 25);
      const t2shi22 = (t1slo14 << 7 | t1shi14 >>> 25);
      const t2slo13 = (t1slo19 << 8 | t1shi19 >>> 24);
      const t2shi13 = (t1shi19 << 8 | t1slo19 >>> 24);
      const t2slo4 = (t1slo24 << 14 | t1shi24 >>> 18);
      const t2shi4 = (t1shi24 << 14 | t1slo24 >>> 18);

      // chi
      s[0] = t2slo0 ^ (~t2slo1 & t2slo2);
      s[1] = t2shi0 ^ (~t2shi1 & t2shi2);
      s[10] = t2slo5 ^ (~t2slo6 & t2slo7);
      s[11] = t2shi5 ^ (~t2shi6 & t2shi7);
      s[20] = t2slo10 ^ (~t2slo11 & t2slo12);
      s[21] = t2shi10 ^ (~t2shi11 & t2shi12);
      s[30] = t2slo15 ^ (~t2slo16 & t2slo17);
      s[31] = t2shi15 ^ (~t2shi16 & t2shi17);
      s[40] = t2slo20 ^ (~t2slo21 & t2slo22);
      s[41] = t2shi20 ^ (~t2shi21 & t2shi22);
      s[2] = t2slo1 ^ (~t2slo2 & t2slo3);
      s[3] = t2shi1 ^ (~t2shi2 & t2shi3);
      s[12] = t2slo6 ^ (~t2slo7 & t2slo8);
      s[13] = t2shi6 ^ (~t2shi7 & t2shi8);
      s[22] = t2slo11 ^ (~t2slo12 & t2slo13);
      s[23] = t2shi11 ^ (~t2shi12 & t2shi13);
      s[32] = t2slo16 ^ (~t2slo17 & t2slo18);
      s[33] = t2shi16 ^ (~t2shi17 & t2shi18);
      s[42] = t2slo21 ^ (~t2slo22 & t2slo23);
      s[43] = t2shi21 ^ (~t2shi22 & t2shi23);
      s[4] = t2slo2 ^ (~t2slo3 & t2slo4);
      s[5] = t2shi2 ^ (~t2shi3 & t2shi4);
      s[14] = t2slo7 ^ (~t2slo8 & t2slo9);
      s[15] = t2shi7 ^ (~t2shi8 & t2shi9);
      s[24] = t2slo12 ^ (~t2slo13 & t2slo14);
      s[25] = t2shi12 ^ (~t2shi13 & t2shi14);
      s[34] = t2slo17 ^ (~t2slo18 & t2slo19);
      s[35] = t2shi17 ^ (~t2shi18 & t2shi19);
      s[44] = t2slo22 ^ (~t2slo23 & t2slo24);
      s[45] = t2shi22 ^ (~t2shi23 & t2shi24);
      s[6] = t2slo3 ^ (~t2slo4 & t2slo0);
      s[7] = t2shi3 ^ (~t2shi4 & t2shi0);
      s[16] = t2slo8 ^ (~t2slo9 & t2slo5);
      s[17] = t2shi8 ^ (~t2shi9 & t2shi5);
      s[26] = t2slo13 ^ (~t2slo14 & t2slo10);
      s[27] = t2shi13 ^ (~t2shi14 & t2shi10);
      s[36] = t2slo18 ^ (~t2slo19 & t2slo15);
      s[37] = t2shi18 ^ (~t2shi19 & t2shi15);
      s[46] = t2slo23 ^ (~t2slo24 & t2slo20);
      s[47] = t2shi23 ^ (~t2shi24 & t2shi20);
      s[8] = t2slo4 ^ (~t2slo0 & t2slo1);
      s[9] = t2shi4 ^ (~t2shi0 & t2shi1);
      s[18] = t2slo9 ^ (~t2slo5 & t2slo6);
      s[19] = t2shi9 ^ (~t2shi5 & t2shi6);
      s[28] = t2slo14 ^ (~t2slo10 & t2slo11);
      s[29] = t2shi14 ^ (~t2shi10 & t2shi11);
      s[38] = t2slo19 ^ (~t2slo15 & t2slo16);
      s[39] = t2shi19 ^ (~t2shi15 & t2shi16);
      s[48] = t2slo24 ^ (~t2slo20 & t2slo21);
      s[49] = t2shi24 ^ (~t2shi20 & t2shi21);

      // iota
      s[0] ^= P1600_ROUND_CONSTANTS[round * 2];
      s[1] ^= P1600_ROUND_CONSTANTS[round * 2 + 1];
    }
  };

  var keccakStateUnroll = {
  	p1600: p1600
  };

  function Keccak () {
    // much faster than `new Array(50)`
    this.state = [
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ];

    this.blockSize = null;
    this.count = 0;
    this.squeezing = false;
  }

  Keccak.prototype.initialize = function (rate, capacity) {
    for (let i = 0; i < 50; ++i) this.state[i] = 0;
    this.blockSize = rate / 8;
    this.count = 0;
    this.squeezing = false;
  };

  Keccak.prototype.absorb = function (data) {
    for (let i = 0; i < data.length; ++i) {
      this.state[~~(this.count / 4)] ^= data[i] << (8 * (this.count % 4));
      this.count += 1;
      if (this.count === this.blockSize) {
        keccakStateUnroll.p1600(this.state);
        this.count = 0;
      }
    }
  };

  Keccak.prototype.absorbLastFewBits = function (bits) {
    this.state[~~(this.count / 4)] ^= bits << (8 * (this.count % 4));
    if ((bits & 0x80) !== 0 && this.count === (this.blockSize - 1)) keccakStateUnroll.p1600(this.state);
    this.state[~~((this.blockSize - 1) / 4)] ^= 0x80 << (8 * ((this.blockSize - 1) % 4));
    keccakStateUnroll.p1600(this.state);
    this.count = 0;
    this.squeezing = true;
  };

  Keccak.prototype.squeeze = function (length) {
    if (!this.squeezing) this.absorbLastFewBits(0x01);

    const output = Buffer.alloc(length);
    for (let i = 0; i < length; ++i) {
      output[i] = (this.state[~~(this.count / 4)] >>> (8 * (this.count % 4))) & 0xff;
      this.count += 1;
      if (this.count === this.blockSize) {
        keccakStateUnroll.p1600(this.state);
        this.count = 0;
      }
    }

    return output
  };

  Keccak.prototype.copy = function (dest) {
    for (let i = 0; i < 50; ++i) dest.state[i] = this.state[i];
    dest.blockSize = this.blockSize;
    dest.count = this.count;
    dest.squeezing = this.squeezing;
  };

  var keccak$1 = Keccak;

  var js = api(keccak$1);

  var keccak = createCommonjsModule(function (module) {
  try {
    module.exports = bindings;
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

  window.HashChains = HashChains;
  window.HashChain = HashChain;

})));
