import { AosField, AosFieldType, AosSimpleField, AosRelationsField } from './types';

export const isSimpleAosField = (field: AosField): field is AosSimpleField => 
    !isRelationsAosField(field)

export const isRelationsAosField = (field: AosField): field is AosRelationsField => 
    field.type === AosFieldType.OneToOne || 
    field.type === AosFieldType.OneToMany
    
