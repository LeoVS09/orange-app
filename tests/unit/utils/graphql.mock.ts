import { buildClientSchema, IntrospectionQuery, graphql } from 'vue-cli-plugin-apollo/node_modules/graphql'
import { addMockFunctionsToSchema } from 'vue-cli-plugin-apollo/node_modules/graphql-tools'
import * as schemaFile from '../../../graphql.schema.json'
// @ts-ignore
import mocks from '../../../apollo-server/mocks'
import wrapForCache from './record-requests'

const mockGraphql = async (name: string) => {
    const schema = buildClientSchema(schemaFile as unknown as IntrospectionQuery)

    addMockFunctionsToSchema({ 
        schema,
        mocks
    })

    const cached = await wrapForCache(
        name, 
        (query: string, variables?: any) => graphql(schema, query, undefined, undefined, variables)
        )

    return cached
}

export default mockGraphql

export const nockAllGraphqlRequests = async (nock: any, name: string) => {
    const mockedGraphql = await mockGraphql(name)

    nock('http://localhost:4000')
    .post('/graphql')
    .reply(async (uri: any, requestBody: any, cb: any) => {
      console.log('Was made requiest', requestBody)
      const result = await mockedGraphql(requestBody.query as string, requestBody.variables)
      console.log('result of requies', requestBody, result)
      return cb(null, [200, result])
    })
}