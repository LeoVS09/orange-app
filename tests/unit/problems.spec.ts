// @ts-ignore next-line
global.fetch = require('node-fetch')
import nock from 'nock'
import { createLocalVue, mount } from '@vue/test-utils'
import { VueConstructor } from 'vue'
import Vuex, {Store} from 'vuex'
import { nockAllGraphqlRequests } from './utils/graphql.mock'
import mockConsole from './utils/console.mock'
import flushPromises from 'flush-promises'
import vuexI18n from 'vuex-i18n'

const timeout = (time: number) => new Promise(resolve => setTimeout(resolve, time))

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

    await nockAllGraphqlRequests(nock, 'problems')
  })

  afterEach(() => nock.cleanAll());

  it('renders problems list', async () => {
    const restoreConsole = mockConsole()
    // must be inside test for mock fetch function
    const Countries = require('@/pages/Problems.vue').default
    
    const wrapper = mount(Countries, { store, localVue, attachToDocument: true })
    
    // Wait while lazyDB requested all data and rerender
    await timeout(500)
    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
    restoreConsole()
  })
})
