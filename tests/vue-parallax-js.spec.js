import { mount, createLocalVue } from '@vue/test-utils'
import VueParallaxJs from '../src/vue-parallax-js'

describe('VueParallaxJs', () => {
  let localVue
  let wrappers = []

  // Helper to create and track wrappers
  const createWrapper = (options, vueInstance = localVue) => {
    const wrapper = mount(options, { localVue: vueInstance })
    wrappers.push(wrapper)
    return wrapper
  }

  beforeEach(() => {
    // Create fresh localVue for each test
    localVue = createLocalVue()
    wrappers = []

    // Reset window properties
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
    window.getComputedStyle = (el) => ({
      display: 'block',
      marginTop: '0px'
    })
  })

  afterEach(() => {
    // Destroy all wrappers
    wrappers.forEach(wrapper => {
      try {
        if (wrapper && wrapper.destroy) {
          wrapper.destroy()
        }
      } catch (e) {
        // Ignore errors during cleanup
      }
    })
    wrappers = []

    // Clean up parallax instance
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
      const wrapper = createWrapper({
        template: '<div></div>'
      })
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
      localVue.use(VueParallaxJs)
    })

    it('should bind directive to element', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax="0.5">Test</div>'
      })

      expect(window.$parallaxjs.items.length).toBe(1)
      expect(window.$parallaxjs.items[0].value).toBe(0.5)
    })

    it('should store element reference in items', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax="0.3">Test</div>'
      })

      expect(window.$parallaxjs.items.length).toBe(1)
      const item = window.$parallaxjs.items[0]
      expect(item.el).toBe(wrapper.element)
    })

    it('should unbind directive on component destroy', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax="0.5">Test</div>'
      })

      expect(window.$parallaxjs.items.length).toBe(1)
      wrapper.destroy()
      expect(window.$parallaxjs.items.length).toBe(0)
    })

    it('should handle multiple elements with parallax', () => {
      const wrapper = createWrapper({
        template: `
          <div>
            <div v-parallax="0.2">First</div>
            <div v-parallax="0.5">Second</div>
            <div v-parallax="0.8">Third</div>
          </div>
        `
      })

      expect(window.$parallaxjs.items.length).toBe(3)
      expect(window.$parallaxjs.items[0].value).toBe(0.2)
      expect(window.$parallaxjs.items[1].value).toBe(0.5)
      expect(window.$parallaxjs.items[2].value).toBe(0.8)
    })
  })

  describe('Modifiers', () => {
    beforeEach(() => {
      localVue.use(VueParallaxJs)
    })

    it('should handle centerX modifier', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax.centerX="0.5">Test</div>'
      })

      expect(window.$parallaxjs.items.length).toBe(1)
      const item = window.$parallaxjs.items[0]
      expect(item.mod.centerX).toBe(true)
    })

    it('should handle horizontal modifier', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax.horizontal="0.5">Test</div>'
      })

      expect(window.$parallaxjs.items.length).toBe(1)
      const item = window.$parallaxjs.items[0]
      expect(item.mod.horizontal).toBe(true)
    })

    it('should handle absY modifier', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax.absY="0.5">Test</div>'
      })

      expect(window.$parallaxjs.items.length).toBe(1)
      const item = window.$parallaxjs.items[0]
      expect(item.mod.absY).toBe(true)
    })

    it('should handle multiple modifiers', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax.centerX.absY="0.5">Test</div>'
      })

      expect(window.$parallaxjs.items.length).toBe(1)
      const item = window.$parallaxjs.items[0]
      expect(item.mod.centerX).toBe(true)
      expect(item.mod.absY).toBe(true)
    })
  })

  describe('Transform Calculations', () => {
    beforeEach(() => {
      localVue.use(VueParallaxJs)
    })

    it('should apply transform style to element', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax="0.5">Test</div>'
      })

      window.$parallaxjs.move()

      const transform = wrapper.element.style.transform
      expect(transform).toContain('translate3d')
    })

    it('should use centerX in transform when modifier is present', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax.centerX="0.5">Test</div>'
      })

      window.$parallaxjs.move()

      const transform = wrapper.element.style.transform
      expect(transform).toContain('-50%')
    })

    it('should use horizontal transform when modifier is present', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax.horizontal="0.5">Test</div>'
      })

      window.$parallaxjs.move()

      const transform = wrapper.element.style.transform
      expect(transform).toContain('translate3d')
    })

    it('should clear transform when window is below minWidth', () => {
      // Create fresh localVue with custom options
      const testLocalVue = createLocalVue()
      testLocalVue.use(VueParallaxJs, { minWidth: 1200 })

      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue: testLocalVue })
      wrappers.push(wrapper)

      window.innerWidth = 800
      window.$parallaxjs.move()

      expect(wrapper.element.style.transform).toBe('')
    })
  })

  describe('Event Handlers', () => {
    beforeEach(() => {
      localVue.use(VueParallaxJs)
    })

    it('should update items on scroll', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax="0.5">Test</div>'
      })

      // Simulate scroll
      window.scrollY = 100
      window.dispatchEvent(new Event('scroll'))

      window.$parallaxjs.move()
      const newTransform = wrapper.element.style.transform

      expect(newTransform).toContain('translate3d')
    })

    it('should update items on resize', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax="0.5">Test</div>'
      })

      const updateSpy = jest.spyOn(window.$parallaxjs, 'update')
      const moveSpy = jest.spyOn(window.$parallaxjs, 'move')

      window.dispatchEvent(new Event('resize'))

      expect(updateSpy).toHaveBeenCalled()
      expect(moveSpy).toHaveBeenCalled()
    })
  })

  describe('ParallaxJS Class Methods', () => {
    beforeEach(() => {
      localVue.use(VueParallaxJs)
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
      const wrapper = createWrapper({
        template: '<div v-parallax="0.5">Test</div>'
      })

      const item = window.$parallaxjs.items[0]
      expect(item.height).toBeDefined()

      // Mock element height change
      Object.defineProperty(wrapper.element, 'clientHeight', {
        value: 500,
        writable: true,
        configurable: true
      })

      window.$parallaxjs.update()

      expect(window.$parallaxjs.items[0].height).toBeDefined()
    })

    it('should not add elements with display:none', () => {
      // Create fresh localVue for this test
      const testLocalVue = createLocalVue()

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
      wrappers.push(wrapper)

      expect(window.$parallaxjs.items.length).toBe(0)

      // Restore original mock
      window.getComputedStyle = originalGetComputedStyle
    })
  })

  describe('Custom Container', () => {
    it('should support custom scroll container', () => {
      const testLocalVue = createLocalVue()

      // Add container to DOM
      const container = document.createElement('div')
      container.id = 'scroll-container'
      document.body.appendChild(container)

      testLocalVue.use(VueParallaxJs, { container: '#scroll-container' })

      expect(window.$parallaxjs.os.container).toBe('#scroll-container')

      // Cleanup
      document.body.removeChild(container)
    })
  })

  describe('Active State', () => {
    beforeEach(() => {
      localVue.use(VueParallaxJs)
    })

    it('should have active property', () => {
      expect(window.$parallaxjs.active).toBe(true)
    })

    it('should not move when active is false', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax="0.5">Test</div>'
      })

      window.$parallaxjs.active = false

      // Clear any existing transform
      wrapper.element.style.transform = ''

      window.$parallaxjs.move()

      expect(wrapper.element.style.transform).toBe('')
    })

    it('should move when active is true', () => {
      const wrapper = createWrapper({
        template: '<div v-parallax="0.5">Test</div>'
      })

      window.$parallaxjs.active = true
      window.$parallaxjs.move()

      expect(wrapper.element.style.transform).toContain('translate3d')
    })
  })

  describe('Class Name Option', () => {
    it('should add custom class to parallax elements', () => {
      const testLocalVue = createLocalVue()
      testLocalVue.use(VueParallaxJs, { className: 'custom-parallax' })

      const wrapper = mount({
        template: '<div v-parallax="0.5">Test</div>'
      }, { localVue: testLocalVue })
      wrappers.push(wrapper)

      expect(wrapper.element.className).toContain('custom-parallax')
    })

    it('should not add class when className is not provided', () => {
      const testLocalVue = createLocalVue()
      testLocalVue.use(VueParallaxJs)

      const wrapper = mount({
        template: '<div v-parallax="0.5" class="existing">Test</div>'
      }, { localVue: testLocalVue })
      wrappers.push(wrapper)

      expect(wrapper.element.className).toBe('existing')
    })
  })
})
