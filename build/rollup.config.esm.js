/* eslint-disable */
const pkg = require('../package.json')
const path = require('path')
const {
  getPackages
} = require('@lerna/project')
const css = require('rollup-plugin-css-only')
const {
  nodeResolve
} = require('@rollup/plugin-node-resolve')
const vue = require('rollup-plugin-vue')
const rollup = require('rollup')
const typescript = require('rollup-plugin-typescript2')
const noElPrefixFile = /(utils|directives|hooks|theme)/

const deps = Object.keys(pkg.dependencies)

const runBuild = async () => {
  let index = 0
  const pkgs = await getPackages()
  const inputs = pkgs
    .map(pkg => pkg.name)
    .filter(name =>
      name.includes('@bfr-ui') && !noElPrefixFile.test(name),
    )
  build(inputs[index])

  async function build(name) {
    if (!name) return
    const compName = name.split('@bfr-ui/')[1]
    const inputOptions = {
      input: path.resolve(__dirname, `../packages/${compName}/index.ts`),
      plugins: [
        nodeResolve(),
        css(),
        vue({
          target: 'browser',
          css: false,
        }),
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              declaration: false,
            },
            'exclude': [
              'node_modules',
              '__tests__',
            ],
          },
          abortOnError: false,
        }),
      ],
      external(id) {
        return /^vue/.test(id) ||
          /^@bfr-ui/.test(id) ||
          deps.some(k => new RegExp('^' + k).test(id))
      },
    }
    const getOutDir = () => {
      if (noElPrefixFile.test(name)) {
        return `lib/${compName}`
      }
      return `lib/bfr-${compName}`
    }
    const outOptions = {
      format: 'es',
      dir: getOutDir(),
      // file: getOutFile(),
      paths(id) {
        if (/^@bfr-ui/.test(id)) {
          if (noElPrefixFile.test(id)) return id.replace('@bfr-ui', '..')
          return id.replace('@bfr-ui/', '../bfr-')
        }
      },
    }

    try {
      const bundle = await rollup.rollup(inputOptions)
      await bundle.write(outOptions)
      index++
      if (index < inputs.length) {
        await build(inputs[index])
      }
    } catch (error) {
      console.error(error);
    }
  }
}

runBuild()