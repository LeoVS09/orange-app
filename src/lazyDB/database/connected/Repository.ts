import LazyReactiveRepository from '@/lazyDB/database/base/repository/Repository'
import { IEntityTypeSchema, ILazyReactiveDatabase } from '@/lazyDB/database/types'
import { ModelAttributeType } from '@/lazyDB/core/types'

export function makeConnectedRepositoryClass(db: ILazyReactiveDatabase) {
  const getSchema = (entity: string) => db.getSchemaByKey(entity, ModelAttributeType.OneToOne)

  // Connected to db entity repository by default
  return class Repository extends LazyReactiveRepository {
    constructor(
      entity: string,
      schema?: IEntityTypeSchema,
    ) {
      super(entity, {
        table: db.storage[entity],
        schema,
      })

      if (schema)
        db.setSchema(entity, schema)

      this.getSchema = getSchema

      this.excludeProperties = db.excludeProperties
    }
  }
}
