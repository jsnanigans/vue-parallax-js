// Mock window properties needed for parallax
window.scrollY = 0
window.pageYOffset = 0
window.innerHeight = 768
window.innerWidth = 1024

// Mock requestAnimationFrame
window.requestAnimationFrame = cb => {
  cb()
  return 0
}

// Store original getComputedStyle
const originalGetComputedStyle = window.getComputedStyle

// Mock getComputedStyle
window.getComputedStyle = (el) => {
  const original = originalGetComputedStyle ? originalGetComputedStyle.call(window, el) : {}
  return {
    ...original,
    display: 'block',
    marginTop: '0px'
  }
}

// Patch HTMLElement prototype to provide offset properties
Object.defineProperties(HTMLElement.prototype, {
  offsetTop: {
    get: function() { return this._offsetTop || 0 },
    set: function(val) { this._offsetTop = val },
    configurable: true
  },
  offsetLeft: {
    get: function() { return this._offsetLeft || 0 },
    set: function(val) { this._offsetLeft = val },
    configurable: true
  },
  offsetParent: {
    get: function() {
      return this._offsetParent !== undefined ? this._offsetParent : {
        offsetTop: 0,
        offsetLeft: 0
      }
    },
    set: function(val) { this._offsetParent = val },
    configurable: true
  },
  offsetHeight: {
    get: function() { return this._offsetHeight || 100 },
    set: function(val) { this._offsetHeight = val },
    configurable: true
  },
  offsetWidth: {
    get: function() { return this._offsetWidth || 100 },
    set: function(val) { this._offsetWidth = val },
    configurable: true
  },
  clientHeight: {
    get: function() { return this._clientHeight || 100 },
    set: function(val) { this._clientHeight = val },
    configurable: true
  },
  clientWidth: {
    get: function() { return this._clientWidth || 100 },
    set: function(val) { this._clientWidth = val },
    configurable: true
  },
  scrollHeight: {
    get: function() { return this._scrollHeight || 100 },
    set: function(val) { this._scrollHeight = val },
    configurable: true
  },
  scrollWidth: {
    get: function() { return this._scrollWidth || 100 },
    set: function(val) { this._scrollWidth = val },
    configurable: true
  }
})
