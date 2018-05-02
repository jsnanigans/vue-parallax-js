import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import flow from 'rollup-plugin-flow'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

export default {
  input: 'src/vue-parallax-js.js',
  output: [
    {
      file: 'lib/vue-parallax-js.es.js',
      format: 'es'
    },
    {
      file: 'lib/vue-parallax-js.cjs.js',
      format: 'cjs'
    },
    {
      file: 'lib/vue-parallax-js.js',
      format: 'iife',
      name: 'ParallaxJS'
    }
  ],
  plugins: [builtins(), resolve(), flow(), commonjs(), babel(), uglify({}, minify)],
  external: ['postcss', 'postcss-selector-parser', 'fs']
}
