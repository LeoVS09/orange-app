import { University } from '@/models/university'
import { Repository } from '@/lazyDB'
import { AosFieldType } from '@/abstractObjectScheme'

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

export const CountryRepository = new Repository<Country>(
  'country',
  {
    fields: {
      cities: AosFieldType.OneToMany,
    },
  },
)

export const CityRepository = new Repository(
  'city',
  {
    fields: {
      country: AosFieldType.OneToOne,
      universities: AosFieldType.OneToMany,
    },
  },
)
