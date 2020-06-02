
const ANY_NON_DIGIT_CHARACTER = /\D/

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
