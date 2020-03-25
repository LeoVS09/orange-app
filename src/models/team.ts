import { PartialUserProfile } from './user'

export interface Team {
   id: string
   profiles: Array<PartialUserProfile> | null
   count: number
   name: string
   group?: string
   course?: number
   createdAt: Date
   updatedAt: Date
}
