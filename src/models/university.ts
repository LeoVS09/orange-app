import { Repository } from '@/lazyDB'
import { AosFieldType } from '@/abstractObjectScheme'

export interface University {
   id: string
   shortName: string
   longName: string | null
   createdAt: Date
   updatedAt: Date
   cityId: string
}

export const UniversityRepository = new Repository(
  'university',
  {
    fields: {
      city: AosFieldType.OneToOne,
    }
  },
)
