<template>
  <div id="app">
    <h1>HashChains demo</h1>
    <form>
      <label>Mnemonic/seed test</label>
      <input name="mnemonic" v-model="seed" style="width: 100%" />
      <label>Index</label>
      <input type="number" name="index" v-model="index" />
      <label>HashFunction</label>
      <select name="hash">
        <option value="keccak256">keccak256</option>
      </select>
    </form>

    <button @click="create">Create HashChain</button>
    <code>
      {{ chains[0].hashchain }}
    </code>
  </div>
</template>

<script>
import { HashChains } from './../../src/index'

export default {
  data() {
    return {
      seed: "3e3cf03bd6faf803a16622b199744adb65bf5868cab98b72af7826be3cac5f1e",
      index: 0,
      chains: [{}]
    };
  },
  methods: {
    create() {
      const hcs = new HashChains(this.seed, 1, this.index);
      console.log(hcs);
      this.chains = hcs.chains
    }
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
</style>
