import { City } from './city'

export interface Country {
  id: string
  name: string
  code: string
  cities?: {
    nodes: Array<City>
  }
  createdAt: Date
  updatedAt: Date
}
