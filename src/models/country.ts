import {University} from '@/models/university'
import {Repository} from '@/lazyDB'
import {ModelAttributeType} from '@/lazyDB/core/types'

export interface Country {
   id: string
   name: string
   code: string
   cities?: City[]
   createdAt: Date
   updatedAt: Date
}

export interface City {
   id: string
   name: string
   createdAt: Date
   updatedAt: Date
   countryId: string
   universities?: University[]
}

export const CountryRepository = new Repository(
   'country',
   {
      cities: ModelAttributeType.OneToMany,
})

export const CityRepository = new Repository(
   'city',
   {
      country: ModelAttributeType.OneToOne,
      universities: ModelAttributeType.OneToMany,
   },
)
