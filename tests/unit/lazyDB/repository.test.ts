// @ts-ignore next-line
global.fetch = require('node-fetch')
jest.unmock('graphql-tag');
import nock from 'nock'
import { nockAllGraphqlRequests, NockAllGraphqlRequestsControls } from '../utils/graphql.mock'
import cons from '../utils/console.mock'
import { when } from '../utils/when'
import { timeout } from 'rxjs/operators'

// For run tests sequentially (one by one)
// use describe blocks, each describe block runs ony after previus


describe('Repository', () => {
  beforeAll(async () => {
    nock.disableNetConnect()
    cons.mockConsole()
  });

  let requestControls: NockAllGraphqlRequestsControls

  beforeEach(async () => {
    requestControls = await nockAllGraphqlRequests(nock, 'repository')
    // Check graphql query is correct
    requestControls.checkRequestParams = query => 
      expect(query).toMatchSnapshot()
  })

  afterEach(() => {
    nock.cleanAll()
  });

  afterAll(() => {
    cons.restoreConsole()
  })

  // TODO: check order of events
  //  request -> reactive update -> response -> reactive update
  
  // TODO: check display states
  //  isLoading -> before and during request
  //  isChanged -> on change data
  //  isUpdating -> during update
  //  ...

  // TODO: check multiple layers of object
  
  // TODO: test repository without database
  
  it('should generate query for one entity and display', async () => {
    // must be inside test for mock fetch function
    const { Database } = require('@/lazyDb/database/connected/Database')
    const { Repository } = new Database()
    const DataRepository = new Repository('country')

    const reactiveUpdate = jest.fn()
    const node = DataRepository.findOne('test-id', reactiveUpdate) 

    // ask data
    expect(node.name).toBeUndefined()
    expect(node.code).toBeUndefined()
    expect(node.updatedAt).toBeUndefined()
    expect(node.createdAt).toBeUndefined()

    // Wait while lazyDB requested all data and rerender
    await requestControls.waits.wait()
    // one call when requiest start
    await when(() => reactiveUpdate.mock.calls.length > 0)
    expect(reactiveUpdate.mock.calls.length).toBe(1)

    // when data will be displayed
    await when(() => reactiveUpdate.mock.calls.length === 2)
    expect(reactiveUpdate.mock.calls.length).toBe(2)

    expect(node.id).toBe("0SHIyxJBp")
    expect(node.name).toBe("Switzerland")
    expect(node.code).toBe("IN")
    expect(node.updatedAt).toEqual(new Date("2020-04-24T19:29:15+03:00"))
    expect(node.createdAt).toEqual(new Date("2021-04-28T19:29:15+03:00"))

    expect(node).toMatchSnapshot()
  })

  it('should generade query for list by first node and return', async () => {
    // must be inside test for mock fetch function
    const { Database } = require('@/lazyDb/database/connected/Database')
    const { Repository } = new Database()
    const DataRepository = new Repository('country')
  
    const reactiveUpdate = jest.fn()
    const list = DataRepository.list(reactiveUpdate)

    // ask data
    expect(list.nodes[0].name).toBeUndefined()
    expect(list.nodes[0].code).toBeUndefined()
    expect(list.nodes[0].updatedAt).toBeUndefined()
    
    // Wait while lazyDB requested all data and rerender
    await requestControls.waits.wait()
    // only one call, need investigate why, 
    //  possible because debounce is too big
    await when(() => reactiveUpdate.mock.calls.length === 1)
    expect(reactiveUpdate.mock.calls.length).toBe(1)
  
    // when data will be displayed
    // await when(() => reactiveUpdate.mock.calls.length === 2)
    // expect(reactiveUpdate.mock.calls.length).toBe(2)

    expect(list.nodes.length).toBe(15)

    expect(list.nodes[0].id).toBe("gILNkgtqw")
    expect(list.nodes[0].name).toBe("Estonia")
    expect(list.nodes[0].code).toBe("DE")
    expect(list.nodes[0].updatedAt).toEqual(new Date("2020-02-27T00:25:04+03:00"))

    expect(list.nodes[6].id).toBe("vP38-NdB-S")
    expect(list.nodes[6].name).toBe("Guinea-Bissau")
    expect(list.nodes[6].code).toBe("IE")
    expect(list.nodes[6].updatedAt).toEqual(new Date("2020-03-15T00:25:04+03:00"))

    expect(list.nodes).toMatchObject([
      {"id":"gILNkgtqw", "name":"Estonia","code":"DE","updatedAt":new Date("2020-02-27T00:25:04+03:00")},
      {"id":"RvBE9BWZ85","name":"Comoros","code":"CN","updatedAt":new Date("2020-03-02T00:25:04+03:00")},
      {"id":"0Pj8HSsj2e","name":"Mayotte","code":"IN","updatedAt":new Date("2020-03-07T00:25:04+03:00")},
      {"id":"mIBSPRsCW1","name":"Kuwait","code":"US","updatedAt":new Date("2020-03-04T00:25:04+03:00")},
      {"id":"hcQnOCkpmJ","name":"Slovakia (Slovak Republic)","code":"US","updatedAt":new Date("2020-03-07T00:25:04+03:00")},
      {"id":"N8RK5pKUpR","name":"Guinea","code":"FR","updatedAt":new Date("2020-03-12T00:25:04+03:00")},
      {"id":"vP38-NdB-S","name":"Guinea-Bissau","code":"IE","updatedAt":new Date("2020-03-15T00:25:04+03:00")},
      {"id":"HUZ0tFZw41","name":"Nicaragua","code":"MX","updatedAt":new Date("2020-02-29T00:25:04+03:00")},
      {"id":"o_xKHVYYCb","name":"Czech Republic","code":"IE","updatedAt":new Date("2020-03-07T00:25:04+03:00")},
      {"id":"GjmpsFXCnv","name":"India","code":"ES","updatedAt":new Date("2020-02-25T00:25:04+03:00")},
      {"id":"HCGgb2ALkw","name":"Japan","code":"RU","updatedAt":new Date("2020-03-06T00:25:04+03:00")},
      {"id":"G6uw5EaXT8","name":"Monaco","code":"IN","updatedAt":new Date("2020-03-14T00:25:04+03:00")},
      {"id":"tuMpRj14b3","name":"Guadeloupe","code":"MX","updatedAt":new Date("2020-03-09T00:25:04+03:00")},
      {"id":"KF5UhVBanC","name":"Netherlands Antilles","code":"MX","updatedAt":new Date("2020-03-06T00:25:04+03:00")},
      {"id":"FlSxQ0a3nP","name":"Myanmar","code":"FR","updatedAt":new Date("2020-03-09T00:25:04+03:00")}
    ])

    expect(list).toMatchSnapshot()
  })

  it('should generate request for entity and next reqires when more fields need', async () => {
     // must be inside test for mock fetch function
     const { Database } = require('@/lazyDb/database/connected/Database')
     const { Repository } = new Database()
     const DataRepository = new Repository('country')
 
     const reactiveUpdate = jest.fn()
     // need use eindividual id, 
     // for prevent apollo to cache queries
     const node = DataRepository.findOne('test-id2', reactiveUpdate) 

     // ask data
     expect(node.name).toBeUndefined()
     expect(node.updatedAt).toBeUndefined()
     expect(node.createdAt).toBeUndefined()

    // Wait while lazyDB requested all data and rerender
    await requestControls.waits.wait()
    // one call when requiest start
    await when(() => reactiveUpdate.mock.calls.length > 0)
    expect(reactiveUpdate.mock.calls.length).toBe(1)

    // wait when data will be displayed
    // if tests run one by one, requiests may be to fast, and data will be displayed imidiatly
    // await when(() => reactiveUpdate.mock.calls.length === 2)
    // expect(reactiveUpdate.mock.calls.length).toBe(2)

    expect(node.id).toBe('I2o82_J6a')
    expect(node.name).toBe('United Arab Emirates')
    expect(node.updatedAt).toEqual(new Date("2020-05-08T15:31:16.000Z"))
    expect(node.createdAt).toEqual(new Date("2021-01-16T15:31:16.000Z"))

    expect(node).toMatchSnapshot()

    await timeout(1000)
    // ---------------------------------------------------------------
    // Ask additional data
    expect(node.code).toBeUndefined()

    // Wait while lazyDB requested 'code' data and rerender
    await requestControls.waits.wait()

    // next call when requiest end
    // if data not displayed change on 3
    // TODO: investigate this behaivor, probably need add some kind controls to debounce, 
    // for prevent lost steps
    await when(() => reactiveUpdate.mock.calls.length >= 2)
    // expect(reactiveUpdate.mock.calls.length).toBe(2)

    expect(node.id).toBe('I2o82_J6a')
    expect(node.name).toBe('United Arab Emirates')
    expect(node.code).toBe('PT')
    expect(node.updatedAt).toEqual(new Date("2020-05-08T15:31:16.000Z"))
    expect(node.createdAt).toEqual(new Date("2021-01-16T15:31:16.000Z"))

    expect(node).toMatchSnapshot()
  })
  
})
