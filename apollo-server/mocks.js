// Enable mocking in vue.config.js with `"pluginOptions": { "enableMocks": true }`
// Customize mocking: https://www.apollographql.com/docs/graphql-tools/mocking.html#Customizing-mocks
import shortid from 'shortid'
import casual from 'casual'
import { MockList } from 'vue-cli-plugin-apollo/node_modules/graphql-tools'
import moment from 'moment'

const mockConnection = () => ({
  nodes: () => new MockList([5, 30])
})

const mockEntity = ({ id = shortid.generate() } = {}) => ({
  id,
  createdAt: moment().add(casual.integer(5, 30), 'month').format(),
  updatedAt: moment().add(casual.integer(5, 30), 'days').format()
})

export default {
  UUID: () => shortid.generate(),
  Datetime: () => moment().format(),
  Int: () => casual.integer(5, 30),

  Country: (_, args) => ({
    name: casual.country,
    code: casual.country_code,
    ...mockEntity(args)
  }),

  City: (_, args) => ({
    name: casual.city,
    ...mockEntity(args)
  }),

  Problem: (_, args) => ({
    name: casual.title,
    description: casual.sentences(casual.integer(15, 30)),
    ...mockEntity(args)
  }),

  User: (_, args) => ({
    name: casual.name,
    username: casual.username,
    ...mockEntity(args)
  }),

  Profile: (_, args) => ({
    firstName: casual.first_name,
    middleName: casual.last_name,
    lastName: casual.last_name,
    ...mockEntity(args)
  }),

  Tag: (_, args) => ({
    name: casual.word,
    ...mockEntity(args)
  }),

  University: (_, args) => ({
    shortName: casual.word,
    longName: casual.words(casual.integer(2, 6)),
    ...mockEntity(args)
  }),

  Query: () => ({
    countries: mockConnection,
    tags: mockConnection,
    problems: mockConnection,
    universities: mockConnection
  })
}
