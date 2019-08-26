import {EventType, ModelEvent, StateResolver} from './types'

export const isChanged: StateResolver<ModelEvent<any>> = ({ memory }) =>
   memory.some(({ type }) => type === EventType.SetProperty)

export const isReceiving: StateResolver<ModelEvent<any>> = ({ memory }) =>
   memory.some(({type}) => type === EventType.GetProperty)
