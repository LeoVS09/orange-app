import {Country, UserProfile} from "@/models"
import {City} from "@/models/country";

export class ProfileState {
   data?: UserProfile
   // TODO: move to another module
   countries: Array<Country> = []
   cities: Array<City> = []
}
