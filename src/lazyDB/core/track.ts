import {AbstractData, EventProducer} from "./types";
import {wrapInProducer} from "./producer/wrap";
import {asyncReceiveWithMemory} from "./receiver";
import {changeTrackableReducersMap} from "./actions";
import {isChanged} from "./states";
import {getStore} from "./common";

export function trackChange(data: AbstractData = {}) {
   const producer = wrapInProducer(data)
   const store = getStore(producer)

   asyncReceiveWithMemory(store, changeTrackableReducersMap)

   return producer
}

export const isProduerChanged = (producer: EventProducer) => {
   const store = getStore(producer)
   if(!store || !store.memory)
      return false

   return isChanged(store.memory)
}
