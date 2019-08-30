// TODO: use lodash
export function splitArray<T>(arr: Array<T>, predicate: (v: T) => boolean) {
  const searching = new Array<T>()
  const other = new Array<T>()

  arr.forEach((val) => {
    if (predicate(val))
      return searching.push(val)

    return other.push(val)
  })

  return [searching, other]
}

// create symbol if can
export function SymFor(key: string): string {
  if (typeof Symbol === 'undefined' || !Symbol.for)
    return `__$${key.split(' ').join('_')}`

  return Symbol.for(key) as unknown as string
}
