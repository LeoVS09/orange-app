import { AosFieldType, AosEntitySchema } from '@/abstractObjectSchema'
import { AbstractData, IProducerStore } from '@/lazyDB/core/types'

export interface IGetLinkedEntity {
    (store: IProducerStore<AbstractData>, name: string, type: AosFieldType): object | undefined
}

export interface ISetLinkedEntity {
    (store: IProducerStore<AbstractData>, name: string, type: string, value: any): boolean
}

export interface ApplyRepositoryControlsOptions {
    getLinkedEntity?: IGetLinkedEntity
    setLinkedEntity?: ISetLinkedEntity
}

export interface IGetSchema {
    (entity: string): AosEntitySchema | undefined
}
