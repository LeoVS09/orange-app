// Standart JS object and array propertyes,
// need return to not break built in js operators
export const isExplictlyAccessPropty = (prop: PropertyKey): boolean =>
  // [[Prototype]] link
  prop === 'prototype' || prop === '__proto__'
  // contructor object
  || prop === 'constructor'
  // allow symbols access base directly
  // must be be after ProducerStoreReference (it is predifyned symbol)
  || typeof prop === 'symbol'
  // allow access to properties which starts from `_*`
  || (typeof prop === 'string' && prop[0] === '_')
