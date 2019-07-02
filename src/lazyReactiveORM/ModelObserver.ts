import {merge, Observable, Subject} from 'rxjs'
import {debounceTime, filter, map, sample, share, skipWhile, takeWhile, tap, throttleTime} from 'rxjs/operators';
import {
   ModelEvent,
   ModelEventGetPropertyPayload,
   ModelEventReadPayload,
   ModelEventSetPropertyPayload,
   ModelEventType
} from "./events";
import {
   AbstractData,
   ChangeCallback, ILazyReactiveDatabase,
   IModelObserver,
   IPredefinedSchema,
   ModelAttributeType,
   ModelObserverReference,
   ModelSchema
} from "./types";
import {actions as baseActions, IActionsInterface} from "./actions";
import {wrapData} from "@/lazyReactiveORM/wrapData";

const UPDATE_TIME = 1000
const READ_TIME = 10
const REDUSE_SET_TIME = 500

export interface IModelObserverOptions {
   id?: string
   changed?: ChangeCallback
   predefinedSchema?: IPredefinedSchema
   actions?: IActionsInterface
   data?: AbstractData
   db?: ILazyReactiveDatabase
}

export class ModelObserver implements IModelObserver {

   entity: string
   id: string | undefined
   predefinedSchema?: IPredefinedSchema

   private eventStream = new Subject<ModelEvent>()
   public events: Observable<ModelEvent>
   memory: Array<ModelEvent> = []
   data: AbstractData
   wrapped: AbstractData
   schema: ModelSchema = {}
   changed: ChangeCallback
   actions: IActionsInterface
   db?: ILazyReactiveDatabase

   constructor(entity: string, {id, changed = () => {}, predefinedSchema, actions, data = {}, db}: IModelObserverOptions) {
      this.entity = entity
      this.id = id
      this.changed = changed
      this.predefinedSchema = predefinedSchema
      this.db = db

      this.actions = {
         ...baseActions,
         ...actions
      }

      this.data = {
         ...data,
         [ModelObserverReference]: this
      }
      this.wrapped = wrapData(this)

      if(this.id){
         this.data.id = this.id
         this.schema['id'] = ModelAttributeType.Simple
      }

      // TODO: refactor this shi...
      if(this.predefinedSchema)
         Object.keys(this.predefinedSchema).forEach(key => {
            const type = this.predefinedSchema![key]

            if(type === ModelAttributeType.Simple) {
               this.schema[key] = type
               return;
            }

            this.schema[key] = {
               type,
               fields: {}
            }

            const [trap, stream] = makeTrap()

            stream.subscribe((event: ModelEvent) => {
               if(event.type !== ModelEventType.GetProperty)
                  return

               const payload: ModelEventGetPropertyPayload = {name: key, inner: event.payload, type}
               this.dispatch(ModelEventType.GetProperty, payload)
            })

            if(type === ModelAttributeType.OneToMany){
               this.data[key] = {
                  nodes: [trap]
               }
               return
            }

            if(type === ModelAttributeType.OneToOne) {
               this.data[key] = trap
               return
            }
         })

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


      console.log('Model observer created', this.schema, this.data)
   }

   public updateData(data: AbstractData){
      this.data = {
         ...this.data,
         ...data
      }

      // TODO: need logic process memory
   }

   handleEvent(event: ModelEvent){

      const handler = this.actions[event.type]

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
      return !!this.schema[name]
   }

   get(name: string): any {
      if(!this.has(name)) {
         const payload: ModelEventGetPropertyPayload = {name, type: ModelAttributeType.Simple}
         this.dispatch(ModelEventType.GetProperty, payload)

         return null
      }

      const property = this.schema[name]
      const type = typeof property === 'object' ? property.type : property

      if(type === ModelAttributeType.Simple)
         return this.data[name]

      if(type === ModelAttributeType.OneToMany)
         return this.data[name].nodes
   }

   set(name: string, value: any): boolean {
      if(!this.has(name))
         this.schema[name] = ModelAttributeType.Simple

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



export function makeTrap() {
   const subject = new Subject()

   const data = new Proxy<AbstractData>({}, {
      // TODO: duplicated code, make data as emitter
      get(target: AbstractData, property: string | number | symbol): any {
         if(typeof property === 'number' || typeof property === 'symbol')
            return null

         if(property === 'toJSON')
            return null

         const payload: ModelEventGetPropertyPayload = {name: property, type: ModelAttributeType.Simple}
         subject.next({type: ModelEventType.GetProperty, payload, date: Date.now()})
         return null
      },

      // TODO: is this need?
      set(target: AbstractData, property: string | number | symbol, value: any): boolean {
         return false
      },

      has(target: AbstractData, p: string | number | symbol): boolean {
         return false
      },

      ownKeys(target: AbstractData): PropertyKey[] {
         return []
      }
   })

   return [data, subject]
}
