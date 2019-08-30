import { IProducerStore} from '@/lazyDB/core/types'

export function connectDebugToActionsStream({ stream}: IProducerStore) {
   stream!.subscribe(({ type, date, payload}) => {
      console.log(type, date, payload)
   })
}
