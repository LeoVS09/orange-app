import {Subject, AsyncSubject, Observable, merge} from 'rxjs'
import {filter, debounceTime, share, tap, scan, takeWhile, throttleTime, sample, skip, skipWhile, map} from 'rxjs/operators';
import {generateQueryEntityById} from "./queryMapper";
import {client} from '@/api/database/utils'
import {dateToStringFormatter} from "./utils";

export enum ModelEventType {
   GetProperty = "GetProperty",
   Read = "Read",
   ReadSuccess = "ReadSuccess",
   ErrorReading = "ErrorReading",

   SetProperty = "SetProperty",
   Update = "Update",
   UpdateSuccess = "UpdateSuccess",
   ErrorUpdated = "ErrorUpdated",

   New = "New",
   Create = "Create",
   CreateSuccess = "CreateSuccess",
   ErrorCreating = "ErrorCreating",

   Delete = "Delete",
   DeleteSuccess = "DeleteSuccess",
   ErrorDeleting = "ErrorDeleting",
}

export interface ModelEvent<T = any> {
   type: string
   date: number
   payload: T
}

export interface ModelEventSetPropertyPayload {
   name: string
   oldValue: string | null
   newValue: string
}

export interface ModelEventGetPropertyPayload {
   name: string
}

export interface ModelEventReadPayload {
   id: string
   gets: Array<ModelEvent<ModelEventGetPropertyPayload>>
}

const UPDATE_TIME = 1000
const READ_TIME = 10
const REDUSE_SET_TIME = 500

export interface AbstractData {
   [key: string]: any
}

export interface ChangeCallback {
   (): void
}

export class ModelObserver {

   entity: string
   id: string | undefined

   private eventStream = new Subject<ModelEvent>()
   public events: Observable<ModelEvent>
   memory: Array<ModelEvent> = []
   data: AbstractData = {}
   schema = new Array<string>()
   changed: ChangeCallback

   constructor(entity: string, id?: string, changed: ChangeCallback = () => {}) {
      this.id = id
      this.changed = changed

      if(this.id){
         this.data.id = this.id
         this.schema.push('id')
      }

      this.entity = entity
      this.events = this.eventStream
         .pipe(
            tap(event => this.memory.push(event)),
            share()
         )

      /*
      * Take all get events, when pause spawn read event
      * If when reading was gte events, after read success spawn another read event
      * */
      takeWhileThenContinue(
         this.events.pipe(filter(event => event.type === ModelEventType.GetProperty)),
         () => !!this.id && !this.isReading, // TODO: not use id this way
         this.events.pipe(filter(event => event.type === ModelEventType.ReadSuccess))
      )
         .pipe(
            debounceTime(READ_TIME),
            map(() => this.excludeEvents(ModelEventType.GetProperty))
         )
         .subscribe(gets => this.dispatch(ModelEventType.Read, {id: this.id, gets} as ModelEventReadPayload))

      const setEvents = this.events.pipe(
         filter(event => event.type === ModelEventType.SetProperty),
         share()
      )

      setEvents
         .pipe(throttleTime(REDUSE_SET_TIME))
         .subscribe(() => this.reduceSetEvents())

      // TODO: refactor
      takeWhileThenContinue(
         setEvents,
         () => !this.isUpdating,
         this.events.pipe(filter(event => event.type === ModelEventType.UpdateSuccess))
      )
         .pipe(
            debounceTime(UPDATE_TIME),
            map(() => this.excludeEvents(ModelEventType.SetProperty))
         )
         .subscribe(events => this.dispatch(ModelEventType.Update, events))


      this.events
         .pipe(filter(event => [ModelEventType.ReadSuccess].indexOf(event.type as ModelEventType) !== -1))
         .subscribe(() => this.changed())

      this.events.subscribe(event => this.handleEvent(event))

   }

   handleEvent(event: ModelEvent){
      // @ts-ignore
      const handler = actions[event.type]

      console.log('event', event, 'handler', !!handler)

      if(!handler)
         return

      if(event.type === ModelEventType.Read){
         const gets = this.excludeEvents(ModelEventType.GetProperty)
         handler(this, event.payload, gets)
            .then((data: any) => {
               this.removeEvent(event)
               this.dispatch(ModelEventType.ReadSuccess, data)
            })
            .catch((error: any) => {
               this.removeEvent(event)
               this.dispatch(ModelEventType.ErrorReading, error)
            })
         return;
      }

      handler(this, event.payload)

   }

