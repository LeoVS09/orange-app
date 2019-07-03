import {University} from "@/models/university";
import Model from '@/lazyReactiveORM/Model'
import {ModelAttributeType} from "@/lazyReactiveORM/types";

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

export const CountryModel = new Model(
   'country',
   {
      cities: ModelAttributeType.OneToMany
})

export const CityModel = new Model(
   'city',
   {
      universities: ModelAttributeType.OneToMany
   }
)
