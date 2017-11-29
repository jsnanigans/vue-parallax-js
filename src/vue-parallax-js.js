// @flow
const ParallaxJS = function (options) {
  this.options = options
}

ParallaxJS.prototype = {
  items: [],
  active: true,

  // helper functions
  transformProp: window.transformProp || (function () {
    var testEl = document.createElement('div')
    if (testEl.style.transform == null) {
      var vendors = ['Webkit', 'Moz', 'ms']
      for (var vendor in vendors) {
        if (testEl.style[ vendors[vendor] + 'Transform' ] !== undefined) {
          return vendors[vendor] + 'Transform'
        }
      }
    }
    return 'transform'
  })(),

  add (el, binding) {
    const value = binding.value
    const arg = binding.arg
    const style = el.currentStyle || window.getComputedStyle(el)

    if (style.display === 'none') return

    const height = binding.modifiers.absY ? window.innerHeight : el.clientHeight || el.offsetHeight || el.scrollHeight

    el.classList.add(this.options.className || 'vueParallax')

    this.items.push({
      el: el,
      initialOffsetTop: el.offsetTop + el.offsetParent.offsetTop - parseInt(style.marginTop),
      style,
      value,
      arg,
      modifiers: binding.modifiers,
      clientHeight: height,
      count: 0
    })
  },

  move () {
    if (!this.active) return
    if (window.innerWidth < this.options.minWidth || 0) {
      this.items.forEach((item) => {
        item.el.style[this.transformProp] = `tranlateY(0)`
      })

      return
    }

    const scrollTop = window.scrollY || window.pageYOffset
    const windowHeight = window.innerHeight

    this.items.forEach((item) => {
      let pos = (scrollTop + windowHeight)
      const elH = item.clientHeight

      pos = pos - (elH / 2)
      pos = pos - (windowHeight / 2)
      pos = pos * item.value

      let offset = item.initialOffsetTop
      offset = offset * -1
      offset = offset * item.value
      pos = pos + offset

      pos = pos.toFixed(2)

      window.requestAnimationFrame(() => {
        const cx = item.modifiers.centerX ? '-50%' : '0px'
        const props = `translate3d(${cx},${pos}px,0px)`
        item.el.style[this.transformProp] = props
      })
    })
  }
}

export default {
  install (Vue, options = {}) {
    var p = new ParallaxJS(options)

    window.addEventListener('scroll', () => {
      p.move(p)
    }, { passive: true })
    window.addEventListener('resize', () => {
      p.move(p)
    }, { passive: true })

    Vue.prototype.$parallaxjs = p
    window.$parallaxjs = p
    Vue.directive('parallax', {
      bind (el, binding) {
      },
      inserted (el, binding) {
        p.add(el, binding)
        p.move(p)
      }
    })
  }
}
