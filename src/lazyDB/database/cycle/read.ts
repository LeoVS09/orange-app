import { debounceTime, filter, map } from 'rxjs/operators'
import { createDraft } from 'immer'
import { ModelEventReadPayload, ModelEventTypes } from '../events'
import { isReading } from '../states'
import { takeWhileThenContinue } from './utils'
import { IDatabaseModelProducerStore } from '../types'

// Need calc this dynamically
const READ_TIME = 50

export type CanReadCallback = () => boolean

export function getsSpawnReadEvent(
  {
    memory,
    stream,
    dispatcher,
  }: IDatabaseModelProducerStore,
  canRead: CanReadCallback = () => true,
) {
  /*
   * Take all get events, when pause spawn read event
   * If when reading was get events, after read success spawn another read event
   * */
  takeWhileThenContinue(
      stream!.pipe(filter(event => event.type === ModelEventTypes.GetProperty)),
      () => canRead() && !isReading(memory!),
      stream!.pipe(filter(event => event.type === ModelEventTypes.ReadSuccess)),
  )
    .pipe(
      debounceTime(READ_TIME),
      map(() => {
        const gets = memory!.filter(event => event.type === ModelEventTypes.GetProperty)
        console.log('get events spawn readd event', memory!.memory.length, memory)
        return gets
      }),
      filter(gets => !!gets.length),
    )
  // TODO: need spawn read events in parallel of different models
    .subscribe((gets) => {
      const { payload: { store } } = gets[0]
      const { readSchema } = store

      const payload: ModelEventReadPayload = {
        gets,
        sets: [],
        readSchema: readSchema!,
        store,
      }

      dispatcher.dispatch(ModelEventTypes.Read, payload)
    })
}