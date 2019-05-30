import * as fragmentTypes from "@/api/graphql/fragments/types";
import { UserType} from "@/models";
import {PartialUserProfile} from "@/models/user";

export function responseToPartialUserProfile(p: fragmentTypes.PartialProfile): PartialUserProfile {
   if(!p.user || !p.user.name)
      throw new Error('Profile not have user')

   return {
      id: p.id,
      userId: p.user.id,
      login: p.user.name ,
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      type: p.isTeacher ? UserType.TEACHER : UserType.CONTESTANT
   }
}

