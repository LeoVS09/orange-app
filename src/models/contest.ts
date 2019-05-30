import {FullProblem, PartialProblem} from "./problems";
import {ResultOfProblem} from "./tests";
import {PartialUserProfile} from './user'
import {Team} from "@/models/team";

export interface Requirements {
   course?: number
}

export interface Contest {
   id: string,
   name: string
   // TODO: rename to description
   text: string | null,
   creatorId: string,
   creator: PartialUserProfile,

   problems: Array<PartialProblem> | null,
   // TODO: rename to contestants
   profiles: Array<PartialUserProfile> | null,
   teams: Array<Team> | null,

   requirements?: {
      contestant?: Requirements,
      team?: Requirements
   },

   startDate: Date | null,
   endDate: Date | null,
   startPublicationDate: Date | null,
   endPublicationDate: Date | null,

   createdAt: Date,
   updatedAt: Date,
   place?: string,
   rules?: Array<string>,
   comments?: Array<string>,
   technicalEquipment?: string,
   organizers?: Array<string>,
   contacts?: string,
   tax?: number,
   fund?: number
}
