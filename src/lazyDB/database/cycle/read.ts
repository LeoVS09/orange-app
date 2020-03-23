import { debounceTime, filter, map } from 'rxjs/operators'
import { createDraft } from 'immer'
import { ModelEventReadPayload, ModelEventTypes } from '../events'
import { isReading } from '../states'
import { takeWhileThenContinue } from './utils'
import { IDatabaseModelProducerStore } from '../types'

// TODO: Need calc this dynamically
const READ_TIME = 50

export type CanReadCallback = () => boolean

export function getsSpawnReadEvent(
  {
    memory,
    stream,
    dispatcher
  }: IDatabaseModelProducerStore,
  canRead: CanReadCallback = () => true
) {
  /*
   * Take all get events, when pause spawn read event
   * If when reading was get events, after read success spawn another read event
   * */
  takeWhileThenContinue(
      stream!.pipe(filter(event => {
        console.log('filter event', event)
        return event.type === ModelEventTypes.GetProperty
      })),
      () => canRead() && !isReading(memory!),
      stream!.pipe(filter(event => event.type === ModelEventTypes.ReadSuccess))
  )
    .pipe(
      debounceTime(READ_TIME),
      map(() => {
        const gets = memory!.filter(event => event.type === ModelEventTypes.GetProperty)
        console.log('try find gets events after debounce', gets, memory)
        return gets
      }),
      filter(gets =>
        !!gets.length
        // TODO: inspect
        // strange bug when have multple repositories on page,
        // may spawn read events while have read event in memmory,
        // possible caused by read success event and rerender by other repository
        && !isReading(memory!))
    )
  // TODO: need spawn read events in parallel of different models
    .subscribe(gets => {
      const { payload: { store } } = gets[0]
      const { readSchema } = store

      const payload: ModelEventReadPayload = {
        gets,
        sets: [],
        readSchema: readSchema!,
        store
      }
      console.log('get events spawn read event', 'gets.length:', gets.length, 'memory.length:', memory!.memory.length, memory)

      dispatcher.dispatch(ModelEventTypes.Read, payload)
    })
}
