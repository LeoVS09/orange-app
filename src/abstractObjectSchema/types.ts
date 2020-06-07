
export enum AosFieldType {
    Any = 'Any',
    OneToOne = 'OneToOne',
    OneToMany = 'OneToMany',
    String = 'String',
    Number = 'Number',
    Boolean = 'Boolean',
    Date = 'Date'
}

/**
 * Note: Actually Any field type is just define unknown about type,
 * but in base case we will mean that is simple type
 * if not one set it as Relation type
 */

export type AosSimeplFieldType =
    AosFieldType.Any |
    AosFieldType.String |
    AosFieldType.Number |
    AosFieldType.Boolean |
    AosFieldType.Date

export type AosRelationsFieldType = AosFieldType.OneToOne | AosFieldType.OneToMany

export interface AosSimpleField {
    type: AosSimeplFieldType
}

export interface AosRelationsField {
    type: AosRelationsFieldType
    schema: AosSchema
}

export type AosField = AosSimpleField | AosRelationsField

/**
 * Recursive scheme of object and relations to other objects
 * Like AST, but for object relations
 * */
export interface AosSchema {
    [keys: string]: AosField
}

// Plain Scheme of entity in database
export interface AosEntitySchema {
    primaryKey: string
    foreignKeys: Array<string>
    fields: AosEntityFields
}

// Map of entity fields
export interface AosEntityFields {
    [key: string]: AosFieldType | AosEntityField
}

export interface AosEntityField {
    type: AosFieldType
    table?: string
}

// Describe database relations scheme
export interface AosEntitySchemaStorage {
    [entity: string]: AosEntitySchema
}
