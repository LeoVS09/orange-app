
export interface Problem {
  id: string,
  name: string,
  text: string,
  input: string,
  output: string,
  note?: string,
  examples: Array<Example>,
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
  }
}

export enum IO {
  STANDARD,
  FILE
}

export interface Example {
  input: string,
  output: string
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
