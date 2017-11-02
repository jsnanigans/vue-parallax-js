var parallaxjs = function parallaxjs(options) {
  this.options = options;
};

parallaxjs.prototype = {
  items: [],
  active: true,

  setStyle: function setStyle(item, value) {
    if (item.modifiers.centerX) value += ' translateX(-50%)';

    var el = item.el;
    var prop = 'Transform';
    el.style["webkit" + prop] = value;
    el.style["moz" + prop] = value;
    el.style["ms" + prop] = value;
  },
  add: function add(el, binding) {
    var value = binding.value;
    var arg = binding.arg;
    var style = el.currentStyle || window.getComputedStyle(el);

    if (style.display === 'none') return;

    el.classList.add('parallaxed');

    var height = binding.modifiers.absY ? window.innerHeight : el.clientHeight || el.offsetHeight || el.scrollHeight;
    this.items.push({
      el: el,
      initialOffsetTop: el.offsetTop + el.offsetParent.offsetTop - parseInt(style.marginTop),
      style: style,
      value: value,
      arg: arg,
      modifiers: binding.modifiers,
      clientHeight: height,
      count: 0
    });
  },
  move: function move() {
    var _this = this;

    if (!this.active) return;
    if (window.innerWidth < this.options.minWidth || 0) {
      this.items.map(function (item) {
        _this.setStyle(item, 'translateY(' + 0 + 'px) translateZ(0px)');
      });

      return;
    }

    var scrollTop = window.scrollY || window.pageYOffset;
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;

    this.items.map(function (item) {
      var pos = scrollTop + windowHeight;
      var elH = item.clientHeight;
      // if (item.count > 50) {
      //   item.count = 0;
      //   elH = item.el.clientHeight || item.el.offsetHeight || item.el.scrollHeight
      // }


      pos = pos - elH / 2;
      pos = pos - windowHeight / 2;
      pos = pos * item.value;

      var offset = item.initialOffsetTop;
      offset = offset * -1;
      offset = offset * item.value;
      pos = pos + offset;

      pos = pos.toFixed(2);

      // item.count++
      _this.setStyle(item, 'translateY(' + pos + 'px)');
    });
  }
};

export default {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var p = new parallaxjs(options);

    window.addEventListener('scroll', function () {
      requestAnimationFrame(function () {
        p.move(p);
      });
    }, { passive: true });
    window.addEventListener('resize', function () {
      requestAnimationFrame(function () {
        p.move(p);
      });
    }, { passive: true });

    Vue.prototype.$parallaxjs = p;
    window.$parallaxjs = p;
    Vue.directive('parallax', {
      bind: function bind(el, binding) {},
      inserted: function inserted(el, binding) {
        p.add(el, binding);
        p.move(p);
      }
    }
    // unbind(el, binding) {
    //   p.remove(el)
    // }
    // bind: parallaxjs.add(parallaxjs),
    // update(value) {
    //  parallaxjs.update(value)
    // },
    // update(el, binding) {
    //   console.log("cup");
    // },
    );
  }
};
