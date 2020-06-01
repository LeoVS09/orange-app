
export const isPromiseLike = (value: any): value is PromiseLike<any> =>
  typeof value === 'object' && value.then

// TODO: rewrite, code must write without this strange behavior
export function async<T>(value: T | Promise<T>): Promise<T> {
  if (isPromiseLike(value))
    return value

  return Promise.resolve(value)
}
