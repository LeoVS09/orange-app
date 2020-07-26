import { AosSchema } from '@/abstractObjectSchema'
import { ChangedFields } from './postgraphile/adapter'

export interface BackendAdapter {
    getEntityById<T>(entity: string, id: string, schema: AosSchema): Promise<T>

    getEntityList<T>(entity: string, schema: AosSchema): Promise<T>

    updateEntity<T>(entity: string, id: string, schema: AosSchema, changedFields: ChangedFields): Promise<T>
}
