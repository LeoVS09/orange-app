import {ResponseDataProblem, ResponseDataTag, ResponseDataTest, ResponseDataInputOutputType} from "../fragments/types";

export interface ResponseDataProfile {
   id: string
   firstName: string
   lastName: string
   familyName: string
   phone: string
   groupNumber: string
   course: number
   isTeacher: boolean
   createdAt: Date
   updatedAt: Date
   city: {
      id: string
      name: string
   }
   university: {
      id: string
      shortName: string
      longName: string
   }
}

export interface ResponseDataUserEmail {
   email: string
   isVerified: boolean
   createdAt: Date
   updatedAt: Date
}

export interface ResponseDataUser {
   id: string
   name: string
   isAdmin: boolean
   avatarUrl: string
   userEmails: {
      nodes: Array<ResponseDataUserEmail>
   },

   profiles: {
      nodes: Array<ResponseDataProfile>
   }
}

export interface ResponseLogin {
   login: {
      user: ResponseDataUser
   }
}

export interface ResponseRegister {
   register: {
      user: ResponseDataUser
   }
}

export interface RequestRegisterInput {
   username: string,
   email: string,
   password: string,
   name: string,
   avatarUrl?: string,
   firstName: string,
   middleName?: string
   lastName?: string
}

export interface RequestLoginInput {
   username: string,
   password: string
}

export interface RequestUpdateProblemInput {
   input: {
      id: string
      patch: {
         name?: string
         description?: string
         note?: string
         inputTypeId?: string
         outputTypeId?: string
         limitTime?: number
         limitMemory?: number
         publicationDate?: Date
         authorId?: string
         testerId?: string
      }
   }
}

export interface ResponseUpdateProblem {
   updateProblem: {
      problem: ResponseDataProblem
   }
}

export interface RequestCreateProblemInput {
   input: {
      problem: {
         name: string
         description: string
         note?: string
         inputTypeId: string
         outputTypeId: string
         limitTime: number
         limitMemory: number
         publicationDate?: Date
         authorId: string
         testerId?: string
      }
   }
}

export interface ResponseCreateProblem {
   createProblem: {
      problem: ResponseDataProblem
   }
}

export interface RequestDeleteProblemInput {
   input: {
      id: string
   }
}

export interface ResponseDeleteProblem {
   deleteProblem: {
      problem: ResponseDataProblem
   }
}

export interface RequestCreateTestInput {
   input: {
      test: {
         index: number
         input: string
         output: string
         isPublic: boolean
      }
   }
}

export interface ResponseCreateTest {
   createTest: {
      test: ResponseDataTest
   }
}

export interface RequestUpdateTestInput {
   input: {
      id: string
      patch: {
         index?: number
         input?: string
         output?: string
         isPublic?: boolean
      }
   }
}

export interface ResponseUpdateTest {
   updateTest: {
      test: ResponseDataTest
   }
}

export interface RequestDeleteTestInput {
   input: {
      id: string
   }
}

export interface ResponseDeleteTest {
   deleteTest: {
      test: ResponseDataTest
   }
}

export interface RequestUpdateTagInput {
   input: {
      id: string
      patch: {
         name: string
      }
   }
}

export interface ResponseUpdateTag {
   updateTag: {
      tag: ResponseDataTag
   }
}

export interface RequestCreateTagInput {
   input: {
      tag: {
         name: string
      }
   }
}

export interface ResponseCreateTag {
   createTag: {
      tag: ResponseDataTag
   }
}

export interface RequestDeleteTagInput {
   input: {
      id: string
   }
}

export interface ResponseDeleteTag {
   deleteTag: {
      tag: ResponseDataTag
   }
}

export interface RequestCreateInputTypeInput {
   input: {
      programInputType: {
         name: string
         code: string
      }
   }
}

export interface ResponseCreateInputType {
   createProgramInputType: {
      programInputType: ResponseDataInputOutputType
   }
}

export interface RequestUpdateInputTypeInput {
   input: {
      id: string
      patch: {
         name?: string
         code?: string
      }
   }
}

export interface ResponseUpdateInputType {
   updateProgramInputType: {
      programInputType: ResponseDataInputOutputType
   }
}

export interface RequestDeleteInputTypeInput {
   input: {
      id: string
   }
}

export interface ResponseDeleteInputType {
   deleteProgramInputType: {
      programInputType: ResponseDataInputOutputType
   }
}

export interface RequestCreateOutputTypeInput {
   input: {
      programOutputType: {
         name: string
         code: string
      }
   }
}

export interface ResponseCreateOutputType {
   createProgramOutputType: {
      programOutputType: ResponseDataInputOutputType
   }
}

export interface RequestUpdateOutputTypeInput {
   input: {
      id: string
      patch: {
         name?: string
         code?: string
      }
   }
}

export interface ResponseUpdateOutputType {
   updateProgramOutputType: {
      programOutputType: ResponseDataInputOutputType
   }
}

export interface RequestDeleteOutputTypeInput {
   input: {
      id: string
   }
}

export interface ResponseDeleteOutputType {
   deleteProgramOutputType: {
      programOutputType: ResponseDataInputOutputType
   }
}
