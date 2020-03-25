import { University } from './university'
import { Country } from './country'

export interface City {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    countryId: string
    universities?: Array<University>
    country?: Country
}
