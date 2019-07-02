
export interface AbstractData {
   [key: string]: any
}

export interface ChangeCallback {
   (): void
}

export interface ModelSchemaField {
   type: ModelAttributeType
   fields: ModelSchema
}

export interface ModelSchema {
   [key: string]: ModelAttributeType | ModelSchemaField
}

export interface IModelObserver {
   schema: ModelSchema
   data: AbstractData
   wrapped: AbstractData
   entity: string
   db?: ILazyReactiveDatabase
   updateData: (data: AbstractData) => void
}

export enum ModelAttributeType {
   Simple = 'Simple',
   OneToMany = 'OneToMany',
   OneToOne = 'OneToOne'
}

export interface IPredefinedSchema {
   [key: string]: ModelAttributeType
}

export interface ILazyReactiveDatabase {
   findOne: (entity: string, id: string, wrapped?: boolean) => AbstractData | undefined
   set: (entity: string, id: string, observer: IModelObserver) => void
   update: (entity: string, id: string, data: AbstractData) => boolean
}

export const ModelObserverReference = Symbol('model observer')
