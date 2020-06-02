import { ListSource, NodesProducerReference, ListItemGetterReference } from '@/lazyDB/database/types'
import { ArrayStringProperty } from '@/lazyDB/database/utils'
import { Producerable } from '@/lazyDB/core/types'

const SIMPLE_ARRAY_METHODS = ['map', 'filter']

const isNeedProduceTrapForSlice = (source: ListSource, base: Array<any>, args: Array<any>) =>
  !base.length && Math.abs(args[0] - args[1]) > 0 && !!source[NodesProducerReference]

export const arrayMethodWrapper = (source: ListSource, base: Array<any>, index: ArrayStringProperty) =>
  (...args: Array<any>) => {
    console.log('[ArrayMethodWrapper], nodes property', index, args, base)

    if (index === 'slice' && isNeedProduceTrapForSlice(source, base, args))
      return mockSliceArrayTrap(source)

    // mock simple methods like map and filter
    if (SIMPLE_ARRAY_METHODS.includes(index) && !base.length)
      return mockSimpleArrayMethod(index, source, args)

    // traps for defined function is end
    // down wrappers for real working function

    let realDataArray = base

    const getItem = source[ListItemGetterReference]
    if (getItem)
      realDataArray = base.map((_, i) => getItem(source, i))
    else
      console.warn('[ArrayMethodWrapper] List not have getItem hook', source, base, index)

    // @ts-ignore
    const result = realDataArray[index](...args)
    console.log('[ArrayMethodWrapper] nodes property', index, args, 'result', result)
    return result
  }

const mockSliceArrayTrap = (source: ListSource) => {
  console.log('[ArrayMethodWrapper] slice from array', source[NodesProducerReference])

  // @ts-ignore
  const result = source[NodesProducerReference][0]
  console.log('[ArrayMethodWrapper] slice from array result', result)
  return [result]
}

/**
 * Pass trap to method call,
 * for receive fields, which need for this method work
 * @param methodName - name of array method, aka 'map'
 * @param source - trap producer
 * @param args - agruments of method call
 */
const mockSimpleArrayMethod = (methodName: string, source: ListSource, args: Array<any>) => {
  console.log('[ArrayMethodWrapper] produce trap for', methodName)

  // @ts-ignore
  const trap = source[NodesProducerReference][0]

  // @ts-ignore
  return [trap][methodName](...args)
}
