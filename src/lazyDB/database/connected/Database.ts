import LazyReactiveDatabase from '../base/database/Database'
import { connectDebugToActionsStream } from '@/lazyDB/debug/actions'
import { asyncReceiveWithMemory } from '@/lazyDB/core/receiver'
import { databaseReducers } from '@/lazyDB/database/connected/actions'
import { defaultExcludeProperties } from '@/lazyDB/constants'
import LazyReactiveRepository from '@/lazyDB/database/base/repository/Repository'
import { AosEntitySchema, AosFieldType } from '@/abstractObjectScheme'
import { AbstractData } from '@/lazyDB/core/types'
import { genSetLinkedEntity, getSchemaByKey } from '@/lazyDB/database/base/database/controls'

// Simple version of database
// TODO: must have base lifecycle handlers and debug tools
export class Database extends LazyReactiveDatabase {

  Repository: IRepository

  constructor() {
    super({
      // TODO: part of properties can be computed to exclude
      excludeProperties: [...defaultExcludeProperties],
    })

    // TODO: refactor, need another way to put properties to action
    this.store.excludeProperties = this.excludeProperties

    asyncReceiveWithMemory(this.store, databaseReducers)

    connectDebugToActionsStream(this.store)

    const db = this

    // TODO: not plain, need create more readble solution for connect Repository to database
    this.Repository = class Repository<T> extends LazyReactiveRepository<T> {
      constructor(
        entity: string,
        schema?: Partial<AosEntitySchema>,
      ) {
        super(entity, {
          table: db.storage[entity],
          schema,
        })

        db.setSchema(entity, this.schema)

        this.excludeProperties = db.excludeProperties

        const getSchema = (key: string) => getSchemaByKey(db.schemas, key, AosFieldType.OneToOne)
        this.applyRepositoryControlsOptions.setLinkedEntity = genSetLinkedEntity(this.schema, getSchema)

      }
    } as IRepository
  }
}

export interface IRepository<T extends AbstractData = AbstractData> extends LazyReactiveRepository<T> {
  new (entity: string, schema?: Partial<AosEntitySchema>): LazyReactiveRepository<T>
}
