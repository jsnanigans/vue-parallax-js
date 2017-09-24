var parallaxjs = function parallaxjs(options) {

  var posY = 0 // set it to -1 so the animate function gets called at least once
  var screenY = 0
  var pause = false

  this.loop = window.requestAnimationFrame || function(cb) {setTimeout(cb, 1000/60)}

  // check which transform property to use
  this.transformProp = window.transformProp || (function(){
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
  })()

  this.clamp = function(num, min, max) {
    return (num <= min) ? min : ((num >= max) ? max : num);
  }

  this.options = {
    speed: -2,
    center: false,
    round: true,
    callback: function() {},
    ...options
  }

  this.options.speed = this.clamp(this.options.speed, -10, 10)

  this.elements = []

  this.init = _ => {
    screenY = window.innerHeight
    this.setPosition()

    this.elements.forEach(el => {
      blocks.push(this.createBlock(el))
    })

    window.addEventListener('resize', _ => {
      this.animate()
    })

    this.update()

    this.animate()
  }

  this.createBlock = el => {
    let dataPercentage = 0
    let dataSpeed = 0
    let dataZindex = 0

    let posY = dataPercentage || self.options.center ? (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) : 0

    let blockTop = posY + el.getBoundingClientRect().top
    let blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight

    let percentage = dataPercentage ? dataPercentage : (posY - blockTop + screenY) / (blockHeight + screenY)
    if(self.options.center){ percentage = 0.5 }

    let speed
    if (dataPercentage || this.options.center) {
      speed = clamp(dataSpeed || this.options.speed, -5, 5)
    } else {
      speed = dataSpeed ? this.clamp(dataSpeed, -10, 10) : this.options.speed
    }

    let base = this.updatePosition(percentage, speed)

    let style = el.style.cssText
    let transform = ''

    if (style.indexOf('transform') !== -1) {
      let index = style.indexOf('transform')
      let trimmedStyle = style.slice(index)
      let delimiter = trimmedStyle.indexOf(';')

      if (delimiter) {
        transform = ' ' + trimmedStyle.slice(11, delimiter).replace(/\s/g, '')
      } else {
        transform = " " + trimmedStyle.slice(11).replace(/\s/g,'')
      }
    }

    return {
      base,
      speed,
      style,
      transform,
      top: blockTop,
      height: blockHeight,
      zIndex: dataZindex
    }
  }

  this.setPosition = _ => {
    let oldY = posY

    if (window.pageYOffset !== undefined) {
      posY = window.pageXOffset 
    } else {
      posY = (document.documentElement || document.body.parentNode || document.body).scrollTop
    }

    if (oldY !== posY) {
      return true
    }

    return false
  }

  this.updatePosition = (percentage, speed) => {
    var value = (speed * (100 * (1 - percentage)))
    return this.options.round ? Math.round(value * 10) / 10 : value
  }

  this.update = _ => {
    if (this.setPosition() && pause === false) {
      this.animate()
    }

    this.loop(this.update)
  }

  this.animate = _ => {
    this.elements.forEach((item, i) => {
      let percentage = ((posY - blocks[i].top + screenY) / (blocks[i].height + screenY))
      let position = this.updatePosition(percentage, blocks[i].speed) - blocks[i].base
      let zindex = blocks[i].zindex

      let translate = 'translate3d(0,' + position + 'px,' + zindex + 'px) ' + blocks[i].transform
      this.elems[i].style[transformProp] = translate
    })
  }
};


var VueParallaxJs = {
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
    });
  }
};

module.exports = VueParallaxJs;
