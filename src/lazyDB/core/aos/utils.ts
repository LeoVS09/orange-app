
const ANY_NON_DIGIT_CHARACTER = /\D/

// TODO: need find better solution for resolve issue

/**
 * Will transform string to number if it possible,
 * actually resolve problem: "When asked item in array by index, index number transform to string",
 * as example: array[3] -> will by catched by proxy as get("3").
 * For resolve this issue, allways tryies cast any string to number.
 * Actaully cannot be casted only for array, because js, under the hood any array actaully is object,
 * and any object with number keys can be interpritated as array. (V8 work this way)
 */
export function toNumberIfCan(name: string | number | symbol): string | number {
  // Symbol just for correct ts typing
  if (typeof name === 'number' || typeof name === 'symbol')
    return name as number

  // Prevent to incorrectly parse id as number
  if (ANY_NON_DIGIT_CHARACTER.test(name))
    return name

  const parsedNumber = Number.parseInt(name, 10)
  if (Number.isInteger(parsedNumber))
    return parsedNumber

  return name
}
