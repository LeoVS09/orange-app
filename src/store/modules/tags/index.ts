import TagsState from '@/store/modules/tags/state'
import {crudActions, crudMutations} from '@/store/CrudModule'
import {PartialProblem, Tag} from '@/models'
import {TagInput, TagsOrderBy} from '@/api/database/global-types'
import {STATUS_SCOPES} from '@/store/statusScopes'
import * as API from '@/api'
import * as fragmentsTypes from '@/api/database/fragments/types'
import {FullTag_problemsTags_nodes} from '@/api/database/fragments/types'
import {responseToPartialProblem} from '@/store/modules/problems/actions/responseFormat'


export default {
   namespaced: true,
   state: new TagsState(),
   mutations: crudMutations<Tag>(),
   actions: crudActions<Tag, TagsOrderBy>(
      STATUS_SCOPES.TAGS,
      () => ({
         id: '',
         name: '',
         createdAt: new Date(),
         updatedAt: new Date(),
      }),
      {
         readList: (variables) => API.tags(variables),

         create: (tag) => API.createTag({input: {tag: tagToInput(tag)}}),

         read: async (id) => responseToTag(await API.tag({id})),

         update: (tag) => API.updateTag({
            input: {
               id: tag.id,
               patch: tagToInput(tag),
            },
         }),

         delete: (id) => API.deleteTag({input: {id}}),
      },
   ),
}


function responseToTag(result?: fragmentsTypes.FullTag | null): Tag | undefined | null {
   if (!result) {
      return result
   }

   const problems = result.problemsTags.nodes as FullTag_problemsTags_nodes[]

   return {
      ...result,

      problemsTags: problems.map((n) => ({
         ...n,
         problem: responseToPartialProblem(n.problem) as PartialProblem,
      })),
   }
}

function tagToInput(tag: Tag): TagInput {
   return {
      name: tag.name,
   }
}
