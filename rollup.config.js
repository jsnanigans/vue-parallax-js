import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/vue-parallax-js.js',
  output: [
    {
      file: 'lib/vue-parallax-js.es.js',
      format: 'es'
    },
    {
      file: 'lib/vue-parallax-js.cjs.js',
      format: 'cjs',
      exports: 'default'
    },
    {
      file: 'lib/vue-parallax-js.js',
      format: 'iife',
      name: 'ParallaxJS'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser()
  ],
  external: ['vue']
}
