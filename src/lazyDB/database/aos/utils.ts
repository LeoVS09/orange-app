export function toNumberIfCan(name: string | number | symbol): string | number {
  if (typeof name === 'number')
    return name

  const parsedNumber = Number.parseInt(name as string, 10)
  if (Number.isInteger(parsedNumber))
    return parsedNumber

  return name as string
}
