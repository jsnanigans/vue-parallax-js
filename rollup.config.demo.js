import babel from 'rollup-plugin-babel'
import server from 'rollup-plugin-server'

export default {
  entry: 'src/demo.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  watch: {
    chokidar: {},
    exclude: ['node_modules/**']
  },

  output: {
    file: 'dist/demo.js',
    format: 'cjs'
  },

  plugins: [
    server('')
  ]
};