   has(name: string){
      return this.schema.indexOf(name) !== -1
   }

   get(name: string): any {
      if(this.has(name))
         return this.data[name]

      const payload: ModelEventGetPropertyPayload = {name}
      this.dispatch(ModelEventType.GetProperty, payload)

      return null
   }

   set(name: string, value: any): boolean {
      if(!this.has(name))
         return false

      const payload: ModelEventSetPropertyPayload = {
         name,
         oldValue: this.data[name],
         newValue: value
      }
      this.dispatch(ModelEventType.SetProperty, payload)

      return true
   }

   dispatch(type: string, payload: any = null) {
      this.eventStream.next({type, payload, date: Date.now()})
   }

   get isReading(): boolean {
      return this.memory.some(event => event.type === ModelEventType.Read)
   }

   get isChanged(){
      return this.memory.some(event => event.type === ModelEventType.SetProperty)
   }

   get isUpdating(){
      return this.memory.some(event => event.type === ModelEventType.Update)
   }

   get isNew(){
      return this.memory.some(event => event.type === ModelEventType.New)
   }

   get isCreate(){
      return this.memory.some(event => event.type === ModelEventType.Create)
   }

   get isRemoved(){
      return this.memory.some(event => event.type === ModelEventType.DeleteSuccess)
   }

   reduceSetEvents(){
      const setEvents = this.excludeEvents(ModelEventType.SetProperty) as Array<ModelEvent<ModelEventSetPropertyPayload>>

      const result: Array<ModelEvent<ModelEventSetPropertyPayload>> = []
      setEvents.sort((a, b) => a.date - b.date).forEach(event => {
         const setEvent = result.find(e => e.payload.name === event.payload.name)
         if(!setEvent)
            return result.push(event)

         setEvent.payload.newValue = event.payload.newValue
         setEvent.date = event.date
         return
      })

      this.memory = [...this.memory, ...result]
      return setEvents
   }

   excludeEvents(type: ModelEventType){
      const [searching, other] = splitArray(this.memory, event => event.type === type)

      this.memory = other
      return searching
   }

   removeEvent(searchingEvent: ModelEvent){
      const [searching, other] = splitArray(this.memory, event => event === searchingEvent)

      this.memory = other
      return !!searching.length
   }

}

function splitArray<T>(arr: Array<T>, predicate: (v: T) => boolean) {
   const searching = new Array<T>()
   const other = new Array<T>()

   arr.forEach(val => {
      if(predicate(val))
         return searching.push(val)

      return other.push(val)
   })

   return [searching, other]
}

// TODO: turn into operator
function takeWhileThenContinue<T>(stream: Observable<T>, predicate: (v: T) => boolean, sampler: Observable<any>) {
   const whileTrue = stream.pipe(takeWhile(predicate))
   const lastWhenFalse = stream.pipe(
      skipWhile(predicate),
      sample(sampler)
   )

   return merge(
      whileTrue,
      lastWhenFalse
   )
}

const actions = {

   [ModelEventType.GetProperty](model: ModelObserver, {name}: ModelEventGetPropertyPayload){
      model.schema.push(name)
   },

   [ModelEventType.SetProperty](model: ModelObserver, {name, newValue}: ModelEventSetPropertyPayload) {
      model.data[name] = newValue
   },

   async [ModelEventType.Read](model: ModelObserver, {id, gets}: ModelEventReadPayload){
      const query = generateQueryEntityById(model.entity, gets.map(event => event.payload.name))
      const { data } = await client.query({
         query,
         variables: {id}
      })

      return data[model.entity]
   },

   [ModelEventType.ReadSuccess](model: ModelObserver, data: {[key: string]: any}) {
      model.data = dateToStringFormatter(data)
   },

}

// function setPropertyProxy(properties: Array<string>) {
//    properties.map(property => defineLazyAsyncProp(this, property, async () => {
//       this.dispatch(ModelEventType.GetProperty, property)
//
//       return (await this.fetch())[property]
//    }))
//
// }


