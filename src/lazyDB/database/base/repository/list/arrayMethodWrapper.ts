import { ListSource, NodesProducerReference, ListItemGetterReference } from '@/lazyDB/database/types'
import { ArrayStringProperty } from '@/lazyDB/database/utils'
import { AbstractData } from '@/lazyDB/core/types'

const isNeedProduceTrapForSlice = (source: ListSource, base: Array<any>, args: Array<any>) =>
  !base.length && Math.abs(args[0] - args[1]) > 0 && !!source[NodesProducerReference]

export const arrayMethodWrapper = (source: ListSource, base: Array<any>, index: ArrayStringProperty) =>
  (...args: Array<any>) => {
    console.log('nodes property', index, args, base)

    if (index === 'slice' && isNeedProduceTrapForSlice(source, base, args))
      return mockSliceArrayTrap(source)

    if (index === 'map' && !base.length)
      return mockMapArrayTrap(source, args)

    // traps for defined function is end
    // down wrappers for real working function

    let realDataArray = base

    const getItem = source[ListItemGetterReference]
    if (getItem)
      realDataArray = base.map((_, i) => getItem(source, i))
    else
      console.warn('List not have getItem hook', source, base, index)

    // @ts-ignore
    const result = realDataArray[index](...args)
    console.log('nodes property', index, args, 'result', result)
    return result
  }

const mockSliceArrayTrap = (source: ListSource) => {
  console.log('slice from array', source[NodesProducerReference])

  // @ts-ignore
  const result = source[NodesProducerReference][0]
  console.log('slice from array result', result)
  return [result]
}

const mockMapArrayTrap = (source: ListSource, args: Array<any>) => {
  console.log('produce trap for map')

  // @ts-ignore
  const trap = source[NodesProducerReference][0]

  // @ts-ignore
  return [trap].map(...args)
}

