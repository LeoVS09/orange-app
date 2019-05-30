import {Tag} from "@/models";
import {crudMutations} from "@/store/CrudModule";
import * as mutationTypes from './mutationTypes'
import TagsState from "@/store/modules/tags/state";

export default {
   ...crudMutations(),

   [mutationTypes.ADD_FILTER_TAG](state: TagsState, tag: Tag) {
      state.filterTags.push(tag)
   },

   [mutationTypes.REMOVE_FILTER_TAG](state: TagsState, index: number) {
      state.filterTags = [...state.filterTags.slice(0, index), ...state.filterTags.slice(index+1)]
   },

   [mutationTypes.TOGGLE_FILER_TAG](state: TagsState, tag: Tag) {
      const index = state.filterTags.findIndex(item => item.id === tag.id)
      if(index === -1) {
         state.filterTags.push(tag)
         return
      }

      state.filterTags = [...state.filterTags.slice(0, index), ...state.filterTags.slice(index+1)]
   }
}
