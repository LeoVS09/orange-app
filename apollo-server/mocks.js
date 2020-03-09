// Enable mocking in vue.config.js with `"pluginOptions": { "enableMocks": true }`
// Customize mocking: https://www.apollographql.com/docs/graphql-tools/mocking.html#Customizing-mocks
import shortid from 'shortid'
import casual from 'casual'

export default {
  UUID: () => shortid.generate(),
  Datetime: () => new Date().toISOString(),

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
  })
}
