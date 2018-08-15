
export enum UserType {
  CONTESTANT,
  TEACHER
}

export interface User {
  id: string,
  firstName: string,
  familyName?: string,
  lastName: string,
  login: string,
  type: UserType,
  photography?: string,
  group?: string,
  course?: number,
  universityShortName?: string,
  universityLongName?: string,
  city?: string,
  country?: string,
  email: string,
  phone?: string,
  languages?: Array<string>,
  codeEditors?: Array<string>,
  travel?: {
    arrival: number,
    departure: number,
    isNeedHousing: boolean
  }
}
