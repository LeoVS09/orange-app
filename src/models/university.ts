import Repository from '@/lazyReactiveORM/Repository'
import {ModelAttributeType} from '@/lazyReactiveORM/types'

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
      city: ModelAttributeType.OneToOne,
   },
)
