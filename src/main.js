let parallaxjs = function (options = {}) {

  // options = {
  //   ...options
  // }

  let pause = false
  let elements = []
  let screenY
  let posY
  let oldY
  let api = {}

  // helper functions
  const transformProp = window.transformProp || (function(){
    var testEl = document.createElement('div');
    if (testEl.style.transform == null) {
      var vendors = ['Webkit', 'Moz', 'ms'];
      for (var vendor in vendors) {
        if (testEl.style[ vendors[vendor] + 'Transform' ] !== undefined) {
          return vendors[vendor] + 'Transform';
        }
      }
    }
    return 'transform';
  })();

  let rqaf = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame

  let clamp = (v, min, max) => v

  api.loop = rqaf ? rqaf.bind(window) : _ => { setTimeout(_, 1000 / 60) }

  api.setPageY = _ => {
    screenY = window.innerHeight;
  }

  api.setPageScroll = _ => {
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
  }

  api.addElement = (el, binding) => {
    let opt = {
      speed: -2,
      center: false,
      round: true,
      callback: _ => {},
      percentage: false,
      zindex: 0,
    }

    if (typeof binding.value === 'number')
      opt.speed = binding.value

    // console.log(binding)

    var posY = opt.percentage || opt.center ? (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) : 0;
    var blockTop = posY + el.getBoundingClientRect().top;
    var blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;
    var percentage = opt.percentage ? opt.percentage : (posY - blockTop + screenY) / (blockHeight + screenY);
    if(opt.center){ percentage = 0.5; }
    var speed = opt.speed * 10

    speed = speed ? clamp(speed, -13, 13) : speed;

    if (opt.percentage || opt.center) {
      speed = clamp(opt.speed || opt.speed, -5, 5);
    }

    var base = updatePosition(percentage, speed, opt.round);

    var style = el.style.cssText
    var transform = ''

    // console.log({e: el.style})
    let computed = getComputedStyle(el, null)
    // console.log(computed.getPropertyValue('transform'))
    let initialMatrix = computed.getPropertyValue('transform')
    if (initialMatrix.indexOf('matrix(') === 0) {
      initialMatrix = initialMatrix.replace('matrix(', '')
      initialMatrix = initialMatrix.replace(')', '')
      initialMatrix = initialMatrix.split(', ')
    } else {
      initialMatrix = [1, 0, 0, 1, 0, 0]
    }
    // console.log(initialMatrix)
    // let initialTransform = {
    //   rotate:
    // }


    if (style.indexOf('transform') !== -1) {
      // Get the index of the transform
      var index = style.indexOf('transform');

      // Trim the style to the transform point and get the following semi-colon index
      var trimmedStyle = style.slice(index);
      var delimiter = trimmedStyle.indexOf(';');

      // Remove "transform" string and save the attribute
      if (delimiter) {
        transform = ' ' + trimmedStyle.slice(11, delimiter).replace(/\s/g,'');
      } else {
        transform = ' ' + trimmedStyle.slice(11).replace(/\s/g,'');
      }


    }

    elements.push({
      el,
      base,
      top: blockTop,
      height: blockHeight,
      speed,
      style,
      transform,
      zindex: opt.zindex,
      opt,
      initialMatrix
    })

    // elements.push(el)
  }

  var updatePosition = function(percentage, speed, round) {
    var value = (speed * (100 * (1 - percentage)));
    return round ? Math.round(value * 10) / 10 : value;
  }

  api.animate = id => {
    let targets = elements
    if (typeof id === 'number') {
      targets = [elements[id]]
    }

    if (!targets)
      return

    targets.forEach(item => {
      // console.log(item)
      var percentage = ((posY - item.top + screenY) / (item.height + screenY));

      var position = updatePosition(percentage, item.speed, item.opt.round) - item.base;

      var zindex = item.zindex;

      // var translate = 'translate3d(0,' + position + 'px,' + zindex + 'px) ' + item.transform;
      // var translate = 'matrix(1, 0, 0, 1, 0, ' + position + ')';
      let values = item.initialMatrix
      values[5] = position

      var translate = 'matrix(' + values.join(',') + ')';
      item.el.style[transformProp] = translate
      item.el.style.backfaceVisibility = 'hidden'
    })
  }

  return api
}


export default {
  install (Vue, options = {}) {
    var p = parallaxjs(options)
    p.setPageScroll()
    p.setPageY()

    window.addEventListener('scroll', () => {
      p.loop(_ => {
        p.loop(_ => {
          p.setPageScroll()
          p.animate()
        })
      })
    }, {passive: true})
    window.addEventListener('resize', () => {
      p.loop(_ => {
        p.loop(_ => {
          p.setPageScroll()
          p.setPageY()
          p.animate()
        })
      })
    }, {passive: true})

    Vue.prototype.$parallaxjs = p
    window.$parallaxjs = p

    Vue.directive('parallax', {
      bind (el, binding) {
      },
      inserted (el, binding) {
        let id = p.addElement(el, binding)
        p.animate(id)
      },
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
    })
  }
}