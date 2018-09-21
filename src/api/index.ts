import {ResultRunProgram, Problem, Test} from "../state/problem";
import {createProblem} from "../store/plugins/mock/generator";

const orangeManagerServerUrl = "http://localhost:3010";
const credentials: RequestCredentials = 'same-origin';

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
    }, 10)
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
