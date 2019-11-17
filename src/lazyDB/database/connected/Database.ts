import LazyReactiveDatabase from '../base/database/Database'
import { connectDebugToActionsStream } from '@/lazyDB/debug/actions'
import { asyncReceiveWithMemory } from '@/lazyDB/core/receiver'
import { databaseReducers } from '@/lazyDB/database/connected/actions'
import { defaultExcludeProperties } from '@/lazyDB/constants'

// Simple version of database
// TODO: must have base lifecycle handlers and debug tools
export class Database extends LazyReactiveDatabase {
  constructor() {
    super({
      // TODO: part of properties can be computed to exclude
      excludeProperties: [...defaultExcludeProperties],
    })

    // TODO: refactor, need another way to put properties to action
    this.store.excludeProperties = this.excludeProperties

    asyncReceiveWithMemory(this.store, databaseReducers)

    connectDebugToActionsStream(this.store)
  }
}
