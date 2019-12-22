import { City, Country } from './country'
import { University } from './university'
import { Language } from './language'
import { CodeEditor } from './codeEditor'
import { Travel } from './travel'
import { Email } from './email'
import { Repository } from '@/lazyDB'
import { AosFieldType } from '@/abstractObjectScheme'

export enum UserType {
   CONTESTANT = 'CONTESTANT',
   TEACHER = 'TEACHER',
}

export const ProfileRepository = new Repository(
  'profile',
  {
    fields: {
      user: AosFieldType.OneToOne,
      city: AosFieldType.OneToOne,
      university: AosFieldType.OneToOne,
    },
  },
)

export const UserRepository = new Repository(
  'user',
  {
    fields: {
      userEmails: AosFieldType.OneToMany,
    },
  },
)

export const UserEmail = new Repository(
  'userEmail',
  {
    fields: {
      user: AosFieldType.OneToOne,
    },
  },
)
export interface Profile {
   id: string
   userId: string
   firstName: string | null
   middleName: string | null
   lastName: string | null
   phone: string | null
   groupNumber: string | null
   course: number | null
   cityId: string | null
   universityId: string | null
   isTeacher: boolean
   createdAt: Date
   updatedAt: Date

   user: User | null
   city: City | null
   university: University | null
}

export interface User {
   id: string
   username: string
   name: string | null
   avatarUrl: string | null
   isAdmin: boolean
   createdAt: Date
   updatedAt: Date
   userEmails: {
      nodes: Array<UserEmail>
      totalCount: number
   }
}

export interface UserEmail {
   id: string
   userId: string
   email: string
   isVerified: boolean
   createdAt: Date
   updatedAt: Date
   user: User
}

export interface UserProfile extends PartialUserProfile {
   isAdmin: boolean
   avatarUrl: string | null
   emails: Array<Email>
   middleName: string | null
   groupNumber: string | null
   course: number | null
   university: University | null
   city: City | null
   phone: string | null
   languages: Array<Language>
   codeEditors: Array<CodeEditor>
   travels: Array<Travel>
}

export interface PartialUserProfile {
   id: string
   userId: string
   login: string
   firstName: string
   lastName: string
   type: UserType
}
