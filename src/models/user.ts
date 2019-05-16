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

export interface UserProfile extends PartialUserProfile{
   isAdmin: boolean
   avatarUrl?: string
   emails: Array<Email>
   familyName?: string
   groupNumber?: string
   course?: number
   university?: University
   city?: City
   phone?: string
   languages?: Array<Language>
   codeEditors?: Array<CodeEditor>
   travel?: Array<Travel>
}

export interface PartialUserProfile {
   id: string
   userId: string
   login: string
   firstName: string
   lastName: string
   type: UserType
}
