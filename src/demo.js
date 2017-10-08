// import Vue and vue-parallax-js
import VueParallaxJs from './main.js' 

// add vue-parallax-js to vue
Vue.use(VueParallaxJs)

new Vue({
  el: '#app',
  data() {
    return {
      title: 'Smooth and Simple Parallax for Vue',
      lines: [
        {dots: 1},
        {dots: 2},
        {dots: 3},
        {dots: 4},
        {dots: 5},
      ]
    }
  },

  created() {
    this.lines.map(line => {
      let c = line.dots;
      line.dots = []
      for (let i = 0; i < c; i++) {
        line.dots.push('')
      }
    })
  }
})
