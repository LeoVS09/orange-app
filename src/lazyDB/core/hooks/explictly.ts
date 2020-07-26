// Standart JS object and array propertyes,
// need return to not break built in js operators
export const isExplictlyAccessPropty = (prop: PropertyKey): prop is symbol =>
  // [[Prototype]] link
  prop === 'prototype' || prop === '__proto__'
  // contructor object
  || prop === 'constructor'
  // string casting
  || prop === 'valueOf' || prop === 'toString()'
  // allow symbols access base directly
  // must be be after ProducerStoreReference (it is predifyned symbol)
  || typeof prop === 'symbol'
  // allow access to properties which starts from `_*`
  || (typeof prop === 'string' && prop[0] === '_')
