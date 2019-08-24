// import {ChangeCallback, EventProducer} from "@/lazyReactiveORM/types";
// import {ModelEventDispatcher} from "@/lazyReactiveORM/core/dispatcher";
// import {ModelStateMemory} from "@/lazyReactiveORM/ModelStateMemory";
// import {Observable} from "rxjs";
// import {ModelEvent, ModelEventTypes} from "@/lazyReactiveORM/events";
// import {attachStateMemoryIfNotHave, getEventDispatcher} from "@/lazyReactiveORM/wrapData";
// import {filter, share} from "rxjs/operators";
// import {excludeGetEventWithNames, notHaveGetEventInMemory} from "@/lazyReactiveORM/database/eventFilters";
//
// export default class StatefulModel {
//
//    public wrapped: EventProducer
//    public dispatcher: ModelEventDispatcher
//    public memory: ModelStateMemory
//    public excludeProperties: Array<string>
//    public events: Observable<ModelEvent>
//    public changed: ChangeCallback
//
//    constructor(wrapped: EventProducer, excludeProperties: Array<string> = [], changed: ChangeCallback = () => {}){
//       this.wrapped = wrapped
//       this.excludeProperties = excludeProperties
//
//       this.dispatcher = getEventDispatcher(this.wrapped)
//
//       const events = this.dispatcher.eventsSubject
//          .pipe(
//             filter(excludeGetEventWithNames(this.excludeProperties)),
//             filter(notHaveGetEventInMemory(this.wrapped))
//          )
//
//       const {stateMemory} = attachStateMemoryIfNotHave(this.wrapped, events)
//       this.memory = stateMemory
//
//       this.events = this.memory.eventStream.pipe(share())
//
//       this.changed = changed
//
//       callOnAllExclude(
//          this.events,
//          [ModelEventTypes.GetProperty],
//          () => this.changed()
//       )
//    }
// }
//
// export function callOnAllExclude(eventsStream: Observable<ModelEvent>, eventTypes: Array<ModelEventTypes>, handler: () => void) {
//    eventsStream.subscribe((event) => {
//       if(!eventTypes.some((type) => type === event.type))
//          handler()
//    })
// }
