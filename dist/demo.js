'use strict';

var parallaxjs = function parallaxjs() {
  var elements = [];
  var screenY = void 0;
  var posY = void 0;
  var api = {};

  // helper functions
  var transformProp = window.transformProp || function () {
    var testEl = document.createElement('div');
    if (testEl.style.transform == null) {
      var vendors = ['Webkit', 'Moz', 'ms'];
      for (var vendor in vendors) {
        if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
          return vendors[vendor] + 'Transform';
        }
      }
    }
    return 'transform';
  }();

  var rqaf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;

  var clamp = function clamp(v, min, max) {
    return v;
  };

  api.loop = rqaf ? rqaf.bind(window) : function (_) {
    setTimeout(_, 1000 / 60);
  };

  api.setPageY = function (_) {
    screenY = window.innerHeight;
  };

  api.setPageScroll = function (_) {
    var oldY = posY;

    if (window.pageYOffset !== undefined) {
      posY = window.pageYOffset;
    } else {
      posY = (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }

    if (oldY != posY) {
      // scroll changed, return true
      return true;
    }

    // scroll did not change
    return false;
  };

  api.addElement = function (el, binding) {
    var opt = {
      speed: -2,
      center: false,
      round: true,
      callback: function callback(_) {},
      percentage: false,
      zindex: 0
    };

    if (typeof binding.value === 'number') opt.speed = binding.value;

    // console.log(binding)

    var posY = opt.percentage || opt.center ? window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop : 0;
    var blockTop = posY + el.getBoundingClientRect().top;
    var blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;
    var percentage = opt.percentage ? opt.percentage : (posY - blockTop + screenY) / (blockHeight + screenY);
    if (opt.center) {
      percentage = 0.5;
    }

    var speed = opt.speed ? clamp(opt.speed, -10, 10) : opt.speed;
    if (opt.percentage || opt.center) {
      speed = clamp(opt.speed || opt.speed, -5, 5);
    }

    var base = updatePosition(percentage, speed, opt.round);

    var style = el.style.cssText;
    var transform = '';

    // console.log({e: el.style})
    var computed = getComputedStyle(el, null);
    console.log(computed.getPropertyValue('transform'));

    if (style.indexOf('transform') !== -1) {
      // Get the index of the transform
      var index = style.indexOf('transform');

      // Trim the style to the transform point and get the following semi-colon index
      var trimmedStyle = style.slice(index);
      var delimiter = trimmedStyle.indexOf(';');

      // Remove "transform" string and save the attribute
      if (delimiter) {
        transform = ' ' + trimmedStyle.slice(11, delimiter).replace(/\s/g, '');
      } else {
        transform = ' ' + trimmedStyle.slice(11).replace(/\s/g, '');
      }
    }

    elements.push({
      el: el,
      base: base,
      top: blockTop,
      height: blockHeight,
      speed: speed,
      style: style,
      transform: transform,
      zindex: opt.zindex,
      opt: opt
    });

    // elements.push(el)
  };

  var updatePosition = function updatePosition(percentage, speed, round) {
    var value = speed * (100 * (1 - percentage));
    return round ? Math.round(value * 10) / 10 : value;
  };

  api.animate = function (id) {
    var targets = elements;
    if (typeof id === 'number') {
      targets = [elements[id]];
    }

    if (!targets) return;

    targets.forEach(function (item) {
      // console.log(item)
      var percentage = (posY - item.top + screenY) / (item.height + screenY);

      var position = updatePosition(percentage, item.speed, item.opt.round) - item.base;

      var zindex = item.zindex;

      var translate = 'translate3d(0,' + position + 'px,' + zindex + 'px) ' + item.transform;
      item.el.style[transformProp] = translate;
      // item.el.style['backfaceVisibility'] = 'hidden'
    });
  };

  return api;
};

var VueParallaxJs = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var p = parallaxjs(options);
    p.setPageScroll();
    p.setPageY();

    window.addEventListener('scroll', function () {
      p.loop(function (_) {
        p.loop(function (_) {
          p.setPageScroll();
          p.animate();
        });
      });
    }, { passive: true });
    window.addEventListener('resize', function () {
      p.loop(function (_) {
        p.loop(function (_) {
          p.setPageScroll();
          p.setPageY();
          p.animate();
        });
      });
    }, { passive: true });

    Vue.prototype.$parallaxjs = p;
    window.$parallaxjs = p;

    Vue.directive('parallax', {
      bind: function bind(el, binding) {},
      inserted: function inserted(el, binding) {
        var id = p.addElement(el, binding);
        p.animate(id);
      }
    }
    // unbind(el, binding) {
    //   p.resetPosition(el)
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

// import Vue and vue-parallax-js
Vue.use(VueParallaxJs);

new Vue({
  el: '#app',
  data: function data() {
    return {
      title: 'Smooth and Simple Parallax for Vue',
      lines: [{ dots: 1 }, { dots: 2 }, { dots: 3 }, { dots: 4 }, { dots: 5 }]
    };
  },
  created: function created() {
    this.lines.map(function (line) {
      var c = line.dots;
      line.dots = [];
      for (var i = 0; i < c; i++) {
        line.dots.push('');
      }
    });
  }
});
