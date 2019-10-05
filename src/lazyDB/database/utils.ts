import { ModelEventGetPropertyPayload, ModelEventSetPropertyPayload } from '../core/types'

export function lastObjectPropertyName({ name, inner }: ModelEventGetPropertyPayload | ModelEventSetPropertyPayload): string {
  if (!inner)
    return name as string

  return lastObjectPropertyName(inner)
}

export type ArrayStringProperty =
  'length' |
  'toString' |
  'toLocaleString' |
  'pop' |
  'push' |
  'concat' |
  'join' |
  'reverse' |
  'shift' |
  'slice' |
  'sort' |
  'splice' |
  'unshift' |
  'indexOf' |
  'lastIndexOf' |
  'every' |
  'some' |
  'forEach' |
  'map' |
  'filter' |
  'reduce' |
  'reduceRight';

const ArrayProperties: Array<string> = [
  'length',
  'toString',
  'toLocaleString',
  'pop',
  'push',
  'concat',
  'join',
  'reverse',
  'shift',
  'slice',
  'sort',
  'splice',
  'unshift',
  'indexOf',
  'lastIndexOf',
  'every',
  'some',
  'forEach',
  'map',
  'filter',
  'reduce',
  'reduceRight',
]

export const isArrayProperty = (property: string): property is ArrayStringProperty =>
  ArrayProperties.includes(property)
