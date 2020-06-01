// import {merge, Observable} from "rxjs";
// import {debounceTime, filter, map, sample, share, skipWhile, takeWhile, throttleTime} from "rxjs/operators";
// import {ModelEventReadPayload, ModelEventTypes} from "./events";
// import {IModelEventDispatcher, ModelEvent, ModelEventSetPropertyPayload} from "../core/types";
// import {StateMemory} from "../core/memory";
// import {isReading, isUpdating} from "@/lazyDB/database/states";
//
// const UPDATE_TIME = 1000
//
// const REDUCE_SET_TIME = 500
//
//
// export function setsSpawnReadEvent(
//    modelState: StateMemory<ModelEvent<any>>,
//    stream: Observable<ModelEvent<any>>,
//    dispatcher: IModelEventDispatcher,
//    canRead: () => boolean = () => true
// ) {
//    takeWhileThenContinue(
//       stream.pipe(filter((event) => event.type === ModelEventTypes.SetProperty)),
//       () => canRead() && !isReading(modelState),
//       stream.pipe(filter((event) => event.type === ModelEventTypes.ReadSuccess)),
//    )
//       .pipe(
//          map(() => modelState.filter(event => event.type === ModelEventTypes.SetProperty)),
//          filter((sets) => !!sets.length),
//       )
//       .subscribe((sets) => {
//          const payload: ModelEventReadPayload = {gets}
//          dispatcher.dispatch(ModelEventTypes.Read, payload)
//       })
// }
//
// export function setsSpawnUpdate(
//    modelState: StateMemory<ModelEvent<any>>,
//    stream: Observable<ModelEvent<any>>,
//    dispatcher: IModelEventDispatcher,
// ) {
//    const setEvents = stream.pipe(
//       filter((event) => event.type === ModelEventTypes.SetProperty),
//       share(),
//    )
//
//    setEvents
//       .pipe(throttleTime(REDUCE_SET_TIME))
//       .subscribe(() => reduceSetEvents(modelState))
//
//    // TODO: refactor
//    takeWhileThenContinue(
//       setEvents,
//       () => !isUpdating(modelState),
//       stream.pipe(filter((event) => event.type === ModelEventTypes.UpdateSuccess)),
//    )
//       .pipe(
//          debounceTime(UPDATE_TIME),
//          map(() => modelState.exclude(event => event.type === ModelEventTypes.SetProperty)),
//       )
//       .subscribe((events) => dispatcher.dispatch(ModelEventTypes.Update, events))
// }
//
// function reduceSetEvents(modelState: StateMemory<ModelEvent<any>>) {
//    const setEvents = modelState
//       .exclude(event => event.type === ModelEventTypes.SetProperty) as Array<ModelEvent<ModelEventSetPropertyPayload>>
//
//    const result: Array<ModelEvent<ModelEventSetPropertyPayload>> = []
//    setEvents.sort((a, b) => a.date - b.date).forEach((event) => {
//       const setEvent = result.find((e) => e.payload.name === event.payload.name)
//       if (!setEvent) {
//          return result.push(event)
//       }
//
//       setEvent.payload.newValue = event.payload.newValue
//       setEvent.date = event.date
//       return
//    })
//
//    modelState.memory = [...modelState.memory, ...result]
//    return setEvents
// }
//
