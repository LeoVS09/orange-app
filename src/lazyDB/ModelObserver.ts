// import {ModelEvent, ModelEventTypes,} from './events'
// import {AbstractData, ChangeCallback, ModelObserverReference, ModelSchema, EventProducer,} from './types'
// import StatefulModel from "@/lazyReactiveORM/StatefulModel";
// import {wrapData} from "@/lazyReactiveORM/wrapData";
// import {Observable} from "rxjs";
// import {createDraft} from "immer";
// import {getBaseData} from "@/lazyReactiveORM/utils";
//
// export interface ModelObserverSubscription {
//    (event: ModelEvent): void
// }
//
// export interface IModelObserverOptions {
//    changed?: ChangeCallback
//    excludeProperties?: string[]
// }
//
// export class ModelObserver extends StatefulModel {
//
//    public data: AbstractData
//    public nextDraft: AbstractData
//    public readSchema: ModelSchema
//
//    constructor(wrapped: EventProducer, {
//       changed = () => {},
//       excludeProperties = [],
//    }: IModelObserverOptions) {
//       super(wrapped, excludeProperties, changed)
//
//       this.data = getBaseData(wrapped) as AbstractData
//       this.data[ModelObserverReference as unknown as string] = this
//
//       this.nextDraft = createDraft(this.data)
//
//       this.readSchema = {}
//    }
// }
//
// export function getObserver(data: any): ModelObserver | undefined {
//    if (typeof data !== 'object') {
//       return
//    }
//
//    return data[ModelObserverReference as unknown as string] as ModelObserver
// }
//
// export function isReading(data: AbstractData, property?: string) {
//    const observer = getObserver(data)
//    console.log('is reading observer', observer)
//    if (!observer) {
//       return false
//    }
//
//    const {memory, dispatcher} = observer
//
//    if (!property) {
//       return memory.isReading
//    }
//
//    if (memory.eventLog.some((event) => event.type === ModelEventTypes.GetProperty && event.payload.name === property)) {
//       return true
//    }
//
//    if (property && !data.hasOwnProperty(property)) {
//       dispatcher.get(property)
//       return true
//    }
//
//    return false
// }
