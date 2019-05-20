import * as actionTypes from "../actionTypes";
import {IActionContext} from "@/store/state";
import {ProblemFilter, ProblemsState} from "../state";
import * as API from "@/api";
import * as mutations from "../mutationTypes";
import {responseToFullProblem, responseToPartialProblem} from "../utils";
import {defaultProblem, FullProblem, ProblemStatus} from "@/models";
import {ICreateProblemPayload, ISetProblemStatusPayload} from "../mutations";
import {mockProblems, toUpdateProblem} from "./utils";
import {randomId} from "@/components/utils";
import {Commit} from "vuex";
import {ProblemError, ProblemReadState, Tag} from "@/models/problem";

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export default {

   [actionTypes.ADD_FOR_CREATE_PROBLEM]({commit, dispatch}: IActionContext<ProblemsState>): FullProblem {
      const problem: FullProblem = {
         ...defaultProblem(),
         id: randomId()
      }
      commit(mutations.ADD_PROBLEM_FOR_CREATE, problem);

      dispatch(actionTypes.ADD_FOR_CREATE_TEST, problem.id);

      return problem
   },

   async [actionTypes.CREATE_PROBLEM]({commit, state, rootState}: IActionContext<ProblemsState>, problem: FullProblem): Promise<FullProblem | undefined> {

      if (!rootState.profile.data) {
         console.error("Cannot create problem when not sign in")
         return
      }

      const startPayload: ISetProblemStatusPayload = {
         problemId: problem.id,
         status: ProblemStatus.Creating
      }
      commit(mutations.SET_PROBLEM_STATUS, startPayload)

      const result = await API.createProblem({
         input: {
            problem: {
               name: problem.name,
               description: problem.description,
               note: problem.note,
               inputTypeId: problem.io.input.id,
               outputTypeId: problem.io.output.id,
               limitTime: problem.limits.time,
               limitMemory: problem.limits.memory,
               publicationDate: problem.publicationDate,
               authorId: rootState.profile.data.id
            }
         }
      })

      if (!result) {
         console.error('Cannot create problem', problem)
         const errorPayload: ISetProblemStatusPayload = {
            problemId: problem.id,
            status: ProblemStatus.ErrorCreating
         }
         commit(mutations.SET_PROBLEM_STATUS, errorPayload)
         return
      }

      const endPayload: ICreateProblemPayload = {
         oldProblemId: problem.id,
         problem: responseToFullProblem(result)
      }
      commit(mutations.CREATE_PROBLEM, endPayload)

      return endPayload.problem
   },

   async [actionTypes.READ_PROBLEMS_LIST](context: IActionContext<ProblemsState>) {
      const {state, commit} = context

      if (DEBUG) {
         mockProblems(context);
         return
      }

      const problems = await API.partialProblems()
      if (!problems)
         return console.error('Not found problems')

      problems.forEach(p => {
         const wasHave = state.data.find(inState => inState.id === p.id)

         if (!wasHave)
            return commit(mutations.ADD_PARTIAL_READ_PROBLEM, responseToPartialProblem(p))

         if (p.updatedAt <= wasHave.updatedAt)
            return

         commit(mutations.UPDATE_PROBLEM, responseToPartialProblem(p))
      })

   },

   [actionTypes.EDIT_PROBLEM]({commit}: IActionContext<ProblemsState>, problem: FullProblem) {
      commit(mutations.EDIT_PROBLEM, problem);
   },

   async [actionTypes.UPDATE_PROBLEM]({commit, rootGetters}: IActionContext<ProblemsState>, id: string): Promise<boolean> {
      let problem = rootGetters.problemById(id)
      if (!problem) {
         console.error('Not have problem for update:', id)
         return false
      }
      if (problem.readState === ProblemReadState.Partial) {
         console.error('Problem not full loaded', problem)
         return false
      }

      setProblemStatus(commit, id, ProblemStatus.Updating)

      const result = await API.updateProblem({input: toUpdateProblem(problem)})
      if (!result) {
         console.error('Error when update problem', problem)
         setProblemStatus(commit, id, ProblemStatus.ErrorUpdating)
         return false
      }

      // check if problem was changed when updating
      problem = rootGetters.problemById(id)
      if (!problem) {
         console.error('Unexpected error, problem was removed when updating')
         return false
      }

      if (problem.status === ProblemStatus.Changed) {
         console.error('Problem was changed when updating')
         return false
      }

      commit(mutations.UPDATE_PROBLEM, responseToFullProblem(result));
      return true
   },

   async [actionTypes.READ_TAGS]({commit}: IActionContext<ProblemsState>) {
      const tags = await API.tags()
      if(!tags)
         return console.error('Cannot load tags')

      commit(mutations.SET_TAGS, tags)
   },

   async [actionTypes.READ_PROBLEM]({commit, rootGetters}: IActionContext<ProblemsState>, problemId: string): Promise<FullProblem | undefined> {
      setProblemStatus(commit, problemId, ProblemStatus.Reading)

      const result = await API.problem(problemId)

      if (!result) {
         console.error('Cannot load problem', problemId)
         setProblemStatus(commit, problemId, ProblemStatus.ErrorReading)
         return
      }

      const problem = responseToFullProblem(result)

      if (rootGetters.problemById(problemId))
         commit(mutations.UPDATE_PROBLEM, problem)
      else
         commit(mutations.ADD_FULL_READ_PROBLEM, problem)

      return problem
   },

   [actionTypes.SETUP_PROBLEMS]({commit}: IActionContext<ProblemsState>, problems: Array<FullProblem>) {
      commit(mutations.SET_PROBLEMS, problems);
   },

   [actionTypes.ADD_FULL_READ_PROBLEM]({commit}: IActionContext<ProblemsState>, problem: FullProblem) {
      commit(mutations.ADD_FULL_READ_PROBLEM, problem);
   },

   [actionTypes.SET_PROBLEMS_FILTER]({commit}: IActionContext<ProblemsState>, filter: ProblemFilter) {
      commit(mutations.SET_PROBLEMS_FILTER, filter)
   },

   [actionTypes.TOGGLE_FILER_TAG]({commit}: IActionContext<ProblemsState>, tag: Tag) {
      commit(mutations.TOGGLE_FILER_TAG, tag)
   }
}

function setProblemStatus(commit: Commit, problemId: string, status: ProblemStatus) {
   const payload: ISetProblemStatusPayload = {
      problemId,
      status
   }
   commit(mutations.SET_PROBLEM_STATUS, payload)

   if (
      status === ProblemStatus.ErrorReading ||
      status === ProblemStatus.ErrorUpdating ||
      status === ProblemStatus.ErrorCreating ||
      status === ProblemStatus.ErrorDeleting
   )
      addProblemError(commit, {problemId, status})
}

function addProblemError(commit: Commit, error: ProblemError) {
   commit(mutations.ADD_PROBLEM_ERROR, error)
}
