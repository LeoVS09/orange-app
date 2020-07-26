import { AosSchema, AosFieldType } from '@/abstractObjectSchema'
import {
  sendQuery,
  sendMutation,
  QueryVariables,
  APIClient
} from '../graphql'
import { capitalise } from '../graphql/prettyAdapters'
import { BackendAdapter } from '../backend'

export interface ChangedFields {
  [prop: string]: any
}

export class PostgraphileAdapter implements BackendAdapter {
  constructor(
    private client: APIClient
  ) {}

  get sendQuery() {
    return sendQuery(this.client)
  }

  get sendMutation() {
    return sendMutation(this.client)
  }

  async getEntityById<T>(entity: string, id: string, schema: AosSchema): Promise<T> {
    return this.sendQuery(
      entity,
      schema,
      queryByIdVariables(id)
    )
  }

  async getEntityList<T>(entity: string, schema: AosSchema): Promise<T> {
    return this.sendQuery(
      entityToList(entity),
      schema
    )
  }

  async updateEntity<T>(entity: string, id: string, schema: AosSchema, changedFields: ChangedFields): Promise<T> {
    const response = await this.sendMutation(
      entityToUpdateOperation(entity),
      schemaToUpdateResponse(entity, schema),
      updateByIdVariables(entity, id, changedFields)
    )

    return extractUpdateResponseValue(entity, response as any)
  }
}

/** Generate list query name based on enitty name */
function entityToList(entity: string): string {
  if (entity.slice(-1) === 'y')
    return `${entity.slice(0, -1)}ies`

  return `${entity}s`
}

/** Generate update mutation name basaed on entity */
function entityToUpdateOperation(entity: string): string {
  return `update${capitalise(entity)}`
}

/** Generate variables for query single entity by id */
export const queryByIdVariables = (value: string): QueryVariables => ({
  id: { type: 'UUID', value, required: true }
})

export const updateByIdVariables = (entity: string, id: string, changedFields: ChangedFields): QueryVariables => ({
  input: {
    type: `Update${capitalise(entity)}Input`,
    value: {
      id: { type: 'UUID', value: id, required: true },
      patch: {
        type: `${capitalise(entity)}Patch`,
        required: true,
        value: changedFields
      }
    },
    required: true
  }
})

export const schemaToUpdateResponse = (entity: string, schema: AosSchema): AosSchema => ({
  [entity]: {
    type: AosFieldType.OneToOne,
    schema
  }
})

export const extractUpdateResponseValue = <T extends {[key: string]: any}>(entity: string, data: T): T =>
  data[entity]
