export enum UserType {
  CONTESTANT = "CONTESTANT",
  TEACHER = "TEACHER"
}

export interface User {
  id: string
  login: string
  isAdmin: boolean
  emails: [
    {
      email: string
      isVerified: boolean
      createdAt: string
      updatedAt: string
    }
  ]
  firstName: string
  familyName?: string
  lastName: string
  type: UserType
  photography?: string
  group?: string
  course?: number
  universityShortName?: string
  universityLongName?: string
  city?: string
  country?: string
  phone?: string
  languages?: Array<string>
  codeEditors?: Array<string>
  travel?: {
    arrival: number
    departure: number
    isNeedHousing: boolean
  }
}
