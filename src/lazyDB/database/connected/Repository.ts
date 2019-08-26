import LazyReactiveRepository from '@/lazyDB/database/base/repository/Repository'
import {IEntityTypeSchema, ILazyReactiveDatabase} from '@/lazyDB/database/types'
import {asyncReceiveWithMemory} from '@/lazyDB/core/receiver'
import {repositoryReducers} from './actions'
import {connectDebugToActionsStream} from "@/lazyDB/debug/actions";
import {getsSpawnReadEvent} from "@/lazyDB/database/cycle/read";

export function makeConnectedRepositoryClass(db: ILazyReactiveDatabase) {
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

         if (schema) {
            db.setSchema(entity, schema)
         }

         const store = this.store

         store.excludeProperties = db.excludeProperties
         // TODO: remove requiring of order
         // Current logic require this order to call functions
         asyncReceiveWithMemory(store, repositoryReducers)
         // spawn require to stream which generate only on async receive
         getsSpawnReadEvent(store)
         // connect debug require stream which generate on async receive
         connectDebugToActionsStream(store)
      }
   }
}
