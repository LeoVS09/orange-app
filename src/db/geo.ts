import { Repository } from '@/lazyDB'
import { Country, City, University } from '@/models'
import { AosFieldType } from '@/abstractObjectSchema'

export const CountryRepository = new Repository<Country>(
  'country',
  {
    fields: {
      cities: AosFieldType.OneToMany
    }
  }
)

export const CityRepository = new Repository<City>(
  'city',
  {
    fields: {
      country: AosFieldType.OneToOne,
      universities: AosFieldType.OneToMany
    }
  }
)

export const UniversityRepository = new Repository<University>(
  'university',
  {
    fields: {
      city: AosFieldType.OneToOne
    }
  }
)

