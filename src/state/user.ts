import {City, Country} from "./country";
import {University} from "./university";
import {Language} from "./language";
import {CodeEditor} from "./codeEditor";
import {Travel} from "./travel";
import {Email} from "./email";

export enum UserType {
  CONTESTANT = "CONTESTANT",
  TEACHER = "TEACHER"
}

export interface User {
  id: string
  login: string
  isAdmin: boolean
  emails: Array<Email>
  firstName: string
  familyName?: string
  lastName: string
  type: UserType
  photography?: string
  groupNumber?: string
  course?: number
  university?: University
  city?: City
  country?: Country
  phone?: string
  languages?: Array<Language>
  codeEditors?: Array<CodeEditor>
  travel?: Array<Travel>
}
