
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

export interface AosSimpleField {
    type:
        AosFieldType.Any |
        AosFieldType.String |
        AosFieldType.Number |
        AosFieldType.Boolean |
        AosFieldType.Date
}

export interface AosRelationsField {
    type : AosFieldType.OneToOne | AosFieldType.OneToMany
    scheme: AosScheme
}

export type AosField = AosSimpleField | AosRelationsField

// Recursive scheme of object and relations to other objects
export interface AosScheme {
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
    [key: string]: AosFieldType
}
