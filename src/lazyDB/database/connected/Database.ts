import { connectDebugToActionsStream } from '@/lazyDB/debug/actions'
import { asyncReceiveWithMemory } from '@/lazyDB/core/receiver'
import { databaseReducers } from '@/lazyDB/database/connected/actions'
import { defaultExcludeProperties } from '@/lazyDB/constants'
import LazyReactiveRepository from '@/lazyDB/database/base/repository/Repository'
import { AosEntitySchema, AosFieldType } from '@/abstractObjectScheme'
import { AbstractData } from '@/lazyDB/core/types'
import { genSetLinkedEntity, getSchemaByKey } from '@/lazyDB/database/base/database/controls'
import LazyReactiveDatabase from '../base/database/Database'

// Simple version of database
// TODO: must have base lifecycle handlers and debug tools
export class Database extends LazyReactiveDatabase {

  public Repository: typeof Repository = Repository

  constructor() {
    super({
      // TODO: part of properties can be computed to exclude
      excludeProperties: [...defaultExcludeProperties]
    })

    // TODO: refactor, need another way to put properties to action
    this.store.excludeProperties = this.excludeProperties

    asyncReceiveWithMemory(this.store, databaseReducers)

    connectDebugToActionsStream(this.store)

    // TODO: not plain, need create more readable solution for connect Repository to database,
    //  this will not work with multiple databases
    this.Repository.db = this
  }
}

class Repository<T> extends LazyReactiveRepository<T> {

  static db: Database

  constructor(
    entity: string,
    schema?: Partial<AosEntitySchema>
  ) {
    super(entity, {
      table: Repository.db.storage[entity],
      schema
    })

    Repository.db.setSchema(entity, this.schema)

    this.excludeProperties = Repository.db.excludeProperties

    this.applyRepositoryControlsOptions.setLinkedEntity = genSetLinkedEntity(
      this.schema,
      Repository.db.getSchemaByKey,
      Repository.db.setEntity
    )

  }
}
