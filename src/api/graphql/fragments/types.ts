export interface ResponseDataTest {
   id: string
   index: number
   input: string
   output: string
   isPublic: boolean
   createdAt: Date
   updatedAt: Date
}

export interface ResponseDataPartialProfile {
   id: string
   isTeacher: boolean
   firstName: string
   lastName: string
   user: {
      id: string
      name: string
   }
}

export interface ResponseDataTag {
   id: string
   name: string
}

export interface ResponseDataPartialProblem {
   id: string
   name: string
   createdAt: Date
   updatedAt: Date
   publicationDate: Date
   difficulty: number
   author: ResponseDataPartialProfile
   tester: ResponseDataPartialProfile
   problemsTags: {
      nodes: Array<{
         tag: ResponseDataTag
      }>
   }
}

export interface ResponseDataInputOutputType {
   id: string
   name: string
   code: string
}

export interface ResponseDataProblem extends ResponseDataPartialProblem {
   description: string
   inputDescription: string
   outputDescription: string
   note: string

   inputType: ResponseDataInputOutputType
   outputType: ResponseDataInputOutputType

   limitTime: number
   limitMemory: number

   tests: {
      nodes: Array<ResponseDataTest>
   }
}
