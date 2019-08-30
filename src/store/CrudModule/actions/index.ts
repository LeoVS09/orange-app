import { Identical} from '../types'
import * as mutations from '../mutationTypes'
import * as actionTypes from '../actionTypes'
import CrudState from '../state'
import { IActionContext} from '@/store/state'
import {
   generateStatusManipulation,
   setStatus,
} from '@/store/modules/statuses/utils'
import { STATUS_SCOPES} from '@/store/statusScopes'
import { readListAction} from '@/store/CrudModule/actions/readList'
import { readAction} from './read'
import { editAction} from './edit'
import { updateAction} from './update'
import { addModelForCreateAction, createAction} from './create'
import { deleteAction} from './delete'

export {
   readListAction,
   readAction,
   editAction,
   updateAction,
   addModelForCreateAction,
   deleteAction,
   createAction,
}

export interface ReadListVariables<T> {
   first?: number | null
   last?: number | null
   offset?: number | null
   before?: any | null
   after?: any | null
   orderBy?: Array<T> | null
}

export interface ReadListResponse<T> {
   totalCount: number | null
   nodes: Array<T | null>
}

export interface CrudActionApi<T extends Identical, OrderBy> {
   readList(variables: ReadListVariables<OrderBy>): Promise<ReadListResponse<T> | undefined | null>

   create(model: T): Promise<T | undefined | null>

   read(id: string): Promise<T | undefined | null>

   update(model: T): Promise<T | undefined | null>

   delete(id: string): Promise<T | undefined | null>
}


export default function crudMutations<T extends Identical, OrderBy>(
   scope: string,
   defaultModel: (parentId?: string) => T,
   api: CrudActionApi<T, OrderBy>,
) {
   return {
      [actionTypes.READ_LIST]({ commit, rootGetters, state}: IActionContext<CrudState<T>>): Promise<boolean> {
         return readListAction(
            state.data,
            (m) => commit(mutations.SET_OR_ADD, m),
            generateStatusManipulation(scope, commit, rootGetters),
            api.readList,
            (status) => setStatus(STATUS_SCOPES.GLOBAL, commit, scope, status),
         )
      },


      [actionTypes.READ]({ commit, rootGetters, state}: IActionContext<CrudState<T>>, id: string): Promise<T | undefined> {
         return readAction(
            state.data,
            id,
            (m) => commit(mutations.SET_OR_ADD, m),
            generateStatusManipulation(scope, commit, rootGetters),
            api.read,
         )
      },

      // ModelObserver in edit action can be partial
      [actionTypes.EDIT]({ commit, state, rootGetters}: IActionContext<CrudState<T>>, model: T): boolean {
         return editAction(
            state.data,
            model,
            (m) => commit(mutations.SET_OR_ADD, m),
            generateStatusManipulation(scope, commit, rootGetters),
         )
      },


      [actionTypes.UPDATE]({ commit, state, rootGetters}: IActionContext<CrudState<T>>, id: string): Promise<T | undefined> {
         return updateAction(
            state.data,
            id,
            (m) => commit(mutations.SET_OR_ADD, m),
            generateStatusManipulation(scope, commit, rootGetters),
            api.update,
         )
      },


      [actionTypes.ADD_MODEL_FOR_CREATE]({ commit, state, rootGetters}: IActionContext<CrudState<T>>, parentId?: string): T {
         return addModelForCreateAction(
            state.data,
            () => defaultModel(parentId),
            (m) => commit(mutations.SET_OR_ADD, m),
            generateStatusManipulation(scope, commit, rootGetters),
         )
      },


      [actionTypes.CREATE]({ commit, state, rootGetters}: IActionContext<CrudState<T>>, model: T): Promise<T | undefined> {
         return createAction(
            state.data,
            model,
            (payload) => commit(mutations.SET_BY_ID, payload),
            generateStatusManipulation(scope, commit, rootGetters),
            api.create,
         )
      },


      [actionTypes.DELETE]({ commit, state, rootGetters}: IActionContext<CrudState<T>>, id: string): Promise<T | undefined> {
         return deleteAction(
            state.data,
            id,
            (id) => commit(mutations.DELETE, id),
            generateStatusManipulation(scope, commit, rootGetters),
            api.delete,
         )
      },
   }
}













