import LazyReactiveDatabase from '../base/database/Database'
import {connectDebugToActionsStream} from "@/lazyDB/debug/actions";

const DEFAULT_EXCLUDE_PROPERTIES = [
   'state',
   '_isVue',
   'render',
   'toJSON',
   'constructor',
   '__ob__',
   'then',
   'function () { [native code] }',
   'slice',
]

// Simple version of database
// TODO: must have base lifecycle handlers and debug tools
export class Database extends LazyReactiveDatabase {

   constructor() {
      super({
         // TODO: part of properties can be computed to exclude
         excludeProperties: [...DEFAULT_EXCLUDE_PROPERTIES],
      })

      // const {base} = this.store
      // // TODO: refactor, need another way to put properties to action
      // base[ExcludePropertiesReference] = this.excludeProperties
      //
      // asyncReceiveWithMemory(this.store, databaseReducers)

      connectDebugToActionsStream(this.store)
   }


}
