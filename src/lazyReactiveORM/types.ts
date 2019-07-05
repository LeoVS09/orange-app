
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
   excludeProperties: Array<string>
   updateData: (data: AbstractData) => void
   changed?: ChangeCallback
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
   schemas: {[entity: string]: IPredefinedSchema}
   findOne: (entity: string, id: string, wrapped?: boolean) => AbstractData | undefined
   set: (entity: string, id: string, observer: IModelObserver) => void
   update: (entity: string, id: string, data: AbstractData) => boolean
   add: (entity: string, id: string, data: AbstractData) => void
}

export const ModelObserverReference = Symbol('model observer')
