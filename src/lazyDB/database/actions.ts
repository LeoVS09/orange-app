import {EventReducersMap, EventType} from "@/lazyDB/core/types";
import {lastObjectPropertyName} from "@/lazyDB/database/utils";
import {SymFor} from "@/lazyDB/core/utils";

export const ExcludePropertiesReference = SymFor('exclude properties')

export const databaseReducers: EventReducersMap = {
   [EventType.GetProperty]: ({base}, payload) => {
      console.log('EventType.GetProperty', payload)

      const excludeProperties = base[ExcludePropertiesReference] as Array<string>

      const prop = lastObjectPropertyName(payload)
      if (excludeProperties.includes(prop))
         return true

      return false
   },

   [EventType.SetProperty]: (store, payload) => {
      console.log('EventType.SetProperty', payload)
      return false
   },

   [EventType.DeleteProperty]: (store, payload) => {
      console.log('EventType.DeleteProperty', payload)
      return false
   }
}
