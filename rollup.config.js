import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import pkg from './package.json'

const copyright = 'Copyright (C) Die QRL Stiftung. License: MIT'
const banner = `/* @theqrl/hashchains v${pkg.version} - ${copyright} */`

const babelCommonOptions = {
  babelHelpers: 'bundled',
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread'],
}

// const isDev = process.env.NODE_ENV === "development";

export default [
  {
    input: 'src/index.js',
    plugins: [
      resolve(),
      nodePolyfills(),
      babel({
        ...babelCommonOptions,
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: ['ie >= 8'],
              },
              modules: false,
            },
          ],
        ],
      }),
    ].filter(Boolean),
    output: {
      globals: {
        stream: 'stream',
      },
      banner,
      name: 'HashChains',
      file: pkg.umd,
      format: 'umd',
    },
  },
  {
    input: 'src/index.js',
    plugins: [
      resolve(),
      nodePolyfills(),
      babel({
        ...babelCommonOptions,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                browsers: ['last 2 versions'],
              },
              modules: false,
            },
          ],
        ],
      }),
    ],
    output: {
      banner,
      format: 'es',
      file: pkg.esm,
    },
  },
]
