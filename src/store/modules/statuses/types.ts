export const MODULE_PREFIX = 'statuses';

export enum ModelStatus {
   None = 'None',
   Reading = 'Reading',
   Synced = 'Synced',
   Changed = 'Changed',
   Updating = 'Updating',
   ForCreate = 'For create',
   Creating = 'Creating',
   Deleting = 'Deleting',
   ErrorReading = 'Error reading',
   ErrorUpdating = 'Error updating',
   ErrorCreating = 'Error creating',
   ErrorDeleting = 'Error deleting',
}

export enum ModelReadState {
   None = 'None',
   Partial = 'Partial',
   Full =  'Full',
}

export interface ModelState {
   read: ModelReadState;
   status: ModelStatus;
   changedAt: Date;
}

export interface StatusScope {
   [id: string]: ModelState;
}

export interface StatusScopes {
   [scope: string]: StatusScope;
}

export interface ISetStatusPayload {
   scope: string;
   id: string;
   status: ModelStatus;
}

export interface ISetReadStatePayload {
   scope: string;
   id: string;
   read: ModelReadState;
}

export interface ISetModelStatePayload {
   scope: string;
   id: string;
   model: ModelState;
}
