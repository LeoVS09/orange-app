import { City } from './city'
import { University } from './university'
import { Language } from './language'
import { CodeEditor } from './codeEditor'
import { Travel } from './travel'
import { Email } from './email'

export enum UserType {
   CONTESTANT = 'CONTESTANT',
   TEACHER = 'TEACHER',
}
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

// return user initials in format LastName F.M.
export const profileInitials = (profile: Profile): string | null => {
  if (!profile.firstName || !profile.lastName)
    return null

  const lastName = profile.lastName.slice(0, 1).toUpperCase() + profile.lastName.slice(1)
  const firstNameLetter = profile.firstName.slice(0, 1).toUpperCase()
  const middleNameLetter = (profile.middleName || '').slice(0, 1).toUpperCase()

  if (!middleNameLetter)
    return `${lastName} ${firstNameLetter}.`

  return `${lastName} ${firstNameLetter}. ${middleNameLetter}.`
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
