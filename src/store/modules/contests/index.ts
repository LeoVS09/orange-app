import {crudActions, crudMutations, CrudState} from '@/store/CrudModule'
import {PartialContest, Country, UserType, PartialProblem, Team} from "@/models";
import {ContestInput, ContestsOrderBy, CountryInput} from "@/api/graphql/global-types";
import * as API from "@/api";
import * as fragmentsTypes from "@/api/graphql/fragments/types";
import {STATUS_SCOPES} from "@/store/statusScopes";
import {defaultPartialProfile} from "@/models/problems";
import {FullContest} from "@/models/contest";
import {responseToPartialUserProfile} from "@/store/modules/problems/utils";
import {PartialProfile} from "@/api/graphql/fragments/types";
import {responseToPartialProblem} from "@/store/modules/problems/actions/responseFormat";
import {PartialUserProfile} from "@/models/user";

export default {
   namespaced: true,
   state: new CrudState<PartialContest | FullContest>(),
   mutations: crudMutations<PartialContest | FullContest>(),
   actions: crudActions<PartialContest | FullContest, ContestsOrderBy>(
      STATUS_SCOPES.CONTESTS,
      (creatorId) => ({
         id: '',
         name: '',
         text: '',
         creatorId: creatorId as string,
         creator: {
            ...defaultPartialProfile(),
            id: creatorId as string,
            login: 'Author',
            type: UserType.TEACHER
         },
         teams: null,
         problems: null,
         profiles: null,

         startDate: null,
         endDate: null,
         startPublicationDate: null,
         endPublicationDate: null,

         createdAt: new Date(),
         updatedAt: new Date()
      }),
      {
         readList: async variables => {
            const response = await API.contests(variables)
            if (!response)
               return response

            return {
               ...response,
               nodes: response.nodes.map(n => responseToPartialContest(n) as PartialContest)
            }
         },

         create: async contest => responseToFullContest(await API.createContest({
            input: {
               contest: contestToInput(contest as FullContest)
            }
         })),

         read: async id => responseToFullContest(await API.contest({id})),

         update: async contest => responseToFullContest(await API.updateContest({
            input: {
               id: contest.id,
               patch: contestToInput(contest as FullContest)
            }
         })),

         delete: async id => responseToPartialContest(await API.deleteContest({input: {id}}))
      }
   )
}

function responseToPartialContest(result: fragmentsTypes.PartialContest | undefined | null): PartialContest | undefined | null {
   if (!result)
      return result

   return {
      ...result,
      creator: responseToPartialUserProfile(result.creator) as PartialUserProfile
   }
}

function responseToFullContest(result: fragmentsTypes.FullContest | undefined | null): FullContest | undefined | null {
   if (!result)
      return result

   return {
      ...result,
      creator: responseToPartialUserProfile(result.creator) as PartialUserProfile,
      problems: result.contestsProblems.nodes.map(n => responseToPartialProblem(n && n.problem) as PartialProblem),
      profiles: result.contestsProfiles.nodes.map(n => responseToPartialUserProfile(n && n.profile) as PartialUserProfile),
      teams: result.contestsTeams.nodes.map(n => responseToPartialTeam(n && n.team) as Team)
   }
}

function contestToInput(contest: FullContest): ContestInput {
   return {
      name: contest.name,
      text: contest.text,
      creatorId: contest.creatorId,
      startDate: contest.startDate,
      endDate: contest.endDate,
      startPublicationDate: contest.startPublicationDate,
      endPublicationDate: contest.endPublicationDate
   }
}


function responseToPartialTeam(result: fragmentsTypes.PartialTeam | undefined | null): Team | undefined | null {
   if (!result)
      return result

   return {
      ...result,
      profiles: [],
      count: result.teamsProfiles.totalCount || 0
   }
}
