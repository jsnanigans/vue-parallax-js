let gop = {};

const vueParallaxJS = function(el, options) {
    var self = Object.create(vueParallaxJS.prototype);

    var posY = 0;
    var screenY = 0;
    var blocks = [];
    var pause = false;

    let active = true;
    let minWidth = gop.minWidth || 0;

    var loop = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
            setTimeout(callback, 1000 / 60);
        };

    // check which transform property to use
    var transformProp = window.transformProp || (function() {
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
    })();

    // limit the given number in the range [min, max]
    var clamp = function(num, min, max) {
        return (num <= min) ? min : ((num >= max) ? max : num);
    };

    self.options = {
        speed: -2,
        center: false,
        round: true,
    };


    // self.options.speed = clamp(self.options.speed, -10, 10);


    let elements = [el]

    // Now query selector
    if (elements.length > 0) {
        self.elems = elements;
    }

    // The elements don't exist
    else {
        throw new Error("The elements you're trying to select don't exist.");
    }


    // Let's kick this script off
    // Build array for cached element values
    // Bind scroll and resize to animate method
    var init = function() {
        screenY = window.innerHeight;
        setPosition();

        // Get and cache initial position of all elements
        for (var i = 0; i < self.elems.length; i++) {
            var block = createBlock(self.elems[i], options);
            blocks.push(block);
        }

        window.addEventListener('resize', function() {
            animate();
        });

        // Start the loop
        update();
        animate();
    };


    var createBlock = function(el, options) {
        var dataPercentage = options.percentage;
        var dataSpeed = options.speed;


        var posY = dataPercentage || self.options.center ? (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) : 0;

        var blockTop = posY + el.getBoundingClientRect().top;
        var blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

        var percentage = dataPercentage ? dataPercentage : (posY - blockTop + screenY) / (blockHeight + screenY);
        if (self.options.center) {
            percentage = 0.5;
        }

        var speed = dataSpeed ? clamp(dataSpeed, -10, 10) : self.options.speed;
        if (dataPercentage || self.options.center) {
            speed = clamp(dataSpeed || self.options.speed, -5, 5);
        }

        var base = updatePosition(percentage, speed);

        var style = el.style.cssText;
        var transform = '';

        if (style.indexOf('transform') >= 0) {
            // Get the index of the transform
            var index = style.indexOf('transform');

            var trimmedStyle = style.slice(index);
            var delimiter = trimmedStyle.indexOf(';');

            if (delimiter) {
                transform = " " + trimmedStyle.slice(11, delimiter).replace(/\s/g, '');
            } else {
                transform = " " + trimmedStyle.slice(11).replace(/\s/g, '');
            }
        }

        return {
            base: base,
            top: blockTop,
            height: blockHeight,
            speed: speed,
            style: style,
            transform: transform
        };
    };

    var setPosition = function() {
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


    var updatePosition = function(percentage, speed) {

        var value = (speed * (100 * (1 - percentage)));
        return self.options.round ? Math.round(value) : value;

    };


    //
    var update = function() {
        if (setPosition() && pause === false) {
            animate();
        }

        // loop again
        loop(update);
    };

    // Transform3d on parallax element
    var animate = function() {
        for (var i = 0; i < self.elems.length; i++) {
            var percentage = ((posY - blocks[i].top + screenY) / (blocks[i].height + screenY));

            // Subtracting initialize value, so element stays in same spot as HTML
            var position;
            if (window.innerWidth >= minWidth && parallaxjs.api.active === true) {
                position = updatePosition(percentage, blocks[i].speed) - blocks[i].base;
            } else {
                position = 0
            }

            // Move that element
            // (Set the new translation and append initial inline transforms.)
            var translate = 'translate3d(0,' + position + 'px,0) ' + blocks[i].transform;
            self.elems[i].style[transformProp] = translate;
        }
    };


    self.destroy = function() {
        for (var i = 0; i < self.elems.length; i++) {
            self.elems[i].style.cssText = blocks[i].style;
        }
        pause = true;
    };


    init();
    return self;
};


const parallaxjs = {
    api: {
        active: true
    },
    add(el, binding) {
        if (el.parallax)
            return

        let options = {};
        if (typeof val === 'number') {
            options.speed = binding.value
        } else {
            options = binding.value
        }

        el.parallax = new vueParallaxJS(el, options);
    }
}

export default {
    install(Vue, options = {}) {
        gop = options;
        window.parallaxjs = parallaxjs.api;
        Vue.directive('parallax', {
            bind(el, binding) {
            },
            inserted(el, binding) {
                parallaxjs.add(el, binding)
            },
        })
    }
}
