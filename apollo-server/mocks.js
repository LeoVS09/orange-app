// Enable mocking in vue.config.js with `"pluginOptions": { "enableMocks": true }`
// Customize mocking: https://www.apollographql.com/docs/graphql-tools/mocking.html#Customizing-mocks
import shortid from 'shortid'
import casual from 'casual'
import { MockList } from 'vue-cli-plugin-apollo/node_modules/graphql-tools'
import moment from 'moment'

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

const mockConnection = () => ({
  nodes: () => new MockList([5, 20])
})

const mockEntity = () => ({
  createdAt: moment().add(-(getRandomInt(20) + 5), 'month').format(),
  updatedAt: moment().add(-(getRandomInt(20) + 5), 'days').format()
})

export default {
  UUID: () => shortid.generate(),
  Datetime: () => moment().format(),
  Int: () => getRandomInt(20) + 5,

  Country: () => ({
    name: casual.country,
    code: casual.country_code,
    ...mockEntity()
  }),

  City: () => ({
    name: casual.city,
    ...mockEntity()
  }),

  Problem: () => ({
    name: casual.title,
    desciption: casual.text,
    ...mockEntity()
  }),

  User: () => ({
    name: casual.name,
    username: casual.username,
    ...mockEntity()
  }),

  Profile: () => ({
    firstName: casual.first_name,
    middleName: casual.last_name,
    lastName: casual.last_name,
    ...mockEntity()
  }),

  Tag: () => ({
    name: casual.word,
    ...mockEntity()
  }),

  Query: () => ({
    countries: mockConnection,
    tags: mockConnection,
    problems: mockConnection
  })
}
