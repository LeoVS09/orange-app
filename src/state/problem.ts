
export interface Problem {
  id: string,
  name: string,
  text: string,
  examples: Array<string>,
  isOpen: boolean,
  uploadDate: number,
  publicationDate: number,
  author: string,
  tester: string,
  tags: Array<string>
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
