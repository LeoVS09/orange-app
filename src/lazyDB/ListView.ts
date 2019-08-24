// import {
//    addNestingLevelToGetEvents,
//    attachEventDispatcherIfNotHave,
//    getEventDispatcher,
//    pushEventToLevelUp,
//    wrapData, wrapGetEventToNestingLevel
// } from "@/lazyReactiveORM/wrapData";
// import {
//    AbstractData,
//    ILazyReactiveDatabase, IPredefinedSchema, ListSource,
//    ListViewObserverReference,
//    ModelAttributeType, ModelSchema,
//    EventProducer
// } from "@/lazyReactiveORM/types";
// import {
//    ModelEventGetPropertyPayload,
//    ModelEventSetPropertyPayload,
//    ModelEventTypes,
// } from "@/lazyReactiveORM/events";
// import {addOrUpdate} from "@/lazyReactiveORM/utils";
// import StatefulModel from "@/lazyReactiveORM/StatefulModel";
// import {getObserver, IModelObserverOptions} from "@/lazyReactiveORM/ModelObserver";
// import {EventsHandler, getEventHandler} from "@/lazyReactiveORM/EventsHandler";
// import {actions} from "@/lazyReactiveORM/actions";
// import {createDraft, finishDraft} from 'immer'
// import {ModelEventDispatcher} from "@/lazyReactiveORM/core/dispatcher";
//
//
//
// export interface SourceProducer<T> {
//    (): T
// }
//
// export function toProducer<T>(source: T | SourceProducer<T>): SourceProducer<T> {
//    if(typeof source === 'function')
//       return source as SourceProducer<T>
//
//    return () => source
// }
//
// export function wrapView(source: AbstractData | SourceProducer<AbstractData>){
//    const view = {}
//    const {dispatcher} = attachEventDispatcherIfNotHave(view)
//
//    const producer = toProducer(source)
//
//    Object.keys(producer()).forEach(key => {
//       Object.defineProperty(view, key, {
//          get(){
//             dispatcher.atomicGet(key, source)
//             return producer()[key]
//          },
//          set(value: any){
//             const oldValue = producer()[key]
//             dispatcher.atomicSet(key, oldValue, value, source)
//          }
//       })
//    })
//
//    return view
// }
//
// export const defaultListSource = <T>(): ListSource<T> => ({
//    nodes: [],
//    totalCount: null,
//    onPage: 10,
//    pageNumber: 1,
//    get maxPageNumber(){
//       return maxPageNumber(this)
//    }
// })
//
// export class ListViewObserver extends StatefulModel {
//
//    public source: ListSource<AbstractData>
//    public nextDraft: ListSource<AbstractData>
//    public readSchema: ModelSchema
//
//
//    constructor(source: ListSource<AbstractData> = defaultListSource(), {
//       changed = () => {},
//       excludeProperties = []
//    }: IModelObserverOptions = {}) {
//       const view = wrapView(source)
//       attachEventDispatcherIfNotHave(view)
//       super(view, excludeProperties, changed)
//
//       if(!source.nodes.length) {
//          const trap = wrapData()
//          source.nodes.push(trap)
//       }
//
//       this.source = source
//       // @ts-ignore
//       this.source[ListViewObserverReference] = this
//
//       this.nextDraft = createDraft(this.source)
//
//       this.readSchema = {}
//
//       setSubscriptionToObserversAndDispatchers(source, 'nodes', ModelAttributeType.OneToMany, this.dispatcher)
//    }
// }
//
// function setSubscriptionToObserversAndDispatchers(
//    source: ListSource<AbstractData>,
//    name: string,
//    type: ModelAttributeType,
//    dispatcher: ModelEventDispatcher
// ) {
//    source.nodes.forEach(node => {
//       const eventHandler = getEventHandler(node)
//
//       if(eventHandler) {
//
//          // TODO: need keep subscription appended to data
//          const subscription = eventHandler.events.subscribe(event => {
//             const wrapped = wrapGetEventToNestingLevel(name, type, event)
//             dispatcher.eventsSubject.next(wrapped)
//          })
//          return
//       }
//
//       if(!getEventDispatcher(node))
//          return;
//
//       pushEventToLevelUp(node, dispatcher, 'nodes', ModelAttributeType.OneToMany)
//    })
// }
//
// export const listActions = {
//    [ModelEventTypes.SetProperty]: ({name, data, newValue}: ModelEventSetPropertyPayload) => {
//       const source = data as ListSource<any>
//
//       if('onPage' === name) {
//          source.onPage = newValue
//          return
//       }
//
//       if('pageNumber' === name) {
//          source.pageNumber = newValue
//          return;
//       }
//    },
//    [ModelEventTypes.GetProperty]: (payload: ModelEventGetPropertyPayload) => {
//       const
//    },
//
//    ['get/nodes[0]']: (value: string) => {},
//    ['get/totalCount']: () => {},
//
//    // TODO: add sorting and filtering
//
//    // Memory store all get events to trap
//    // All change events generate new read event, as and get for new fields
//    ['read']: ({itemsPerPage, pageNumber}: ListSource<any>, getEvents: Array<ModelEventGetPropertyPayload>) => {
//       return {
//          nodes: await fetchList(modelName, itemsPerPage, pageNumber),
//          totalCount: await fetchTotalCount(modelName)
//       }
//    },
//
//    // In this conception all success read events will caching,
//    // where request is state which used as key,
//    // and response[nodes][id] is values
//    ['read success']: (request: ListSource<any>, response: ListSource<any>, cache: Cache, db: ILazyReactiveDatabase) => {
//       saveInCache(cache, request, response.nodes.map(node => node.id))
//
//       response.nodes.map(node => addOrUpdate(db, node))
//    },
//
//    ['try read cache']: (request: ListSource<any>, cache: ListCache, db: ILazyReactiveDatabase) => {
//       const {nodesId} = findInCache(cache, request)
//       if(!nodesId)
//          return null
//
//       return {
//          nodes: nodesId.map(id => db.findOne(id))
//       }
//    }
//
// }
