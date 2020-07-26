import {
  AosField,
  AosFieldType,
  AosSimpleField,
  AosRelationsField,
  AosRelationsFieldType,
  AosSimpleFieldType
} from './types'

export const isSimpleAosField = (field: AosField): field is AosSimpleField =>
  isSimpleType(field.type)

export const isRelationsAosField = (field: AosField): field is AosRelationsField =>
  isRelationsType(field.type)

export const isSimpleType = (type: AosFieldType): type is AosSimpleFieldType =>
  !isRelationsType(type)

export const isRelationsType = (type: AosFieldType): type is AosRelationsFieldType =>
  type === AosFieldType.OneToOne || type === AosFieldType.OneToMany || type === AosFieldType.Service
