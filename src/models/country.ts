import {University} from "@/models/university";

export interface Country {
   id: string
   name: string
   code: string
   cities?: Array<City>
   createdAt: Date
   updatedAt: Date
}

export interface City {
   id: string
   name: string
   createdAt: Date
   updatedAt: Date
   countryId: string
   universities?: Array<University>
}
