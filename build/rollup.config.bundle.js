/* eslint-disable @typescript-eslint/no-var-requires */
const rollup = require('rollup');
const fs = require('fs');
// const path = require('path')
const json = require('@rollup/plugin-json');
const typescript = require('rollup-plugin-typescript2');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const vue = require('rollup-plugin-vue');
const { terser } = require('rollup-plugin-terser');
const deps = Object.keys(require('../package.json').dependencies);
// const args = process.argv.pop()
// const projectPath = `./packages/${args}`
const projectPath = './packages/bfr-ui';
const extensions = ['.js', '.ts'];
fs.rmdirSync(`${projectPath}/lib`, { recursive: true });
const inputOptions =  {
  input: [`${projectPath}/index.ts`],
  plugins: [
    terser(),
    typescript({
      tsconfigOverride: {
        'include': [
          'packages/**/*',
          'typings/vue-shim.d.ts',
        ],
        'exclude': [
          'node_modules',
          'packages/**/__tests__',
        ],
      },
      abortOnError: false,
    }),
    nodeResolve({
      extensions,
      modulesOnly: true,
      preferredBuiltins :false,
    }),
    vue({
      target: 'browser',
      css: false,
      exposeFilename: false,
    }),
    json(),
  ],
  external(id) {
    return /^vue/.test(id)
      || deps.some(k => new RegExp('^' + k).test(id));
  },
};
const outputOptions = {
  // dir: 'lib',
  file: 'lib/index.esm.js',
  format: 'es',

};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions); // inputOptions放在这里
  console.log(bundle.watchFiles); // an array of file names this bundle depends on
  await bundle.write(outputOptions); // outputOptions放在这里
}

build();
