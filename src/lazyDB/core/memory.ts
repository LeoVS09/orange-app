import {splitArray} from './utils'

export class StateMemory<T> {

   public memory: T[] = []

   public push(event: T) {
      this.memory.push(event)
   }

   public remove(target: T) {
      this.memory = this.memory.filter((event) => event !== target)
   }

   public exclude(predicat: (event: T) => boolean) {
      const [searching, other] = splitArray(this.memory, predicat)
      this.memory = other

      return searching
   }

   public filter(predicat: (event: T) => boolean) {
      return this.memory.filter(predicat)
   }
}
