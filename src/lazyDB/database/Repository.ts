import LazyReactiveRepository, {LazyReactiveRepositoryOptions} from "@/lazyDB/database/base/repository/Repository";
import {IEntityTypeSchema, ILazyReactiveDatabase} from "@/lazyDB/database/types";

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
      }
   }
}
