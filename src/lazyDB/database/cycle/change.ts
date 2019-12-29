import { debounceTime, filter } from 'rxjs/operators'
import { IDatabaseModelProducerStore, OnChangeCallback } from '../types'
import { ModelEventTypes } from '../events'

const CHANGE_TIME = 50

export const updateOnChange = (store: IDatabaseModelProducerStore, onChangeCallback?: OnChangeCallback) => {
  if (onChangeCallback)
    store.onChange = onChangeCallback

  const { stream, memory, base } = store
  if (!stream)
    return

  stream.pipe(
    filter(event =>
      event.type === ModelEventTypes.SetProperty
      || event.type === ModelEventTypes.ReadSuccess),
    debounceTime(CHANGE_TIME),
  )
    .subscribe((event) => {
      console.log('Update on change', event, store, memory, base)

      const { onChange } = store
      if (!onChange)
        return

      onChange(event)
    })
}
