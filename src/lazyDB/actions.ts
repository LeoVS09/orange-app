// import {
//    AsyncConnectorEventTypes,
//    ModelEvent,
//    ModelEventGetPropertyPayload,
//    ModelEventReadPayload,
//    ModelEventSetPropertyPayload,
//    ModelEventTypes,
// } from './events'
// import {generateQueryEntityById, QueryField} from './connectors/queryMapper'
// import {client} from '@/api/database/utils'
// import {
//    addOrUpdate,
//    dateToStringFormatter,
//    extractEntityNameFromManyKey,
//    isSchemaField,
//    lastObjectPropertyName,
//    wait,
// } from './utils'
// import {AbstractData, ModelAttributeType, ModelSchema} from './types'
// import {ModelObserver} from '@/lazyReactiveORM/ModelObserver'
//
//
// export function appendPropertyToSchema(schema: ModelSchema, {name, inner, type}: ModelEventGetPropertyPayload): boolean {
//    if (!inner) {
//       if (schema[name]) {
//          return false
//       }
//
//       schema[name] = type
//       return true
//    }
//
//    let property = schema[name]
//
//    if (!property || !isSchemaField(property)) {
//       property = schema[name] = {
//          type,
//          fields: {},
//       }
//    }
//
//    return appendPropertyToSchema(property.fields, inner)
// }
//
// // TODO: multiple types of object schema, need better solution
// export function schemaToQueryFields(schema: ModelSchema): Array<string | QueryField> {
//    const keys = Object.keys(schema)
//
//    return keys.map((key) => {
//       const field = schema[key]
//       if (!isSchemaField(field)) {
//          return key
//       }
//
//       return {
//          entity: key,
//          type: field.type,
//          fields: schemaToQueryFields(field.fields as ModelSchema),
//       }
//    })
// }
//
//
// const ONE_TO_MANY_KEY = 'nodes'
//
//
//
// export const actions: IActionsInterface = {
//
//    [ModelEventTypes.GetProperty](model: ModelObserver, payload: ModelEventGetPropertyPayload): boolean {
//       return appendPropertyToSchema(model.readSchema, payload)
//    },
//
//    [ModelEventTypes.SetProperty](model: ModelObserver, {name, newValue}: ModelEventSetPropertyPayload) {
//       model.data[name] = newValue
//    },
//
//
//
//    [ModelEventTypes.ReadSuccess](model: IModelObserver, data: {[key: string]: any}) {
//       const formated = dateToStringFormatter(data)
//       model.data = {
//          ...model.data,
//          ...formated,
//       }
//
//       Object.keys(formated).forEach((key) => {
//          const value = formated[key]
//
//          let type = model.schema[key]
//          if (typeof type === 'object') {
//             type = type.type
//          }
//
//          if (type === ModelAttributeType.Simple) {
//             return
//          }
//
//          const {db} = model
//          if (!db) {
//             console.warn('Not have database in model observer to add more entities')
//             return
//          }
//
//          if (type === ModelAttributeType.OneToMany) {
//             console.log('Try add nodes to db')
//             const nodes = value[ONE_TO_MANY_KEY] as Array<{id: string}>
//
//             const entity = extractEntityNameFromManyKey(key)
//
//             nodes.forEach((node) => addOrUpdate(db, entity, node))
//
//             console.log('result of db', db)
//          }
//
//          if (type === ModelAttributeType.OneToOne) {
//             console.log('Try add one node')
//
//             addOrUpdate(db, key, value)
//
//             console.log('result of db', db)
//          }
//
//       })
//    },
//
// }
//
