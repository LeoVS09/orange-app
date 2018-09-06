import {ResultRunProgram} from "../state/problem";

const orangeManagerServerUrl = "http://localhost:3010";
const credentials: RequestCredentials = 'same-origin';

enum URL {
  RUN_PROGRAM = '/run'
}

interface RunProgramRequestBody {
  problemId: string,
  code: string
}

export class API {
  static runProgram(problemId: string, code: string): Promise<ResultRunProgram> {
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
}
