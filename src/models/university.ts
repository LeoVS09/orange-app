import { Repository } from '@/lazyDB'
import { AosFieldType } from '@/abstractObjectScheme'
import { City } from '@/models/country'

export interface University {
  id: string
  shortName: string
  longName: string | null
  createdAt: Date
  updatedAt: Date
  cityId: string
  city?: City
}

export const UniversityRepository = new Repository<University>(
  'university',
  {
    fields: {
      city: AosFieldType.OneToOne,
    },
  },
)
