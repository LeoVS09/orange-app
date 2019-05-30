import {crudActions} from "@/store/CrudModule";
import {PartialProblem, Tag} from "@/models";
import {TagInput, TagsOrderBy} from "@/api/graphql/global-types";
import * as API from "@/api";
import * as fragmentsTypes from "@/api/graphql/fragments/types";
import {FullTag_problemsTags_nodes} from "@/api/graphql/fragments/types";
import * as actionTypes from "./actionTypes";
import {IActionContext} from "@/store/state";
import {ProblemsState} from "@/store/modules";
import * as mutations from "./mutationTypes";
import {STATUS_SCOPES} from "@/store/statusScopes";
import {responseToPartialProblem} from "@/store/modules/problems/actions/responseFormat";

export default {

   ...crudActions<Tag, TagsOrderBy>(
      STATUS_SCOPES.TAGS,
      () => ({
         id: '',
         name: '',
         createdAt: new Date(),
         updatedAt: new Date()
      }),
      {
         readList: variables => API.tags(variables),

         create: tag => API.createTag({input: {tag: tagToInput(tag)}}),

         read: async id => responseToTag(await API.tag({id})),

         update: tag => API.updateTag({
            input: {
               id: tag.id,
               patch: tagToInput(tag)
            }
         }),

         delete: id => API.deleteTag({input: {id}})
      }
   ),

   [actionTypes.TOGGLE_FILER_TAG]({commit}: IActionContext<ProblemsState>, tag: Tag) {
      commit(mutations.TOGGLE_FILER_TAG, tag)
   }
}

function responseToTag(result?: fragmentsTypes.FullTag | null): Tag | undefined | null {
   if (!result)
      return result

   const problems = result.problemsTags.nodes as Array<FullTag_problemsTags_nodes>

   return {
      ...result,

      problemsTags: problems.map(n => ({
         ...n,
         problem: responseToPartialProblem(n.problem) as PartialProblem
      }))
   }
}

function tagToInput(tag: Tag): TagInput {
   return {
      name: tag.name
   }
}
