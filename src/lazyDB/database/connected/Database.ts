import LazyReactiveDatabase from '../base/database/Database'
import { connectDebugToActionsStream } from '@/lazyDB/debug/actions'
import { asyncReceiveWithMemory } from '@/lazyDB/core/receiver'
import { databaseReducers } from '@/lazyDB/database/connected/actions'

const DEFAULT_EXCLUDE_PROPERTIES = [
  'state',
  '_isVue',
  'render',
  'toJSON',
  'constructor',
  '__ob__',
  'then',
  'catch',
  'function () { [native code] }',
  'slice',
  'length',
]

// Simple version of database
// TODO: must have base lifecycle handlers and debug tools
export class Database extends LazyReactiveDatabase {
  constructor() {
    super({
      // TODO: part of properties can be computed to exclude
      excludeProperties: [...DEFAULT_EXCLUDE_PROPERTIES],
    })

    // TODO: refactor, need another way to put properties to action
    this.store.excludeProperties = this.excludeProperties

    asyncReceiveWithMemory(this.store, databaseReducers)

    connectDebugToActionsStream(this.store)
  }
}
