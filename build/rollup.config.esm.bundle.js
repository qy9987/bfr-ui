/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const json = require('@rollup/plugin-json');
const typescript = require('rollup-plugin-typescript2');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const vue = require('rollup-plugin-vue');
const { terser } = require('rollup-plugin-terser');
const deps = Object.keys(require('../package.json').dependencies);
export default {
  input: path.resolve(__dirname, '../packages/bfr-ui/index.ts'),
  output: {
    file: 'lib/index.esm.js',
    format: 'es',
  },
  plugins: [
    terser(),
    nodeResolve(),
    json(),
    vue({
      target: 'browser',
      css: false,
      exposeFilename: false,
    }),
    typescript({
      tsconfigOverride: {
        'include': [
          'packages/**/*',
          'typings/vue-shim.d.ts',
        ],
        'exclude': [
          'node_modules',
          'packages/**/__tests__/*',
        ],
      },
      abortOnError: false,
    }),
  ],
  external(id) {
    return /^vue/.test(id)
      || deps.some(k => new RegExp('^' + k).test(id));
  },
};
