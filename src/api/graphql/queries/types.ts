import {
   ResponseDataPartialProblem,
   ResponseDataProblem,
   ResponseDataTag,
   ResponseDataInputOutputType
} from "../fragments/types";

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


export interface ResponseProblemsList {
   problems: {
      totalCount: number
      nodes: Array<ResponseDataProblem>
   }
}

export interface ResponsePartialProblemsList {
   problems: {
      totalCount: number
      nodes: Array<ResponseDataPartialProblem>
   }
}

export interface ResponseProblem {
   problem: ResponseDataProblem
}

export interface ResponseInputOutputTypes {
   programInputTypes: {
      nodes: Array<ResponseDataInputOutputType>
   }
   programOutputTypes: {
      nodes: Array<ResponseDataInputOutputType>
   }
}

export interface ResponseTags {
   tags: {
      nodes: Array<ResponseDataTag>
   }
}
