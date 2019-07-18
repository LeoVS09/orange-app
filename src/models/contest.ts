import {FullProblem, PartialProblem} from './problems'
import {ResultOfProblem} from './tests'
import {PartialUserProfile} from './user'
import {Team} from '@/models/team'

export interface Requirements {
   course?: number
}

export interface PartialContest {
   id: string
   name: string
   // TODO: rename to description
   text: string | null
   creatorId: string
   creator: PartialUserProfile

   startDate: Date | null
   endDate: Date | null
   startPublicationDate: Date | null
   endPublicationDate: Date | null

   createdAt: Date
   updatedAt: Date

}

export interface FullContest extends PartialContest {
   problems: PartialProblem[] | null
   // TODO: rename to contestants
   profiles: PartialUserProfile[] | null
   teams: Team[] | null

   requirements?: {
      contestant?: Requirements,
      team?: Requirements,
   }

   place?: string
   rules?: string[]
   comments?: string[]
   technicalEquipment?: string
   organizers?: string[]
   contacts?: string
   tax?: number
   fund?: number
}
