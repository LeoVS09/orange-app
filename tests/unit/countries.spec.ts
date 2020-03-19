// @ts-ignore next-line
global.fetch = require('node-fetch')
import nock from 'nock'
import { createLocalVue, mount } from '@vue/test-utils'
import { VueConstructor } from 'vue'
import Vuex, {Store} from 'vuex'
import { nockAllGraphqlRequests } from './utils/graphql.mock'
import cons from './utils/console.mock'
import flushPromises from 'flush-promises'
import { timeout } from './utils/timeout'

describe('Countries.vue', () => {

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

    await nockAllGraphqlRequests(nock, 'countries')
    cons.mockConsole()
  })

  afterEach(() => {
    cons.restoreConsole()
    nock.cleanAll()
  });

  it('renders countries list', async () => {
    // must be inside test for mock fetch function
    const Component = require('@/pages/Countries.vue').default
    
    const wrapper = mount(Component, { store, localVue, attachToDocument: true })
    
    expect(wrapper.element).toMatchSnapshot()
    
    // Wait while lazyDB requested all data and rerender
    await timeout(300)
    await flushPromises()

    expect(wrapper.text()).toContain('Korea')
    expect(wrapper.text()).toContain('IN')

    expect(wrapper.text()).toContain('Cocos (Keeling) Islands')
    expect(wrapper.text()).toContain('DE')

    expect(wrapper.text()).toContain('Georgia')
    expect(wrapper.text()).toContain('IE')

    expect(wrapper.element).toMatchSnapshot()
  })
})
