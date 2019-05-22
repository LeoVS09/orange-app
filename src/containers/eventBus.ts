import Vue from 'vue'

const eventBus = new Vue()

export default eventBus

export enum BusEventTypes {
   Authorisation = 'Authorisation'
}

export enum AuthorisationEventState {
   Completed = 'Completed'
}

export interface AuthorisationEventPayload {
   state: AuthorisationEventState
}
