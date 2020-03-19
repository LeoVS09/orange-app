// @ts-ignore next-line
global.fetch = require('node-fetch')
import nock from 'nock'
import { createLocalVue, mount } from '@vue/test-utils'
import { VueConstructor } from 'vue'
import Vuex, {Store} from 'vuex'
import { nockAllGraphqlRequests } from './utils/graphql.mock'
import cons from './utils/console.mock'
import flushPromises from 'flush-promises'
import vuexI18n from 'vuex-i18n'
import { timeout } from './utils/timeout'
import moment from 'moment'

describe('Problems.vue', () => {

  let localVue: VueConstructor<any> 
  let store: Store<any> 

  beforeAll(() => nock.disableNetConnect());

  beforeEach(async () => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Store({
      getters: {
        isTeacher: () => true
      }
    })

    localVue.use(vuexI18n.plugin, store)

    moment.now = function() {
      return +new Date('2020-03-17T19:54:57.551Z')
    }

    await nockAllGraphqlRequests(nock, 'problems')
    cons.mockConsole()
  })

  afterEach(() => {
    cons.restoreConsole()
    nock.cleanAll()
  });

  it('renders problems list', async () => {
    // must be inside test for mock fetch function
    const Component = require('@/pages/Problems.vue').default
    
    const wrapper = mount(Component, { store, localVue, attachToDocument: true })
    
    expect(wrapper.element).toMatchSnapshot()

    // Wait while lazyDB requested all data and rerender
    await timeout(500)
    await flushPromises()

    expect(wrapper.text()).toContain('dolore')
    expect(wrapper.text()).toContain('corrupti')
    expect(wrapper.text()).toContain('officia')
    expect(wrapper.text()).toContain('Mrs. Hildegard Jerde')
    expect(wrapper.text()).toContain('11 days ago')

    expect(wrapper.element).toMatchSnapshot()
  })
})
