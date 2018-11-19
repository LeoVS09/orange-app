import {Problem, ResultRunProgram, Test, User, UserType} from "../state";
import {createProblem, createUser} from "../store/plugins/mock/generator";
import {makeClient, APIClient} from "./apollo";
import {queries, mutations} from './graphql'

const orangeManagerServerUrl = "http://localhost:3010";
const credentials: RequestCredentials = 'same-origin';
const databaseServerUri = "http://localhost:8349/graphql";

export function makeApiClient (): APIClient {
  return makeClient(databaseServerUri);
}

export {
  queries,
  mutations
}

const randomString = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

enum URL {
  RUN_PROGRAM = '/run'
}

interface RunProgramRequestBody {
  problemId: string,
  code: string
}

export function runProgram(problemId: string, code: string): Promise<ResultRunProgram> {
  let body: RunProgramRequestBody = {
    problemId,
    code
  };
  return fetch(orangeManagerServerUrl + URL.RUN_PROGRAM, {
    method: "POST",
    credentials,
    body: JSON.stringify(body)
  }).then(response => response.json())
}

export function getProblem(problemId: string): Promise<Problem> {
  return new Promise<Problem>((resolve => {
    setTimeout(() => {
      let problem = createProblem();
      problem.id = problemId;
      resolve(problem)
    }, 3000)
  }))
}

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
  return new Promise<SyncTestResult>( (resolve, reject) => {
    setTimeout(() => {
      let result: SyncTestResult = {ok: true, id: test.id};

      if(result.id.length === 0) {
        result.id = randomString();
      }

      resolve(result);
    }, 1000)
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
    }, 2000);
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
      resolve({ user, ok: true });
    }, 2000);
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
  return new Promise<CreateProblemResultOk|CreateProblemResultFailed>((resolve, reject) => {
    if(!problem.tests){
      reject("Not have tests");
      return;
    }
    let examples = [problem.tests[0]];
    if(problem.tests[1] && problem.tests[1].id.length){
      examples.push(problem.tests[1]);
    }
    if(problem.tests[2] && problem.tests[1].id.length){
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
    }, 3000)
  })
}
