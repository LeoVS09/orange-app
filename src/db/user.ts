import { AosFieldType } from '@/abstractObjectScheme/types'
import { Repository } from '@/lazyDB'

export const ProfileRepository = new Repository(
  'profile',
  {
    fields: {
      user: AosFieldType.OneToOne,
      city: AosFieldType.OneToOne,
      university: AosFieldType.OneToOne
    }
  }
)

export const UserRepository = new Repository(
  'user',
  {
    fields: {
      userEmails: AosFieldType.OneToMany
    }
  }
)

export const UserEmail = new Repository(
  'userEmail',
  {
    fields: {
      user: AosFieldType.OneToOne
    }
  }
)
