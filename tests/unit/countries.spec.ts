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

describe('Countries.vue', () => {

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

    const { waits } = await nockAllGraphqlRequests(nock, 'countries')
    requests = waits
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
    
    expect(wrapper.text()).not.toContain('Korea')

    // Wait while lazyDB requested all data and rerender
    await requests.wait()
    await when(() => wrapper.text().includes('Korea'))

    expect(wrapper.text()).toContain('Korea')
    expect(wrapper.text()).toContain('IN')

    expect(wrapper.text()).toContain('Cocos (Keeling) Islands')
    expect(wrapper.text()).toContain('DE')

    expect(wrapper.text()).toContain('Georgia')
    expect(wrapper.text()).toContain('IE')

    expect(wrapper.element).toMatchSnapshot()
  })
})

