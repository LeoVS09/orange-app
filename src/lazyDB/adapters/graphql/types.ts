export interface QueryField {
    [entity: string]: QueryFields
}

export type QueryFields = Array<string | QueryField>

export const isQueryField = (field: string | QueryField): field is QueryField =>
  typeof field === 'object'

export interface QueryVariable {
  type: string
  value: any
  required?: boolean
}

export interface QueryVariables {
  [name: string]: QueryVariable | string | number
}
