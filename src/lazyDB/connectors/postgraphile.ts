// import {IProducerStore} from "@/lazyDB/core/types";
// import {AsyncConnectorEventTypes, ModelEventReadPayload} from "@/lazyDB/database/events";
// import {generateQueryEntityById} from "@/lazyDB/connectors/queryMapper";
//
// import {AsyncConnectorReducersMap} from "@/lazyDB/database/types";
// // Move out from api
// import {client} from "@/api/database/utils";
//
//
// const postraphileConnector: (entity: string) => AsyncConnectorReducersMap = entity => ({
//
//    async [AsyncConnectorEventTypes.Read]({base: {id}}: IProducerStore, {schema}: ModelEventReadPayload) {
//       if(!id)
//          throw new Error('Data not have id to read')
//
//       const query = generateQueryEntityById(entity, schemaToQueryFields(schema))
//
//       const {data, errors} = await client.query({
//          query,
//          variables: {id},
//       })
//
//       if(errors) {
//          console.error('Errors on read request to entity', entity, 'with returned data:', data, 'and errors', errors)
//          throw new Error('Error on request' + errors.toString())
//       }
//
//       return data[entity]
//    },
// })
