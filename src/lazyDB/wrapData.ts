// import {ModelObserver} from './ModelObserver'
// import {
//    AbstractData, ILazyReactiveDatabase,
//    IPredefinedSchema,
//    ModelAttributeType,
//    ModelEventDispatcherReference, ModelSchema,
//    ModelStateMemoryReference, StateReference, EventProducer
// } from './types'
// import {Observable, Subject} from 'rxjs'
// import {
//    ModelEvent,
//    ModelEventGetPropertyPayload,
//    ModelEventSetPropertyPayload,
//    ModelEventTypes
// } from '@/lazyReactiveORM/events'
// import {isSchemaField, lastObjectPropertyName} from '@/lazyReactiveORM/utils'
// import {filter, map, share} from 'rxjs/operators'
// import {ModelEventDispatcher} from "@/lazyReactiveORM/core/dispatcher";
// import {ModelStateMemory} from "@/lazyReactiveORM/ModelStateMemory";
// import {getEventPayloadsEqual} from "@/lazyReactiveORM/database/eventFilters";
//
// // TODO: refactor, what if you put eventStream, but already have stateMemory
// export function attachStateMemoryIfNotHave(data: AbstractData, eventStream: Observable<ModelEvent>): { stateMemory: ModelStateMemory, have: boolean } {
//    const symbol = ModelStateMemoryReference as unknown as string
//    if(data[symbol])
//       return { stateMemory: data[symbol], have: false }
//
//    const stateMemory = data[symbol] = new ModelStateMemory(eventStream)
//    return {stateMemory, have: false}
// }
//
//
//
//
// export const getEventDispatcher = (data: EventProducer): ModelEventDispatcher =>
//    data[ModelEventDispatcherReference as unknown as string]
//
// export const getStateMemory = (data: EventProducer): ModelStateMemory =>
//    data[ModelStateMemoryReference as unknown as string]
//
// export function applySchemaToData(
//    schema: IPredefinedSchema,
//    target: {[key: string]: any},
//    db?: ILazyReactiveDatabase,
//    nestingLevels = 0
// ) {
//    const dispatcher = getEventDispatcher(target)
//
//    // TODO: refactor, very hard recursive
//    const makeTrap = (key: string, type: ModelAttributeType) => {
//       if(!db)
//          return wrapData()
//
//       const schema = db.getSchemaByKey(key, type) || {}
//
//       const trapData = {}
//       const trap = wrapData(trapData)
//
//       if(nestingLevels > 0)
//          applySchemaToData(schema, trapData, db, nestingLevels - 1)
//       else
//          applySchemaToData(schema, trapData)
//
//       return trap
//    }
//
//    Object.keys(schema).forEach((key) => {
//       let type = schema[key]
//
//       const trap = makeTrap(key, type)
//       const isAppended = appendTrapToData(target, key, type, trap)
//
//       if(!isAppended)
//          return
//
//       pushEventToLevelUp(trap, dispatcher, key, type)
//    })
// }
//
// export function predefinedToRealSchema(predefinedSchema: IPredefinedSchema): ModelSchema {
//
//    const schema: ModelSchema = {}
//
//    Object.keys(predefinedSchema).forEach(key => {
//       const type = predefinedSchema[key]
//
//       if (type === ModelAttributeType.Simple) {
//          schema[key] = type
//          return
//       }
//
//       schema[key] = {
//          type,
//          fields: {},
//       }
//    })
//
//    return schema
// }
//
// export function appendTrapToData(data: AbstractData, name: string, type: ModelAttributeType, trap: EventProducer): boolean {
//    if (isSchemaField(type))
//       type = type.type
//
//    if (type === ModelAttributeType.Simple)
//       return false
//
//    if (type === ModelAttributeType.OneToOne) {
//       data[name] = trap
//       return true
//    }
//
//    if (type === ModelAttributeType.OneToMany) {
//       data[name] = {
//          nodes: [trap],
//       }
//       return true
//    }
//
//    return false
// }
//
// export function pushEventToLevelUp(
//    trap: AbstractData,
//    dispatcher: ModelEventDispatcher,
//    name: string,
//    type: ModelAttributeType
// ) {
//    const trapDispatcher = getEventDispatcher(trap)
//    if(!trapDispatcher)
//       return console.error('Not have dispatcher to push event up')
//
//    trapDispatcher.eventsSubject
//       .pipe(
//          addNestingLevelToGetEvents(name, type)
//       )
//       .subscribe(event =>
//          // TODO: may be not use event subject outside dispatcher
//          dispatcher.eventsSubject.next(event)
//       )
// }
//
//
