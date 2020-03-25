import { City } from '@/models/city'

export interface University {
  id: string
  shortName: string
  longName: string | null
  createdAt: Date
  updatedAt: Date
  cityId: string
  city?: City
}
