import { randomItem } from '@/store/utils'

const cityNames = ['some', 'strange', 'day', 'of', 'time']

export const mockCountry = (entity: string, id: string) => ({
  id,
  name: `${entity} ${id}`,
  code: 'some code',
  createdAt: new Date(),
  updatedAt: new Date(),
  cities: {
    totalCount: 20,
    nodes: new Array(7).fill(0).map((v, i) => ({
      id: i,
      name: `city ${randomItem(cityNames)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      countryId: id
    }))
  }
})
