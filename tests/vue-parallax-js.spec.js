import { mount, createLocalVue } from '@vue/test-utils'
import VueParallaxJs from '../src/vue-parallax-js'

describe('VueParallaxJs', () => {
  let localVue
  let wrappers = []

  // Helper to track wrappers
  const mountAndTrack = (...args) => {
    const wrapper = mount(...args)
    wrappers.push(wrapper)
    return wrapper
  }

  beforeEach(() => {
    localVue = createLocalVue()
    wrappers = []
    // Reset window scroll position
    window.scrollY = 0
    window.pageYOffset = 0
    window.innerHeight = 768
    window.innerWidth = 1024
    // Clean up previous parallax instance
    if (window.$parallaxjs) {
      window.$parallaxjs.items = []
      delete window.$parallaxjs
    }
    // Reset getComputedStyle mock
    const originalGetComputedStyle = window.getComputedStyle
    window.getComputedStyle = (el) => {
      const original = originalGetComputedStyle ? originalGetComputedStyle.call(window, el) : {}
      return {
        ...original,
        display: 'block',
        marginTop: '0px'
      }
    }
  })

  afterEach(() => {
    // Destroy all wrappers to trigger unbind
    wrappers.forEach(wrapper => {
      if (wrapper && wrapper.destroy) {
        wrapper.destroy()
      }
    })
    wrappers = []
    // Clean up after each test
    if (window.$parallaxjs) {
      window.$parallaxjs.items = []
    }
  })

  describe('Plugin Installation', () => {
    it('should install the plugin', () => {
      localVue.use(VueParallaxJs)
      expect(localVue.directive('parallax')).toBeDefined()
    })

    it('should add $parallaxjs to Vue prototype', () => {
      localVue.use(VueParallaxJs)
      const wrapper = mount({
        template: '<div></div>'
      }, { localVue })
      expect(wrapper.vm.$parallaxjs).toBeDefined()
    })

    it('should add $parallaxjs to window', () => {
      localVue.use(VueParallaxJs)
      expect(window.$parallaxjs).toBeDefined()
    })

    it('should accept options during installation', () => {
      const options = {
        minWidth: 768,
        className: 'parallax-element'
      }
      localVue.use(VueParallaxJs, options)
      expect(window.$parallaxjs.os).toEqual(options)
    })
  })

  describe('Directive Binding', () => {
    beforeEach(() => {
      // Clean up items from previous tests
      if (window.$parallaxjs) {
        window.$parallaxjs.items = []
      }
      if (!localVue.directive('parallax')) {
        localVue.use(VueParallaxJs)
      }
    })

    it('should bind directive to element', () => {
      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue })

      expect(window.$parallaxjs.items.length).toBe(1)
      expect(window.$parallaxjs.items[0].value).toBe(0.5)
    })

    it('should store element reference in items', () => {
      const wrapper = mount({
        template: '<div v-parallax="0.3">Test</div>'
      }, { localVue })

      const item = window.$parallaxjs.items[0]
      expect(item.el).toBe(wrapper.element)
    })

    it('should unbind directive on component destroy', () => {
      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue })

      expect(window.$parallaxjs.items.length).toBe(1)
      wrapper.destroy()
      expect(window.$parallaxjs.items.length).toBe(0)
    })

    it('should handle multiple elements with parallax', () => {
      const wrapper = mount({
        template: `
          <div>
            <div v-parallax="0.2">First</div>
            <div v-parallax="0.5">Second</div>
            <div v-parallax="0.8">Third</div>
          </div>
        `
      }, { localVue })

      expect(window.$parallaxjs.items.length).toBe(3)
      expect(window.$parallaxjs.items[0].value).toBe(0.2)
      expect(window.$parallaxjs.items[1].value).toBe(0.5)
      expect(window.$parallaxjs.items[2].value).toBe(0.8)
    })
  })

  describe('Modifiers', () => {
    beforeEach(() => {
      // Clean up items from previous tests
      if (window.$parallaxjs) {
        window.$parallaxjs.items = []
      }
      if (!localVue.directive('parallax')) {
        localVue.use(VueParallaxJs)
      }
    })

    it('should handle centerX modifier', () => {
      const wrapper = mount({
        template: '<div v-parallax.centerX="0.5">Test</div>'
      }, { localVue })

      const item = window.$parallaxjs.items[0]
      expect(item.mod.centerX).toBe(true)
    })

    it('should handle horizontal modifier', () => {
      const wrapper = mount({
        template: '<div v-parallax.horizontal="0.5">Test</div>'
      }, { localVue })

      const item = window.$parallaxjs.items[0]
      expect(item.mod.horizontal).toBe(true)
    })

    it('should handle absY modifier', () => {
      const wrapper = mount({
        template: '<div v-parallax.absY="0.5">Test</div>'
      }, { localVue })

      const item = window.$parallaxjs.items[0]
      expect(item.mod.absY).toBe(true)
    })

    it('should handle multiple modifiers', () => {
      const wrapper = mount({
        template: '<div v-parallax.centerX.absY="0.5">Test</div>'
      }, { localVue })

      const item = window.$parallaxjs.items[0]
      expect(item.mod.centerX).toBe(true)
      expect(item.mod.absY).toBe(true)
    })
  })

  describe('Transform Calculations', () => {
    beforeEach(() => {
      // Clean up items from previous tests
      if (window.$parallaxjs) {
        window.$parallaxjs.items = []
      }
      if (!localVue.directive('parallax')) {
        localVue.use(VueParallaxJs)
      }
    })

    it('should apply transform style to element', () => {
      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue })

      window.$parallaxjs.move()

      const transform = wrapper.element.style.transform
      expect(transform).toContain('translate3d')
    })

    it('should use centerX in transform when modifier is present', () => {
      const wrapper = mount({
        template: '<div v-parallax.centerX="0.5">Test</div>'
      }, { localVue })

      window.$parallaxjs.move()

      const transform = wrapper.element.style.transform
      expect(transform).toContain('-50%')
    })

    it('should use horizontal transform when modifier is present', () => {
      const wrapper = mount({
        template: '<div v-parallax.horizontal="0.5">Test</div>'
      }, { localVue })

      window.$parallaxjs.move()

      const transform = wrapper.element.style.transform
      // Horizontal parallax should have different transform pattern
      expect(transform).toContain('translate3d')
    })

    it('should clear transform when window is below minWidth', () => {
      // Create fresh localVue for this test with custom options
      const testLocalVue = createLocalVue()
      // Clean up previous instance
      if (window.$parallaxjs) {
        window.$parallaxjs.items = []
        delete window.$parallaxjs
      }
      testLocalVue.use(VueParallaxJs, { minWidth: 1200 })
      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue: testLocalVue })

      window.innerWidth = 800
      window.$parallaxjs.move()

      expect(wrapper.element.style.transform).toBe('')
    })
  })

  describe('Event Handlers', () => {
    beforeEach(() => {
      // Clean up items from previous tests
      if (window.$parallaxjs) {
        window.$parallaxjs.items = []
      }
      if (!localVue.directive('parallax')) {
        localVue.use(VueParallaxJs)
      }
    })

    it('should update items on scroll', () => {
      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue })

      const initialTransform = wrapper.element.style.transform

      // Simulate scroll
      global.window.scrollY = 100
      window.dispatchEvent(new Event('scroll'))

      // Transform should change after scroll
      window.$parallaxjs.move()
      const newTransform = wrapper.element.style.transform

      expect(newTransform).toContain('translate3d')
    })

    it('should update items on resize', () => {
      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue })

      const updateSpy = jest.spyOn(window.$parallaxjs, 'update')
      const moveSpy = jest.spyOn(window.$parallaxjs, 'move')

      window.dispatchEvent(new Event('resize'))

      expect(updateSpy).toHaveBeenCalled()
      expect(moveSpy).toHaveBeenCalled()
    })
  })

  describe('ParallaxJS Class Methods', () => {
    beforeEach(() => {
      // Clean up items from previous tests
      if (window.$parallaxjs) {
        window.$parallaxjs.items = []
      }
      if (!localVue.directive('parallax')) {
        localVue.use(VueParallaxJs)
      }
    })

    it('should have add method', () => {
      expect(typeof window.$parallaxjs.add).toBe('function')
    })

    it('should have remove method', () => {
      expect(typeof window.$parallaxjs.remove).toBe('function')
    })

    it('should have update method', () => {
      expect(typeof window.$parallaxjs.update).toBe('function')
    })

    it('should have move method', () => {
      expect(typeof window.$parallaxjs.move).toBe('function')
    })

    it('should update element dimensions on update call', () => {
      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue })

      const item = window.$parallaxjs.items[0]
      const originalHeight = item.height

      // Mock element height change
      Object.defineProperty(wrapper.element, 'clientHeight', {
        value: 500,
        writable: true
      })

      window.$parallaxjs.update()

      // Height should be updated
      expect(window.$parallaxjs.items[0].height).toBeDefined()
    })

    it('should not add elements with display:none', () => {
      // Create fresh localVue for this test
      const testLocalVue = createLocalVue()
      // Clean up previous instance
      if (window.$parallaxjs) {
        window.$parallaxjs.items = []
        delete window.$parallaxjs
      }

      // Mock getComputedStyle for this test only
      const originalGetComputedStyle = window.getComputedStyle
      window.getComputedStyle = () => ({
        display: 'none',
        marginTop: '0px'
      })

      testLocalVue.use(VueParallaxJs)
      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue: testLocalVue })

      expect(window.$parallaxjs.items.length).toBe(0)

      // Restore original mock
      window.getComputedStyle = originalGetComputedStyle
    })
  })

  describe('Custom Container', () => {
    it('should support custom scroll container', () => {
      const wrapper = mount({
        template: `
          <div>
            <div id="custom-container">
              <div v-parallax="0.5">Test</div>
            </div>
          </div>
        `
      }, {
        localVue,
        attachTo: document.body
      })

      // Add container to DOM for querySelector to work
      const container = document.createElement('div')
      container.id = 'scroll-container'
      document.body.appendChild(container)

      const localVue2 = createLocalVue()
      localVue2.use(VueParallaxJs, { container: '#scroll-container' })

      expect(window.$parallaxjs.os.container).toBe('#scroll-container')

      // Cleanup
      document.body.removeChild(container)
      wrapper.destroy()
    })
  })

  describe('Active State', () => {
    beforeEach(() => {
      // Clean up items from previous tests
      if (window.$parallaxjs) {
        window.$parallaxjs.items = []
      }
      if (!localVue.directive('parallax')) {
        localVue.use(VueParallaxJs)
      }
    })

    it('should have active property', () => {
      expect(window.$parallaxjs.active).toBe(true)
    })

    it('should not move when active is false', () => {
      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue })

      window.$parallaxjs.active = false
      window.$parallaxjs.move()

      // Transform should remain empty since movement is disabled
      expect(wrapper.element.style.transform).toBe('')
    })

    it('should move when active is true', () => {
      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue })

      window.$parallaxjs.active = true
      window.$parallaxjs.move()

      expect(wrapper.element.style.transform).toContain('translate3d')
    })
  })

  describe('Class Name Option', () => {
    it('should add custom class to parallax elements', () => {
      // Create fresh localVue for this test with custom options
      const testLocalVue = createLocalVue()
      // Clean up previous instance
      if (window.$parallaxjs) {
        window.$parallaxjs.items = []
        delete window.$parallaxjs
      }
      testLocalVue.use(VueParallaxJs, { className: 'custom-parallax' })

      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue: testLocalVue })

      expect(wrapper.element.className).toContain('custom-parallax')
    })

    it('should not add class when className is not provided', () => {
      // Create fresh localVue for this test
      const testLocalVue = createLocalVue()
      // Clean up previous instance
      if (window.$parallaxjs) {
        window.$parallaxjs.items = []
        delete window.$parallaxjs
      }
      testLocalVue.use(VueParallaxJs)

      const wrapper = mount({
        template: '<div v-parallax="0.5" class="existing">Test</div>'
      }, { localVue: testLocalVue })

      expect(wrapper.element.className).toBe('existing')
    })
  })
})
