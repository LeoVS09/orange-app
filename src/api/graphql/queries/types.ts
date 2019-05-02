export interface ResponseCurrentUser {
   currentUser: {
      id: string
      nodeId: string
      name: string
      isAdmin: boolean
      avatarUrl: string
      userEmails: {
         nodes: Array<{
            email: string
            isVerified: boolean
            createdAt: Date
            updatedAt: Date
         }>
      },

      profiles: {
         nodes: Array<{
            id: string,
            firstName: string,
            lastName: string,
            familyName: string,
            phone: string,
            groupNumber: string,
            course: number,
            isTeacher: boolean,
            createdAt: Date,
            updatedAt: Date,
            city: {
               id: string,
               name: string
            },
            university: {
               id: string,
               shortName: string,
               longName: string
            }
         }>
      }
   }
}

export interface ResponseSearchCountries {
   searchCountries: {
      nodes: Array<{
         id: string
         nodeId: string
         name: string
      }>
   }
}

export interface ResponseCountries {
   countries: {
      nodes: Array<{
         id: string
         name: string
         createdAt: Date
         updatedAt: Date
      }>
   }
}

export interface ResponseDataTest {
   id: string
   index: number
   input: string
   output: string
   public: boolean
   createdAt: Date
   updatedAt: Date
}

export interface ResponseDataProblem {
   id: string
   name: string
   description: string
   inputDescription: string
   outputDescription: string
   note: string
   inputType: {
      id: string
      name: string
   }
   outputType: {
      id: string
      name: string
   }
   limitTime: number
   limitMemory: number
   isOpen: boolean
   createdAt: Date
   updatedAt: Date
   publishedAt: Date
   author: {
      id: string
      user: {
         name: string
      }
   }
   tester: {
      id: string
      user: {
         name: string
      }
   }
   problemsTags: {
      nodes: Array<{
         tag: {
            id: string
            name: string
         }
      }>
   }

   tests: {
      nodes: Array<ResponseDataTest>
   }
}

export interface ResponseProblemsList {
   problems: {
      totalCount: number
      nodes: Array<ResponseDataProblem>
   }
}

export interface ResponseProblem {
   problem: ResponseDataProblem
}
