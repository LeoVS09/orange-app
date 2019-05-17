import {FullProblem, Test} from "@/models";
import {IActionContext, RootGetters} from "@/store/state";
import {ProblemsState} from "../state";
import * as mutations from "../mutationTypes";
import * as mock from "@/store/plugins/mock/generator";
import {ProblemReadState} from "@/models/problem";

export function mockProblems({commit}: IActionContext<ProblemsState>) {
   let count = 10;
   let add = () => {
      setTimeout(() => {
         commit(mutations.ADD_FULL_READ_PROBLEM, {...mock.createProblem(), isOpen: true});
         if (count-- > 0) {
            add();
         }
      }, 100)
   };
   add();
}

export function toUpdateProblem(problem: FullProblem) {
   return {
      id: problem.id,
      patch: {
         name: problem.name,
         description: problem.description,
         note: problem.note,
         inputTypeId: problem.io.input.id,
         outputTypeId: problem.io.output.id,
         limitTime: problem.limits.time,
         limitMemory: problem.limits.memory,
         publicationDate: problem.publicationDate,
         testerId: problem.tester.id
      }
   }
}

export function toUpdateTestPatch(test: Test) {
   return {
      id: test.id,
      patch: {
         index: test.index,
         input: test.input,
         output: test.output,
         isPublic: test.isPublic
      }
   }
}

export function findTest(rootGetters: RootGetters, problemId: string, testId: string): Test | undefined {
   const problem = rootGetters.problemById(problemId)
   if(!problem){
      console.error('Cannot find problem:', problemId)
      return
   }

   if(problem.readState === ProblemReadState.Partial){
      console.error('Problem not have tests', problem)
      return
   }

   return problem.tests.find(t => t.id === testId)
}
