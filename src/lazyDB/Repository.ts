// import db from './database/Database'
// import {ChangeCallback, IPredefinedSchema, ModelSchema} from './types'
// import { ModelObserver} from './ModelObserver'
// import {applySchemaToData, wrapData} from '@/lazyReactiveORM/wrapData'
// import {debounceTime, filter, share, tap} from 'rxjs/operators'
// import {ModelEvent, ModelEventTypes} from '@/lazyReactiveORM/events'
// import {READ} from '@/store/CrudModule/actionTypes'
// import {actions, appendPropertyToSchema, schemaToQueryFields} from '@/lazyReactiveORM/actions'
// import {generateQueryEntityById, generateQueryList} from '@/lazyReactiveORM/queryMapper'
// import {client} from '@/api/database/utils'
// import {addOrUpdate, dateToStringFormatter, isSchemaField, wait} from './utils'
// import {getsSpawnReadEvent, setsSpawnUpdate} from "@/lazyReactiveORM/database/eventsCycle";
// import {ModelStateMemory} from "@/lazyReactiveORM/ModelStateMemory";
// import {ModelEventDispatcher} from "@/lazyReactiveORM/core/dispatcher";
// import {appendEventHandler, EventsHandler} from "@/lazyReactiveORM/EventsHandler";
//
// const READ_LIST_TIME = 10
//
// export default class Repository {
//    public entity: string
//    public predefinedSchema?: IPredefinedSchema
//    public db = db
//    public itemsPerPage = 3
//
//    constructor(entity: string, predefinedSchema?: IPredefinedSchema) {
//       this.entity = entity
//       this.predefinedSchema = predefinedSchema
//
//       if (this.predefinedSchema) {
//          this.db.addPredefinedSchema(this.entity, this.predefinedSchema)
//       }
//    }
//
//    public findOne(id: string, changed?: ChangeCallback) {
//       if (!id) {
//          return
//       }
//
//       console.log('Have schemas to build model', Object.keys(this.db.schemas))
//
//       const founded = this.db.findOne(this.entity, id, false)
//       if (founded) {
//          founded.changed = changed
//          return founded.wrapped
//       }
//
//       const observer = new ModelObserver({id}, { changed, excludeProperties: this.db.excludeProperties })
//
//       if(this.predefinedSchema)
//          applySchemaToData(this.predefinedSchema, observer.data, this.db, 2)
//
//       applyEventsCycle(observer.memory, observer.dispatcher, () => !!observer.data.id)
//
//       appendEventHandler(observer.data, observer.events, actions)
//
//       this.db.set(this.entity, id, observer)
//
//       return observer.wrapped
//    }
//
//    public list() {
//
//       const trap = wrapData()
//
//       const list = {
//          totalCount: null,
//          nodes: [trap],
//       }
//
//       const memory =
//
//       const inMemory = (event: ModelEvent) =>
//          event.type === ModelEventTypes.GetProperty &&
//          event.payload.name === name
//
//       // TODO: Move duplicated code actions
//       stream
//          .pipe(
//             filter((event: ModelEvent) => event.type === ModelEventTypes.GetProperty),
//             filter((event: ModelEvent) => !inMemory(event)),
//             tap((event: ModelEvent) => memory.push(event)),
//             debounceTime(READ_LIST_TIME),
//          )
//          .subscribe(async (event: ModelEvent) => {
//             const gets = memory.filter(({payload}) =>
//                !this.db.excludeProperties.some((value) => value === payload.name ),
//             )
//
//             const readProperties = {}
//             // Schema have information, but gets events not have
//             // Data is duplicated
//             gets.forEach((event) => appendPropertyToSchema(readProperties, event.payload))
//             console.log('memory', gets, 'readProperties', readProperties)
//
//             if (this.db.tables[this.entity]) {
//                console.log('list have entity in db', this.entity)
//                const itemIds = Object.keys(this.db.tables[this.entity])
//
//                const first = this.db.tables[this.entity][itemIds[0]]
//                if (isSchemaInclude(first.schema, readProperties)) {
//                   console.log('required schema have in db')
//
//                   list.nodes = itemIds.map((id) => this.db.tables[this.entity][id].wrapped)
//                }
//
//                if (itemIds.length >= this.itemsPerPage) {
//                   console.log('list have required items size in db')
//                   return
//                }
//             }
//
//             const listName = entityToList(this.entity)
//
//             const query = generateQueryList(listName, schemaToQueryFields(readProperties))
//
//             const { data } = await client.query({
//                query,
//             })
//
//             console.log('read data list', data)
//
//             const result = dateToStringFormatter(data[listName])
//             list.totalCount = result.totalCount
//             list.nodes = result.nodes
//
//             result.nodes.forEach((node: {id: string}) =>
//                addOrUpdate(this.db, this.entity, node),
//             )
//
//          })
//
//       return list
//    }
// }
//
// function entityToList(entity: string): string {
//    if (entity.slice(-1) === 'y') {
//       return entity.slice(0, -1) + 'ies'
//    }
//
//    return entity + 's'
// }
//
//
// function isSchemaInclude(base: ModelSchema, inside: ModelSchema): boolean {
//
//    for (const key in inside) {
//       if (!base[key]) {
//          return false
//       }
//
//       const insideField = inside[key]
//       const baseField = base[key]
//
//       if (!isSchemaField(insideField)) {
//          if (insideField !== baseField) {
//             return false
//          }
//
//          continue
//       }
//
//       if (!isSchemaField(baseField)) {
//          return false
//       }
//
//       if (insideField.type !== baseField.type) {
//          return false
//       }
//
//       if (!isSchemaInclude(baseField.fields, insideField.fields)) {
//          return false
//       }
//    }
//
//    return true
// }
//
// function applyEventsCycle(memory: ModelStateMemory, dispatcher: ModelEventDispatcher, canRead: () => boolean) {
//    // TODO: refactor
//    getsSpawnReadEvent(memory, dispatcher, canRead)
//    setsSpawnUpdate(memory, dispatcher)
// }