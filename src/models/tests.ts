export interface Test {
   id: string
   index: number
   input: string
   output: string
   problemId: string
   isPublic: boolean
   createdAt: Date
   updatedAt: Date
}

export interface ResultOfTest {
   id: string
   test: string
   solved: boolean
   time: number
}

export interface ResultOfProblem {
   id: string
   member: string
   testsResults: Array<ResultOfTest>
}

export function defaultTest(): Test {
  return {
    id: '',
    index: 0,
    input: '',
    output: '',
    problemId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false
  }
}
