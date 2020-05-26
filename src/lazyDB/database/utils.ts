
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
  'reduceRight'
]

export const isArrayProperty = (property: string): property is ArrayStringProperty =>
  ArrayProperties.includes(property)

export const appendToWindow = (varaiables: {[key: string]: any}) => {
  if (typeof (window) !== 'undefined') {
    for (const key of Object.keys(varaiables)) {
      // @ts-ignore
      window[key] = varaiables[key]
      console.warn('Global', key, 'instance appended to window', varaiables[key])
    }
  }
}
