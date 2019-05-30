import Vue from "vue";
import {Identical} from "@/store/CrudModule/types";

export const randomNumber = () => Math.floor(Math.random() * 1000000)

export function randomItem<T>(array: Array<T>): T {
   return array[Math.floor(Math.random() * array.length)]
}

export function shuffleProblem<T>(array: Array<T>): Array<T> {
   return array.sort(() => Math.random() - 0.5)
}

export function setByIdOrPush<T extends Identical>(items: Array<T>, newItem: T) {
   const index = items.findIndex(item => item.id === newItem.id)
   if (index === -1)
      items.push(newItem)

   Vue.set(items, index, newItem)
}

export function setById<T extends Identical>(items: Array<T>, id: string, newItem: T): T | undefined {
   const index = items.findIndex(item => item.id === id)
   if (index === -1) {
      console.error('Cannot find model to set by id:', id, 'new data:', newItem)
      return
   }

   Vue.set(items, index, newItem)
   return items[index]
}

export function updateById<T extends Identical>(items: Array<T>, id: string, handler: (model: T) => void) {
   const item = items.find(item => item.id === id)
   if (!item) {
      console.error('Cannot find model to set by id:', id)
      return
   }

   handler(item)
}

export function removeById<T extends Identical>(items: Array<T>, id: string): Array<T> {
   const index = items.findIndex(item => item.id === id)
   if(index){
      console.error('Not find item', id)
      return items
   }

   return [...items.slice(0, index), ...items.slice(index + 1)]
}
