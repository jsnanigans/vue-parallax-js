#BETA
- values range changed from 0-1 to 0-10
- you can define "percentage" like this: v-parallax="{speed: 3, percentage: 1}"  more more fine control

#vue-parallax-js
vue component for parallax effect on elements.
- no dependencies.
- lightweight

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
<h1 v-parallax="2">vue-parallax-js</h1>
```

##Options and Modifiers
see [documentation](https://jsnanigans.github.io/vue-parallax-js/)
