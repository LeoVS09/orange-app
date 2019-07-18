import {Identical} from '@/store/CrudModule'

export function findById<T extends Identical>(items: T[], id: string) {
   return items.find((d) => d.id === id)
}
