
export interface Problem {
  id: string,
  name: string,
  text: string,
  input: string,
  output: string,
  note?: string,
  examples: Array<Test>,
  isOpen: boolean,
  uploadDate: number,
  publicationDate: number,
  author: string,
  tester: string,
  tags: Array<string>,
  limits: {
    time: number, // ms
    memory: number // byte
  }
  io: {
    input: IO,
    output: IO
  },
  resultRun?: ResultRunProgram,
  tests?: Array<Test>,
  synced: boolean
}

export function defaultProblem() : Problem {
  return {
    id: '',
    name: '',
    text: '',
    input: '',
    output: '',
    examples: [],
    isOpen: true,
    uploadDate: Date.now(),
    publicationDate: Date.now(),
    author: "Author",
    tester: "Tester",
    tags: ['some', 'tags'],
    limits: {
      time: 30000,
      memory: 2048
    },
    io: {
      input: IO.STANDARD,
      output: IO.STANDARD,
    },
    synced: false
  }
}

export interface ResultRunProgram {
  problemId: string,
  isAllTestsSuccessful: boolean,
  failedTest: number
}

export enum IO {
  STANDARD,
  FILE
}

export interface Test {
  id: string,
  input: string,
  output: string,
  synced: boolean
}

export interface ResultOfTest {
  id: string,
  test: string,
  solved: boolean,
  time: number
}
export interface ResultOfProblem {
  id: string,
  member: string,
  testsResults: Array<ResultOfTest>
}
