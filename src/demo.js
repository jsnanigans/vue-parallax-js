// import Vue and vue-parallax-js
import VueParallaxJs from './main.js' 

// add vue-parallax-js to vue
Vue.use(VueParallaxJs)

new Vue({
  el: '#app',
  data() {
    return {
      title: 'Smooth and Simple Parallax for Vue',
    }
  },

  created() {
  }
})
