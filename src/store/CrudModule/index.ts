import CrudState from './state'
import crudActions, {
   ReadListVariables,
   ReadListResponse,
   CrudActionApi,
   deleteAction,
   addModelForCreateAction,
   updateAction,
   editAction,
   readAction,
   readListAction,
   createAction,
} from './actions'
import crudMutations, {ISetByIdPayload} from './mutations'
import {Identical} from './types'
import * as action from './actionTypes'
import * as mutation from './mutationTypes'

export {
   CrudState,
   crudActions,
   CrudActionApi,
   ReadListResponse,
   ReadListVariables,
   crudMutations,
   ISetByIdPayload,
   Identical,
   action,
   mutation,
   deleteAction,
   addModelForCreateAction,
   updateAction,
   editAction,
   readListAction,
   readAction,
   createAction,
}
