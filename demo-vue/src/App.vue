<template>
  <div id="app">
    <h1>HashChains demo</h1>
    <h2>Verify</h2>
    <form>
      <label>HashReveal</label>
      <input name="Reveal" v-model="Reveal" style="width: 100%" @input="verify()" />
      <label>HashChainTerminator</label>
      <input name="ChainTerminator" v-model="ChainTerminator" style="width: 100%" @input="verify()" />
    </form>
    <div style="margin-top: 10px;"><span class="validity" v-bind:class="{valid: valid, invalid: !valid}">{{ result() }}</span></div>
    <div style="height: 40px;"></div>
    <hr />
    <h2>Create</h2>
    <form>
      <label>BIP39 mnemonic phrase</label>
      <input name="mnemonic" v-model="seed" style="width: 100%" @input="create()" />
      <label>BIP39 hexstring</label>
      <input name="mnemonic" v-model="bip39hex" style="width: 100%" disabled />
      <label>Index</label>
      <input type="number" name="index" v-model="index" @input="create()" />
      <label>HashFunction</label>
      <select name="hash">
        <option value="keccak256">keccak256</option>
      </select>
    </form>

  <div v-if="this.validMnemonic">
    <h2>HashChain</h2>
    <h3>
      <code>Reveal: {{ this.chains[0].hashReveal }}</code>
      <code>ChainTerminator: {{ this.chains[0].hashChainTerminator }}</code>
    </h3>

    <code>
      <div v-for="(hex, index) in chains[0].hashchain" v-bind:key="index">
        {{index}}: {{hex}}
      </div>
    </code>
  </div>
  <div v-if="!this.validMnemonic" style="margin-top: 10px;">
    <span class="validity invalid">INVALID BIP39 MNEMONIC</span>
  </div>
  </div>
</template>

<script>
import { HashChains, verifyChain, mnemonicToHexstringSync, validateMnemonic } from './../../src/index'

export default {
  data() {
    return {
      seed: "essay shadow creek eager legal just bench exchange miracle work grace vivid load shed genre angry success guide film spray hotel digital barrel grab",
      Reveal: "42bc241ba4045c96f6b71f999b3373942f2e7c031a7c11a3cbefb10d09971961",
      ChainTerminator: "10373abc181dd10a4cf8e39703616f3c0187f26ccf64cb46eb060a8b0ac92f3f",
      index: 0,
      bip39hex: '0000',
      valid: false,
      chains: [{}],
      validMnemonic: true,
    };
  },
  created() {
    this.verify()
    this.create()
  },
  methods: {
    create() {
      if (validateMnemonic(this.seed)) {
        const hex = mnemonicToHexstringSync(this.seed)
        this.bip39hex = hex
        const hcs = new HashChains(hex, 1, this.index);
        console.log(hcs);
        this.chains = hcs.chains
        this.validMnemonic = true
      } else {
        this.chains = [{}]
        this.validMnemonic = false
        this.bip39hex = 'enter a valid bip39 mnemonic phrase'
      }
    },
    verify() {
      // only verify if valid hexstring
      if (this.Reveal.length % 2 === 0 && this.ChainTerminator.length % 2 === 0) {
        this.valid = verifyChain(this.Reveal, this.ChainTerminator)
      } else {
        this.valid = false
      }
    },
    result() {
      return this.valid ? 'VALID' : 'INVALID'
    },
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin: 60px;
}

h1 {
  text-align: center;
}

a,
button {
  color: #fff;
}

button {
  background: #4aafff;
  border: solid 1px;
  font: inherit;
  padding: 0.75em 2em;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background: #3196e6;
}

input {
  background: none;
  border: solid 1px;
  font: inherit;
  padding: 0.75em 0.75em;
}

select {
  width: auto;
  font: inherit;
  padding: 0.75em 0.75em;
}

label {
  margin-top: 20px;
  display: block;
  text-align: left;
}

code {
  display: block;
  margin-top: 20px;
}

.validity {
  font-weight: 700;
  font-size: 2em;
  color: white;
  padding: 5px 15px 5px 15px;
}
.invalid {
  background: red;
}
.valid {
  background: green;
}
</style>
