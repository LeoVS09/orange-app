import {PartialUserProfile, UserProfile} from './user';

export interface Team {
   id: string;
   profiles: PartialUserProfile[] | null;
   count: number;
   name: string;
   group?: string;
   course?: number;
   createdAt: Date;
   updatedAt: Date;
}
