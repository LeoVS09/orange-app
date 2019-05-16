import {Country, UserProfile} from "@/models"

export class ProfileState {
   data?: UserProfile
   countries: Array<Country> = []
}
