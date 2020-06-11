import { ListSource, ListItemGetterReference } from '@/lazyDB/database/types'
import { ArrayStringProperty } from '@/lazyDB/database/utils'

export const arrayMethodWrapper = (source: ListSource, base: Array<any>, index: ArrayStringProperty) =>
  (...args: Array<any>) => {
    console.log('[ArrayMethodWrapper], nodes property', index, args, base)
    // need extract real array data
    // in case they setted as links
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

