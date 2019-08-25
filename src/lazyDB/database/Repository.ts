import LazyReactiveRepository from "@/lazyDB/database/base/repository/Repository";
import {IEntityTypeSchema, ILazyReactiveDatabase} from "@/lazyDB/database/types";
import {ExcludePropertiesReference} from "@/lazyDB/database/actions";
import {asyncReceiveWithMemory} from "@/lazyDB/core/receiver";
import {repositoryReducers} from './actions'

export function makeConnectedRepositoryClass(db: ILazyReactiveDatabase) {
   // Connected to db entity repository by default
   return class Repository extends LazyReactiveRepository {
      constructor(
         entity: string,
         schema?: IEntityTypeSchema
      ) {
         super(entity, {
            table: db.storage[entity],
            schema
         })

         if(schema)
            db.setSchema(entity, schema)

         const {base} = this.store
         base[ExcludePropertiesReference] = db.excludeProperties

         asyncReceiveWithMemory(this.store, repositoryReducers)
      }
   }
}
