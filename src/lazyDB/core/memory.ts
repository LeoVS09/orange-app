import { splitArray } from './utils'

export interface ExcludePredicate<T> {
  (event: T): boolean
}
export interface ForgetMethod<T> {
  (...targets: Array<T>): void
  (predicate: ExcludePredicate<T>): Array<T>
}
export class StateMemory<T> {
   // TODO: make field private
   public memory: Array<T> = []

   public push(event: T) {
     this.memory.push(event)
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
}
