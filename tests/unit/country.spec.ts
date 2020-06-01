// @ts-ignore next-line
global.fetch = require('node-fetch')
jest.unmock('graphql-tag');
import nock from 'nock'
import { createLocalVue, mount } from '@vue/test-utils'
import { VueConstructor } from 'vue'
import Vuex, {Store} from 'vuex'
import { nockAllGraphqlRequests } from './utils/graphql.mock'
import cons from './utils/console.mock'
import { WaitStore } from './utils/wait'
import { when } from './utils/when'
import vuexI18n from 'vuex-i18n'

describe('Country.vue', () => {

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

    const { waits } = await nockAllGraphqlRequests(nock, 'country')
    requests = waits
    cons.mockConsole()
  })

  afterEach(() => {
    cons.restoreConsole()
    nock.cleanAll()
  });

  it('renders country', async () => {
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

    expect(wrapper.text()).not.toContain('Isle of Man')
    
    // Wait while lazyDB requested all data and rerender
    await requests.wait()
    await when(() =>  wrapper.text().includes('Isle of Man'))

    expect(wrapper.text()).toContain('Isle of Man')
    expect(wrapper.text()).toContain('19.07.2019')
    expect(wrapper.text()).toContain('01.03.2020')
    
    expect(wrapper.text()).toContain('Fayshire')
    expect(wrapper.text()).toContain('New Olin')

    expect(wrapper.element).toMatchSnapshot()
  })
})
