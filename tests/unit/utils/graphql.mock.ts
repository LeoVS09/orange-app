import { buildClientSchema, IntrospectionQuery, graphql } from 'vue-cli-plugin-apollo/node_modules/graphql'
import { addMockFunctionsToSchema } from 'vue-cli-plugin-apollo/node_modules/graphql-tools'
import * as schemaFile from '../../../graphql.schema.json'
// @ts-ignore
import mocks from '../../../apollo-server/mocks'
import wrapForCache from './record-requests'
import { WaitStore } from './wait'

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

// Allow check request parameters before send
export interface CheckRequestParams {
    (params: any): void
}

export interface NockAllGraphqlRequestsControls {
    waits: WaitStore
    checkRequestParams: CheckRequestParams
}

export const nockAllGraphqlRequests = async (nock: any, name: string): Promise<NockAllGraphqlRequestsControls> => {
    const mockedGraphql = await mockGraphql(name)
    const controls: NockAllGraphqlRequestsControls = {
        waits: new WaitStore(),
        checkRequestParams: () => {}
    }
    
    nock('http://localhost:4000')
    .post('/graphql')
    .reply(async (uri: any, requestBody: any, cb: any) => {
      console.log('Was made requiest', requestBody)

      controls.checkRequestParams({ query: requestBody.query, variables: requestBody.variables })
      
      const result = await mockedGraphql(requestBody.query as string, requestBody.variables)
      
      console.log('result of requies', requestBody, result)
      cb(null, [200, result])

      controls.waits.resolve()
      return
    })

    return controls
}