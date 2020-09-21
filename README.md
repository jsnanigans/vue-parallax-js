# vue-parallax-js
Tiny vue component that adds a directive for parallax effect on elements.
- no dependencies
- lightweight
- 1.3k gzip

## Setup
```bash
npm install --save vue-parallax-js
# or use yarn
yarn add vue-parallax-js
```

in your main JavaScript file
```javascript
// import Vue and vue-parallax-js
import Vue from 'vue'
import VueParallaxJs from 'vue-parallax-js'

// add vue-parallax-js to vue
Vue.use(VueParallaxJs)
```

## Usage
when everything is setup you can use the directive like this:
```vue
<h1 v-parallax="0.2">vue-parallax-js</h1>
```

## Options
```vue
Vue.use(VueParallaxJs, options)
```

```javascript
const options = {
  minWidth: Number,   /* minumum window width for parallax to take effect */
  className: String,  /* this class gets added to all elements
                      that are being animated, by default none */
  container: String,  /* element that actually scrolls, by default it's window */
}
```

## Modifiers
when using the `v-parallax` directive you can also pass some modifiers to configure the instance of vue-parallax-js
```vue
<h1 v-parallax.modifier="0.2">vue-parallax-js</h1>
```
| Modifier | Description |
|---|---|
| centerX | will add `transform: translateX(-50%)` along with the parallax positioning |
| absY | uses the window height instead of the element height for the calculations |