// Enable mocking in vue.config.js with `"pluginOptions": { "enableMocks": true }`
// Customize mocking: https://www.apollographql.com/docs/graphql-tools/mocking.html#Customizing-mocks
import shortid from 'shortid'
import casual from 'casual'
import { MockList } from 'vue-cli-plugin-apollo/node_modules/graphql-tools'
import moment from 'moment'

const mockConnection = () => ({
  nodes: () => new MockList([5, 30])
})

const mockEntity = () => ({
  createdAt: moment().add(casual.integer(5, 30), 'month').format(),
  updatedAt: moment().add(casual.integer(5, 30), 'days').format()
})

export default {
  UUID: () => shortid.generate(),
  Datetime: () => moment().format(),
  Int: () => casual.integer(5, 30),

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

  University: () => ({
    shortName: casual.word,
    longName: casual.words(casual.integer(2, 6)),
    ...mockEntity()
  }),

  Query: () => ({
    countries: mockConnection,
    tags: mockConnection,
    problems: mockConnection,
    universities: mockConnection
  })
}
