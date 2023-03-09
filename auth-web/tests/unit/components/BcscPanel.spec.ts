import { createLocalVue, mount } from '@vue/test-utils'
import BcscPanel from '@/components/auth/home/BcscPanel.vue'
import LearnMoreButton from '@/components/auth/common/LearnMoreButton.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('BcscPanel.vue', () => {
  let wrapper: any
  let wrapperFactory: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    const router = new VueRouter()
    const store = new Vuex.Store({})

    wrapperFactory = (propsData) => {
      return mount(BcscPanel, {
        localVue,
        store,
        router,
        vuetify,
        propsData: {
          ...propsData
        }
      })
    }

    wrapper = wrapperFactory({ user: {firstname: 'test', lastname: 'test'} })
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    wrapper.destroy()
  })

  it('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders the components properly', () => {
    expect(wrapper.findComponent(BcscPanel).exists()).toBe(true)
    expect(wrapper.findComponent(LearnMoreButton).exists()).toBe(true)
  })

  it('doesn\'t render the login or create account link when authenticated', () => {
    // Verify only the Learn More Button is rendered
    expect(wrapper.find('.cta-btn').exists()).toBe(false)
    expect(wrapper.findAll('.v-btn').length).toBe(1)
    expect(wrapper.find('.learn-more-btn')).toBeDefined()
    expect(wrapper.find('.learn-more-btn').text()).toContain('Learn More')

  })

  it('renders the login button and create account link when NOT authenticated', () => {
    // Render Un-Authenticated
    const wrapper = wrapperFactory({ userProfile: null })

    const authenticatedBtns = wrapper.vm.$el.querySelectorAll('.v-btn')
    const mobileCardLink = wrapper.vm.$el.querySelectorAll('a')
    const createAccountLink = wrapper.vm.$el.querySelector('.cta-btn')

    expect(authenticatedBtns[0]).toBeDefined()
    expect(authenticatedBtns[0].textContent).toContain('Create a BC Registries Account')

    expect(mobileCardLink[0]).toBeDefined()
    expect(mobileCardLink[0].textContent).toContain('set up a mobile card')

    expect(createAccountLink).toBeDefined()
    expect(createAccountLink.textContent).toContain('Create a BC Registries Account')

    expect(authenticatedBtns[1]).toBeDefined()
    expect(authenticatedBtns[1].textContent).toContain('Learn More')
  })
})
