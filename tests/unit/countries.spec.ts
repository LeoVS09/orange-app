// @ts-ignore next-line
global.fetch = require('node-fetch')
import nock from 'nock'
import { createLocalVue, mount } from '@vue/test-utils'
import { VueConstructor } from 'vue'
import Vuex, {Store} from 'vuex'
import { nockAllGraphqlRequests } from './utils/graphql.mock'
import mockConsole from './utils/console.mock'
import flushPromises from 'flush-promises'

const timeout = (time: number) => new Promise(resolve => setTimeout(resolve, time))

describe('Countries.vue', () => {

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

    await nockAllGraphqlRequests(nock, 'countries')
  })

  afterEach(() => nock.cleanAll());

  it('renders countries list', async () => {
    const restoreConsole = mockConsole()
    // must be inside test for mock fetch function
    const Countries = require('@/pages/Countries.vue').default
    
    const wrapper = mount(Countries, { store, localVue, attachToDocument: true })
    
    // Wait while lazyDB requested all data and rerender
    await timeout(200)
    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
    restoreConsole()
  })
})
