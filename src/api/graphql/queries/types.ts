import {
   ResponseDataPartialProblem,
   ResponseDataProblem,
   ResponseDataTag,
   ResponseDataInputOutputType,
   ResponseDataPartialCountry,
   ResponseDataPartialCity,
   ResponseDataFullCountry,
   ResponseDataFullCity,
   ResponseDataUser
} from "../fragments/types";

export interface ResponseCurrentUser {
   currentUser: ResponseDataUser
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
      nodes: Array<ResponseDataPartialCountry>
   }
}

export interface ResponseCountry {
   country: ResponseDataFullCountry
}

export interface ResponseCities {
   cities: {
      nodes: Array<ResponseDataPartialCity>
   }
}

export interface ResponseCity {
   city: ResponseDataFullCity
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
