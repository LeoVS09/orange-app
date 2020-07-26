import { AosSchema, isRelationsAosField } from '@/abstractObjectSchema'
import { isListKey } from '@/lazyDB/database/storage/table'
import { databaseClient } from '@/api/database/utils'
import { ModelEvent, ModelEventSetPropertyPayload } from '@/lazyDB/core/types'
import { PostgraphileAdapter, ChangedFields } from './adapter'

export const adapter = new PostgraphileAdapter(databaseClient)

export default adapter
