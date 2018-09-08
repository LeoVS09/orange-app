import {ResultRunProgram, Problem} from "../state/problem";
import {createProblem} from "../store/plugins/mock/generator";

const orangeManagerServerUrl = "http://localhost:3010";
const credentials: RequestCredentials = 'same-origin';

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
