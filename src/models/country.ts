export interface Country {
   id: string
   name: string
   cities?: Array<City>
   createdAt: Date
   updatedAt: Date
}

export interface City {
   id: string
   name: string
}
