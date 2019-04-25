import {Problem, Test, User, UserType} from "../state";
import {createProblem, createUser} from "../store/plugins/mock/generator";

export {
   login,
   currentUser,
   searchCountries,
   allCountries,
   allProblems,
   getProblem
} from './graphql'

export {
   runProgram
} from './judge'

const DEFAULT_MOCK_DURATION = 3

const randomString = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// TODO: all mocks must be in api
// const DEBUG = process.env.NODE_ENV !== 'production'
// const DEBUG = false
//
// export function getProblem(problemId: string): Promise<Problem> {
//    if (DEBUG)
//       return new Promise<Problem>((resolve => {
//          setTimeout(() => {
//             let problem = createProblem();
//             problem.id = problemId;
//             resolve(problem)
//          }, DEFAULT_MOCK_DURATION)
//       }))
//
//    return
// }

export function getAllTests(problemId: string): Promise<Array<Test>> {
   return new Promise<Array<Test>>((resolve, reject) => {
      resolve([])
   })
}

interface SyncTestResult {
   ok: boolean,
   id: string
}

export function syncTest(test: Test): Promise<SyncTestResult> {
   return new Promise<SyncTestResult>((resolve, reject) => {
      setTimeout(() => {
         let result: SyncTestResult = {ok: true, id: test.id};

         if (result.id.length === 0) {
            result.id = randomString();
         }

         resolve(result);
      }, DEFAULT_MOCK_DURATION)
   })
}

interface SyncProblemResult {
   ok: boolean,
   problem: Problem
}

export function syncProblem(problem: Problem): Promise<SyncProblemResult> {
   return new Promise<SyncProblemResult>((resolve, reject) => {
      let result: SyncProblemResult = {ok: true, problem};
      setTimeout(() => {
         resolve(result);
      }, DEFAULT_MOCK_DURATION);
   })
}

interface GetUserResult {
   user: User,
   ok: boolean
}

export function getUser(id: string): Promise<GetUserResult> {
   return new Promise<GetUserResult>((resolve, reject) => {
      let user = createUser("Some", "pass", id === UserType.TEACHER ? UserType.TEACHER : UserType.CONTESTANT);
      user.id = id;
      setTimeout(() => {
         resolve({user, ok: true});
      }, DEFAULT_MOCK_DURATION);
   })
}

interface CreateProblemResultOk {
   ok: false
}

interface CreateProblemResultFailed {
   ok: true,
   problem: Problem
}

export function putCreateProblem(problem: Problem): Promise<CreateProblemResultOk | CreateProblemResultFailed> {
   return new Promise<CreateProblemResultOk | CreateProblemResultFailed>((resolve, reject) => {
      if (!problem.tests) {
         reject("Not have tests");
         return;
      }
      let examples = [problem.tests[0]];
      if (problem.tests[1] && problem.tests[1].id.length) {
         examples.push(problem.tests[1]);
      }
      if (problem.tests[2] && problem.tests[1].id.length) {
         examples.push(problem.tests[2]);
      }
      setTimeout(() => {
         resolve({
            ok: true,
            problem: {
               ...problem,
               id: randomString(),
               examples
            }
         })
      }, DEFAULT_MOCK_DURATION)
   })
}
