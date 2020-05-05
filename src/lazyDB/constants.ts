export const defaultExcludeProperties = [
  'state',
  /^_.*/,
  /^\$.*/,
  /^@.*/,
  'render',
  'every', // some vue function used in slots
  'toJSON',
  'constructor',
  'prototype',
  'then',
  'catch',
  'function () { [native code] }',
  'slice',
  'map',
  'length',
  'push',
  'pop',
  'required',
  'validator',
  'get',
  'type',
  'isVueInstance',
  'nodeType',
  'asymmetricMatch' // jest snapshot
]

// fields which will be included in any request
export const requiredFields = ['id', 'nodeId']
