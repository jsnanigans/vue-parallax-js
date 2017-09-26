import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  watch: {
    chokidar: {
      // if the chokidar option is given, rollup-watch will
      // use it instead of fs.watch. You will need to install
      // chokidar separately.
      //
      // this options object is passed to chokidar. if you
      // don't have any options, just pass `chokidar: true`
    },

    // include and exclude govern which files to watch. by
    // default, all dependencies will be watched
    exclude: ['node_modules/**']
  },

  output: {
    file: 'dist/vue-parallax-js.js',
    format: 'cjs'
  }
};
