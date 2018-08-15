import {User} from "./user";

export interface Team {
  id: string,
  users: Array<User>,
  name: string,
  group?: string,
  course?: number,
  universityShortName?: string,
  universityLongName?: string,
  city?: string,
  country?: string,
}
