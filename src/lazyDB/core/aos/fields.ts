import {
  AosSimpleFieldType,
  AosRelationsField,
  AosRelationsFieldType,
  AosSchema,
  AosSimpleField
} from '@/abstractObjectSchema'

export class RelationsField implements AosRelationsField {
  constructor(
      public type: AosRelationsFieldType,
      public schema: AosSchema = {}
  ) { }
}

export class SimpleField implements AosSimpleField {
  constructor(
      public type: AosSimpleFieldType
  ) {}
}
