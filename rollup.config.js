import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'

const copyright = 'Copyright (C) Die QRL Stiftung. License: MIT'
const banner = `/* @theqrl/hashchains v${pkg.version} - ${copyright} */`

const babelCommonOptions = {
  exclude: ['node_modules/**'],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread'],
}

// const isDev = process.env.NODE_ENV === "development";

export default [
  {
    input: 'src/index.js',
    plugins: [
      resolve({
        keccak: true
      }),
      babel({
        ...babelCommonOptions,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                browsers: ['ie >= 8'],
              },
              modules: false,
            },
          ],
        ],
      }),
      commonjs({
        include: 'node_modules/**'
      }),
    ].filter(Boolean),
    output: {
      banner,
      name: 'HashChains',
      file: pkg.browser,
      format: 'umd',
    },
  },
  {
    input: 'src/index.js',
    plugins: [
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
    ].filter(Boolean),
    output: {
      banner,
      file: pkg.main,
      format: 'cjs',
    },
  },
  {
    input: 'src/index.js',
    plugins: [
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
      file: pkg.module,
    },
  },
]
