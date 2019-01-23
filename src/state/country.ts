
export interface Country {
  id: string
  name: string
  cities?: Array<City>
}

export interface City {
  id: string
  name: string
}
