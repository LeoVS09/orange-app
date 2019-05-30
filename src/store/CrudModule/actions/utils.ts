import {Identical} from "@/store/CrudModule";

export function getById<T extends Identical>(items: Array<T>, id: string) {
   return items.find(d => d.id === id)
}
