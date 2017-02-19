#vue-parallax-js
vue component for parallax effect on elements.
- no dependencies.
- for Vue.js 2
- lightweight
- 1.6 kb minified

##Setup
```bash
npm install --save vue-parallax-js
# or use yarn
# yarn add vue-parallax-js
```

in your main JavaScript file
```javascript
// import Vue and vue-parallax-js
import Vue from 'vue'
import VueParallaxJs from 'vue-parallax-js'

// add vue-parallax-js to vue
Vue.use(VueParallaxJs)
```

##Usage
when everything is setup you can use the directive like this:
```html
<h1 v-parallax="0.2">vue-parallax-js</h1>
```

##Options and Arguments
see [documentation](https://jsnanigans.github.io/vue-parallax-js/#options)
