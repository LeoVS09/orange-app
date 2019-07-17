import {ResultRunProgram} from '../../models';
import urls from '../urls.json';

const credentials: RequestCredentials = 'same-origin';

interface RunProgramRequestBody {
  problemId: string;
  code: string;
}


export function runProgram(problemId: string, code: string): Promise<ResultRunProgram> {
  const body: RunProgramRequestBody = {
    problemId,
    code,
  };
  return fetch(urls.ORANGE_MANAGER_SERVER + urls.RUN_PROGRAM, {
    method: 'POST',
    credentials,
    body: JSON.stringify(body),
  }).then((response) => response.json());
}
