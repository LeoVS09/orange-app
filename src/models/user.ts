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
