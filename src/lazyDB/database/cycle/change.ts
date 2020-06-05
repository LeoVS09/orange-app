import { debounceTime } from 'rxjs/operators'
import { filterEventsByTypes } from '@/lazyDB/reactive/filterEventByTypes'
import { Observable } from 'rxjs'
import { ModelEvent } from '@/lazyDB/core/types'
import { debug } from '@/reactive/debug'
import { ModelEventTypes } from '../events'
import { IDatabaseModelProducerStore, OnChangeCallback } from '../types'

const DEFAULT_DEBOUNCE_CHANGE_TIME = 10
const DEFAULT_CHANGE_EVENTS = [
  ModelEventTypes.Read,
  ModelEventTypes.Success,
  ModelEventTypes.Failure,
  ModelEventTypes.SetProperty
]

export interface WhenChangedOptions {
  changeEvents?: Array<ModelEventTypes>
  debounceChangeTime?: number
}

// Spawn event when one of given events was received
export const whenChanged = ({
  changeEvents = DEFAULT_CHANGE_EVENTS,
  debounceChangeTime = DEFAULT_DEBOUNCE_CHANGE_TIME
}: WhenChangedOptions = {}) => (stream: Observable<ModelEvent<any, any>>) =>
  stream.pipe(
    filterEventsByTypes(changeEvents),
    debounceTime(debounceChangeTime),
    debug('on change event')
  )

export const updateOnChangeHandler = (store: IDatabaseModelProducerStore<any, any>, onChangeCallback?: OnChangeCallback) => {
  if (onChangeCallback)
    store.onChange = onChangeCallback

  return (event: ModelEvent<any>) => {
    const { onChange } = store
    if (!onChange)
      return

    onChange(event)
  }
}
