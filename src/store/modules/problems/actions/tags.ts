import * as actionTypes from "../actionTypes";
import {IActionContext} from "@/store/state";
import {ProblemFilter, ProblemsState} from "../state";
import * as API from "@/api";
import * as mutations from "../mutationTypes";
import {Tag} from "@/models/problems";

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export default {

   async [actionTypes.READ_TAGS]({commit}: IActionContext<ProblemsState>) {
      const tags = await API.tags()
      if(!tags)
         return console.error('Cannot load tags')

      commit(mutations.SET_TAGS, tags)
   },

   [actionTypes.TOGGLE_FILER_TAG]({commit}: IActionContext<ProblemsState>, tag: Tag) {
      commit(mutations.TOGGLE_FILER_TAG, tag)
   }
}
