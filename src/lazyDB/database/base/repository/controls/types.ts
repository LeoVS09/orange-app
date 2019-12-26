import { AosFieldType, AosEntitySchema } from '@/abstractObjectScheme'
import { AbstractData, IProducerStore } from '@/lazyDB/core/types'

export interface IGetLinkedEntity {
    (store: IProducerStore<AbstractData>, name: string, type: AosFieldType): object | undefined
}

export interface ISetLinkedEntity {
    (store: IProducerStore<AbstractData>, name: string, type: string, value: any): boolean
}

export interface IGetSchema {
    (entity: string): AosEntitySchema | undefined
}
