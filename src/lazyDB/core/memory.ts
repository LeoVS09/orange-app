import { splitArray } from './utils'

export interface ExcludePredicate<T> {
  (event: T): boolean
}

export interface ForgetMethod<T> {
  (...targets: Array<T>): void
  (predicate: ExcludePredicate<T>): Array<T>
}

/**
 * State Machine + Reactive Programming = State Memory
 * State memory allow create reactive state machine,
 * which allways compude his state based on events, which it "remember".
 * Each time when on render by React/Vue/Angular state of model, which state machine control, calulates base on his events,
 * when events removed or added it can be used to trigger rerender, with new state computations
 */
export class StateMemory<T> {
   // TODO: make field private
   public memory: Array<T> = []

   public push(...events: Array<T>) {
     this.memory.push(...events)
   }

   get length(): number {
     return this.memory.length
   }

   set length(length: number) {
     this.memory.length = length
   }

   // typescript not correctly work with multiple signature functions
   // @ts-ignore
   forget: ForgetMethod<T> = (...args) => {
     if (args.length > 1 || typeof args[0] !== 'function')
       return this.remove(...args)

     return this.exclude(args[0])
   }

   // TODO: add forget method, which can take event and predicate
   // and working like remove or exclude accordingly,
   // and make remove and exclude private
   public remove(...target: Array<T>) {
     this.memory = this.memory.filter(event => !target.includes(event))
   }

   public exclude(predicat: ExcludePredicate<T>) {
     const [searching, other] = splitArray(this.memory, predicat)
     this.memory = other

     return searching
   }

   public filter(predicat: (event: T) => boolean) {
     return this.memory.filter(predicat)
   }

   public findIndex(predicate: (value: T, index: number, obj: T[]) => boolean): number {
     return this.memory.findIndex(predicate)
   }

   public some(predicat: (value: T, index: number, array: T[]) => boolean): boolean {
     return this.memory.some(predicat)
   }

   public includes(value: T): boolean {
     return this.memory.includes(value)
   }

   /** Will replace existing event with new one, return true if old event was found and replaced */
   public replace(oldEvent: T, newEvent: T): boolean {
     const index = this.memory.indexOf(oldEvent)
     if (index === -1)
       return false

     this.memory[index] = newEvent
     return true
   }

   public get(index: number): T | undefined {
     return this.memory[index]
   }
}
