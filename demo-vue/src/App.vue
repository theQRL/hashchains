<template>
  <div id="app">
    <h1>HashChains demo</h1>
    <h2>Verify</h2>
    <form>
      <label>HashRoot</label>
      <input name="root" v-model="root" style="width: 100%" v-change="verify()" />
      <label>HashReveal / ChainTerminator</label>
      <input name="reveal" v-model="reveal" style="width: 100%" v-change="verify()" />
    </form>
    <div style="margin-top: 10px;"><span class="validity" v-bind:class="{valid: valid, invalid: !valid}">{{ result() }}</span></div>
    <div style="height: 40px;"></div>
    <hr />
    <h2>Create</h2>
    <form>
      <label>Mnemonic phrase/hexseed</label>
      <input name="mnemonic" v-model="seed" style="width: 100%" />
      <label>Index</label>
      <input type="number" name="index" v-model="index" v-change="create()" />
      <label>HashFunction</label>
      <select name="hash">
        <option value="keccak256">keccak256</option>
      </select>
    </form>

<!--     <button @click="create">Create HashChain</button> -->
    <h2>HashChain</h2>
    <code>
      <div v-for="(hex, index) in chains[0].hashchain" v-bind:key="index">
        {{index}}: {{hex}}
      </div>
    </code>
  </div>
</template>

<script>
import { HashChains, verifyChain } from './../../src/index'

export default {
  data() {
    return {
      seed: "pen icon first one zulu apple",
      root: "efafeb825f31eab5b524e720a191a2796dbe50f70b477100679a1edab8767c73",
      reveal: "78c2405dcee53aa076b6ad0b3570a4afbc0603e583251e62b0ada4725ef426a1",
      index: 0,
      valid: false,
      chains: [{}]
    };
  },
  methods: {
    create() {
      const hcs = new HashChains(this.seed, 1, this.index);
      console.log(hcs);
      this.chains = hcs.chains
    },
    verify() {
      this.valid = verifyChain(this.root, this.reveal)
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
