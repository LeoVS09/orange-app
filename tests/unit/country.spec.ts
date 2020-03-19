// @ts-ignore next-line
global.fetch = require('node-fetch')
import nock from 'nock'
import { createLocalVue, mount } from '@vue/test-utils'
import { VueConstructor } from 'vue'
import Vuex, {Store} from 'vuex'
import { nockAllGraphqlRequests } from './utils/graphql.mock'
import mockConsole from './utils/console.mock'
import flushPromises from 'flush-promises'
import { timeout } from './utils/timeout'

describe('Country.vue', () => {

  let localVue: VueConstructor<any> 
  let store: Store<any> 

  beforeAll(() => nock.disableNetConnect());

  beforeEach(async () => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Store({
      getters: {
        isTeacher: () => false
      }
    })

    await nockAllGraphqlRequests(nock, 'country')
  })

  afterEach(() => nock.cleanAll());

  it('renders country', async () => {
    const restoreConsole = mockConsole()
    // must be inside test for mock fetch function
    const Component = require('@/pages/Country.vue').default
    
    const wrapper = mount(Component, { 
      store, 
      localVue, 
      attachToDocument: true,
      propsData: { 
        id: 'country-test-id'
      }
     })
    
    expect(wrapper.element).toMatchSnapshot()
    
    // Wait while lazyDB requested all data and rerender
    await timeout(400)
    await flushPromises()

    expect(wrapper.text()).toContain('Isle of Man')
    expect(wrapper.text()).toContain('19.07.2019')
    expect(wrapper.text()).toContain('01.03.2020')
    
    expect(wrapper.text()).toContain('Fayshire')
    expect(wrapper.text()).toContain('New Olin')

    expect(wrapper.element).toMatchSnapshot()
    restoreConsole()
  })
})
