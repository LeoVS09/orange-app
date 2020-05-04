import { splitArray } from './utils'

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

   // TODO: add forget method, which can take event and predicate
   // and working like remove or exclude accordingly,
   // and make remove and exclude private
   public remove(...target: Array<T>) {
     this.memory = this.memory.filter(event => !target.includes(event))
   }

   public exclude(predicat: (event: T) => boolean) {
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
