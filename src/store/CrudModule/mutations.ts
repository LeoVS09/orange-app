import * as mutationTypes from './mutationTypes'
import CrudState from './state'
import {removeById, setById, setByIdOrPush} from '@/store/utils'
import {Identical} from './types'

export interface ISetByIdPayload<T> {
   id: string
   model: T
}

export default function crudMutations<T extends Identical>() {
   return {
      [mutationTypes.SET_ALL](state: CrudState<T>, models: T[]) {
         state.data = models
      },

      [mutationTypes.SET_OR_ADD](state: CrudState<T>, model: T) {
         setByIdOrPush(state.data, model)
      },

      [mutationTypes.DELETE](state: CrudState<T>, id: string) {
         state.data = removeById(state.data, id)
      },

      [mutationTypes.SET_BY_ID](state: CrudState<T>, {id, model}: ISetByIdPayload<T>) {
         setById(state.data, id, model)
      },
   }
}
