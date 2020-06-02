export interface QueryField {
    [entity: string]: QueryFields
}

export type QueryFields = Array<string | QueryField>

export const isQueryField = (field: string | QueryField): field is QueryField =>
  typeof field === 'object'

