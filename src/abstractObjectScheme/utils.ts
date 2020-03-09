import {
  AosField, AosFieldType, AosSimpleField, AosRelationsField
} from './types'

export const isSimpleAosField = (field: AosField): field is AosSimpleField =>
  isSimpleType(field.type)

export const isRelationsAosField = (field: AosField): field is AosRelationsField =>
  isRelationsType(field.type)

export const isSimpleType = (type: AosFieldType): type is (
    AosFieldType.Any |
    AosFieldType.String |
    AosFieldType.Number |
    AosFieldType.Boolean |
    AosFieldType.Date) =>
  !isRelationsType(type)

export const isRelationsType = (type: AosFieldType): type is (
    AosFieldType.OneToOne |
    AosFieldType.OneToMany) =>
  type === AosFieldType.OneToOne || type === AosFieldType.OneToMany
