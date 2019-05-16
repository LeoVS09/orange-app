import {UserProfile} from "./user";

export interface Team {
  id: string,
  users: Array<UserProfile>,
  name: string,
  group?: string,
  course?: number,
  universityShortName?: string,
  universityLongName?: string,
  city?: string,
  country?: string,
}
