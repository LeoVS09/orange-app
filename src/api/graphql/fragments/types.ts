
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

export interface ResponseDataPartialUniversity {
   id: string
   shortName: string
   longName: string
   createdAt: Date
   updatedAt: Date
   cityId: string
}

export interface ResponseDataPartialCity {
   id: string
   name: string
   countryId: string
   createdAt: Date
   updatedAt: Date
}

export interface ResponseDataPartialCountry {
   id: string
   name: string
   createdAt: Date
   updatedAt: Date
}

export interface ResponseDataFullCity extends ResponseDataPartialCity{
   universities: {
      nodes: Array<ResponseDataPartialUniversity>
   }
}

export interface ResponseDataFullCountry extends ResponseDataPartialCountry {
   cities: {
      nodes: Array<ResponseDataPartialCity>
   }
}

export interface ResponseDataFullProfile {
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

   city: ResponseDataPartialCity

   university: ResponseDataPartialUniversity
}

export interface ResponseDataEmail {
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
   createdAt: Date
   updatedAt: Date

   userEmails: {
      nodes: Array<ResponseDataEmail>
   },

   profiles: {
      nodes: Array<ResponseDataFullProfile>
   }
}
