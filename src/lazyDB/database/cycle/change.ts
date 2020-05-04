import { debounceTime } from 'rxjs/operators'
import { filterEventsByTypes } from '@/lazyDB/reactive/filterEventByTypes'
import { Observable } from 'rxjs'
import { ModelEvent } from '@/lazyDB/core/types'
import { debug } from '@/lazyDB/reactive/debug'
import { ModelEventTypes } from '../events'
import { IDatabaseModelProducerStore, OnChangeCallback, ListProducer } from '../types'

const CHANGE_TIME = 10

export const whenChanged = (changeTime = CHANGE_TIME) => (stream: Observable<ModelEvent<any>>) =>
  stream.pipe(
    filterEventsByTypes([ModelEventTypes.Read, ModelEventTypes.ReadSuccess, ModelEventTypes.ReadFailure]),
    debounceTime(changeTime),
    debug('on change event')
  )

export const updateOnChangeHandler = (store: IDatabaseModelProducerStore, onChangeCallback?: OnChangeCallback) => {
  if (onChangeCallback)
    store.onChange = onChangeCallback

  return (event: ModelEvent<any>) => {
    const { onChange } = store
    if (!onChange)
      return

    onChange(event)
  }
}

export const listOnChangeWrapper = (list: ListProducer<any>, onChange?: OnChangeCallback): OnChangeCallback =>
  event => {

    // Hack for vue to track changed nodes
    // list.nodes.push(null)
    // list.nodes.pop()

    if (onChange)
      onChange(event)
  }
