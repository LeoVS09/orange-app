// Enable mocking in vue.config.js with `"pluginOptions": { "enableMocks": true }`
// Customize mocking: https://www.apollographql.com/docs/graphql-tools/mocking.html#Customizing-mocks
import shortid from 'shortid'
import casual from 'casual'
import { MockList } from 'vue-cli-plugin-apollo/node_modules/graphql-tools'

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

const mockConnection = () => ({
  nodes: () => new MockList([5, 20])
})

export default {
  UUID: () => shortid.generate(),
  Datetime: () => new Date().toISOString(),
  Int: () => getRandomInt(20) + 5,

  Country: () => ({
    name: casual.country
  }),

  City: () => ({
    name: casual.city
  }),

  Problem: () => ({
    name: casual.title,
    desciption: casual.text
  }),

  User: () => ({
    name: casual.name,
    username: casual.username
  }),

  Profile: () => ({
    firstName: casual.first_name,
    middleName: casual.last_name,
    lastName: casual.last_name
  }),

  Tag: () => ({
    name: casual.word
  }),

  Query: () => ({
    countries: mockConnection,
    tags: mockConnection,
    problems: mockConnection
  })
}
