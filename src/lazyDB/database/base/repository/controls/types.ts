import { AosFieldType, AosEntitySchema } from '@/abstractObjectSchema'
import { Producerable, IProducerStore } from '@/lazyDB/core/types'

export interface IGetLinkedEntity {
    (store: IProducerStore<Producerable>, name: string, type: AosFieldType): object | undefined
}

export interface ISetLinkedEntity {
    (store: IProducerStore<Producerable>, name: string, type: string, value: any): boolean
}

export interface ApplyRepositoryControlsOptions {
    getFieldType: GetFieldType,
    getLinkedEntity?: IGetLinkedEntity
    setLinkedEntity?: ISetLinkedEntity
}

export interface IGetSchema {
    (entity: string): AosEntitySchema | undefined
}

export interface GetFieldType {
    (name: string): AosFieldType
}
