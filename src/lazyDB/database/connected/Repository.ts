import LazyReactiveRepository from '@/lazyDB/database/base/repository/Repository'
import { ILazyReactiveDatabase } from '@/lazyDB/database/types'
import { AosFieldType, AosEntitySchema } from '@/abstractObjectScheme'
import { AbstractData } from '@/lazyDB/core/types'

export function makeConnectedRepositoryClass<T extends AbstractData = AbstractData>(db: ILazyReactiveDatabase) {
  const getSchema = (entity: string) => db.getSchemaByKey(entity, AosFieldType.OneToOne)

  // Connected to db entity repository by default
  return class Repository extends LazyReactiveRepository<T> {
    constructor(
      entity: string,
      schema?: Partial<AosEntitySchema>,
    ) {
      super(entity, {
        table: db.storage[entity],
        schema,
      })

      if (this.schema)
        db.setSchema(entity, this.schema)

      this.getSchema = getSchema

      this.excludeProperties = db.excludeProperties
    }
  }
}
