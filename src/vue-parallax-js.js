let parallaxjs = function (options) {
  this.options = options
}

parallaxjs.prototype = {
  items: [],
  active: true,

  setStyle (item, value) {
    if (item.modifiers.centerX)
      value += ' translateX(-50%)'

    let el = item.el;
    let prop = 'Transform';
    el.style["webkit" + prop] = value;
    el.style["moz" + prop] = value;
    el.style["ms" + prop] = value;
  },

  add (el, binding) {
    let value = binding.value
    let arg = binding.arg
    let style = el.currentStyle || window.getComputedStyle(el);

    let height = binding.modifiers.absY ? window.innerHeight : el.clientHeight || el.offsetHeight || el.scrollHeight;
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
      this.items.map((item) => {
        this.setStyle(item, 'translateY(' + 0 + 'px) translateZ(0px)')
      })

      return
    }

    let scrollTop = window.scrollY || window.pageYOffset
    let windowHeight = window.innerHeight
    let windowWidth = window.innerWidth

    this.items.map((item) => {
        let pos = (scrollTop + windowHeight)
        let elH = item.clientHeight

        pos = pos - (elH / 2)
        pos = pos - (windowHeight / 2)
        pos = pos * item.value

        let offset = item.initialOffsetTop
        offset = offset * -1
        offset = offset * item.value
        pos = pos + offset

        pos = pos.toFixed(2)

        this.setStyle(item, 'translateY(' + pos + 'px)')
    })
  }
}

let VueParallaxJs = {
  install (Vue, options = {}) {
    var p = new parallaxjs(options)

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        p.move(p)
      })
    }, {passive: true})
    window.addEventListener('resize', () => {
      requestAnimationFrame(() => {
        p.move(p)
      })
    }, {passive: true})

    Vue.prototype.$parallaxjs = p
    window.$parallaxjs = p
    Vue.directive('parallax', {
      bind (el, binding) {
      },
      inserted (el, binding) {
        p.add(el, binding)
        p.move(p)
      },
    })
  }
}

 module.exports = VueParallaxJs
