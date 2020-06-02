import { ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import { IDatabaseModelProducerStore } from '../types'

// Is exclude used for remove from event cycle, memory and handlers any service properties
//  better find way to understand which property actualy must be used,
//  then remove any property which possible not need to use
//  So on any update of this code take in mind,
//  this is not best solution, and not need upgrade current behaivor
export function isExcludeProperty({ excludeProperties }: IDatabaseModelProducerStore, payload: ModelEventGetPropertyPayload) {
  if (!excludeProperties) {
    console.warn('[Actions] producer store does not containt exclude properties list, possible error')
    return false
  }

  const { name } = payload

  // There used filter multiple times for readobility
  //  this operations is run on every "get" event
  //  if will required any optimisation,
  //  better use memoisation for this function,
  //  or for whole get handler
  const excludeStrings = excludeProperties.filter(exclude => typeof exclude === 'string')
  const excludeRegexs = excludeProperties.filter(exclude => isRegex(exclude)) as Array<RegExp>

  if (excludeStrings.includes(name as string))
    return true

  return !!excludeRegexs.find(exclude => !!exclude.exec(name as string))
}

const isRegex = (prop: string | RegExp): prop is RegExp => {
  if (typeof prop !== 'object')
    return false

  return typeof prop.exec === 'function'
}
