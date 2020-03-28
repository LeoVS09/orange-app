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

  public Repository: ConnectedRepository

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
    this.Repository = createConnectedRepository(this)
  }
}

export type ConnectedRepository = new <T>(entity: string, schema?: Partial<AosEntitySchema>) => LazyReactiveRepository<T>

const createConnectedRepository = (db: Database) =>
  class Repository<T> extends LazyReactiveRepository<T> {
    constructor(
      entity: string,
      schema?: Partial<AosEntitySchema>
    ) {
      super(entity, {
        table: db.storage[entity],
        schema
      })

      db.setSchema(entity, this.schema)

      this.excludeProperties = db.excludeProperties

      this.applyRepositoryControlsOptions.setLinkedEntity = genSetLinkedEntity(
        this.schema,
        db.getSchemaByKey,
        db.setEntity
      )

    }
  }
