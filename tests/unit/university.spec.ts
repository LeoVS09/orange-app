// @ts-ignore next-line
global.fetch = require('node-fetch')
import nock from 'nock'
import { createLocalVue, mount } from '@vue/test-utils'
import { VueConstructor } from 'vue'
import Vuex, {Store} from 'vuex'
import { nockAllGraphqlRequests } from './utils/graphql.mock'
import cons from './utils/console.mock'
import { WaitStore } from './utils/wait'
import { when } from './utils/when'
import vuexI18n from 'vuex-i18n'

describe('University.vue', () => {

  let localVue: VueConstructor<any> 
  let store: Store<any> 
  let requests: WaitStore

  beforeAll(() => nock.disableNetConnect());

  beforeEach(async () => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Store({
      getters: {
        isTeacher: () => false
      }
    })

    localVue.use(vuexI18n.plugin, store)

    const { waits } = await nockAllGraphqlRequests(nock, 'university')
    requests = waits
    cons.mockConsole()
  })

  afterEach(() => {
    cons.restoreConsole()
    nock.cleanAll()
  });

  it('renders university', async () => {
    // must be inside test for mock fetch function
    const Component = require('@/pages/University.vue').default
    
    const wrapper = mount(Component, { 
      store, 
      localVue, 
      attachToDocument: true,
      propsData: { 
        id: 'university-test-id'
      }
     })
    
    expect(wrapper.element).toMatchSnapshot()

    expect(wrapper.text()).not.toContain('numquam')
    
    // Wait while lazyDB requested all data and rerender
    await requests.wait()
    await when(() => wrapper.text().includes('numquam'))

    expect(wrapper.text()).toContain('numquam')
    expect(wrapper.text()).toContain('Cook Islands')
    expect(wrapper.text()).toContain('West Devanstad')

    expect(wrapper.element).toMatchSnapshot()
  })
})
