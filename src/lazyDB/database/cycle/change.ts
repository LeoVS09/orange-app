import { filter } from 'rxjs/operators'
import { IDatabaseModelProducerStore, OnChangeCallback } from '../types'
import { ModelEventTypes } from '../events'

export const updateOnChange = (store: IDatabaseModelProducerStore, onChangeCallback?: OnChangeCallback) => {
  if (onChangeCallback)
    store.onChange = onChangeCallback

  const { stream } = store
  if (!stream)
    return

  stream.pipe(
    filter(event =>
      event.type === ModelEventTypes.SetProperty
      || event.type === ModelEventTypes.ReadSuccess),
  )
    .subscribe((event) => {
      console.log('Update on change', event, store)

      const { onChange } = store
      if (!onChange)
        return

      onChange(event)
    })
}
