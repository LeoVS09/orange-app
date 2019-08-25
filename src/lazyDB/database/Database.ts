import LazyReactiveDatabase from "./base/database/Database";
import {asyncReceiveWithMemory} from "@/lazyDB/core/receiver";
import {databaseReducers, ExcludePropertiesReference} from "./actions";

const DEFAULT_EXCLUDE_PROPERTIES = [
   'state',
   '_isVue',
   'render',
   'toJSON',
   'constructor',
   '__ob__',
   'then',
   'function () { [native code] }'
]

// Simple version of database
// TODO: must have base lifecycle handlers and debug tools
export class Database extends LazyReactiveDatabase {

   // TODO: part of properties can be computed to exclude
   public excludeProperties = [...DEFAULT_EXCLUDE_PROPERTIES]

   constructor(){
      super()

      const {base} = this.store
      // TODO: refactor, need another way to put properties to action
      base[ExcludePropertiesReference] = this.excludeProperties

      asyncReceiveWithMemory(this.store, databaseReducers)
   }


}
