import {
  IProducerStore,
  ProducerStoreGetter,
  ProducerStoreSetter,
  ModelPropertyKey,
  Producerable,
  ExtendTemporalTrap
} from '@/lazyDB/core/types'
import { getStore, isProducer } from '@/lazyDB/core/common'
import {
  nodesKey,
  NodesProducerReference,
  isNodesKey
} from '@/lazyDB/database/types'
import { AosFieldType } from '@/abstractObjectSchema'
import { nodesGetter, nodesSetter } from './nodes'
import { isListSource } from './source'
import { isTemporalTrap } from '../temporal'

export * from './source'

export function applyListControls(store: IProducerStore) {
  store.getter = getter
  store.setter = setter

  store.dispatcher.getPropertyType = getListPropertyType
}

// list source is service object which contain pagination data and array of real nodes
export const getListPropertyType = (name: ModelPropertyKey): AosFieldType => {
  // only nodes field s actuall One to Many link
  if (isNodesKey(name))
    return AosFieldType.OneToMany

  // when other pagination data is plain values
  return AosFieldType.Any
}

export const getter: ProducerStoreGetter = ({ base }, name) => {
  if (name !== nodesKey)
    return base[name as string]

  if (base[NodesProducerReference])
    return base[NodesProducerReference]

  return base[name]
}

// TODO: This setter must handle case when some one try directly set nodes array
//  as if it will be setted by elements individualy
//  aka: source.nodes = [{...}, {...}]
//   must be same as source.nodes[0] = {...}; source.nodes[1] = {...};

export const setter: ProducerStoreSetter = ({ base, extendTemporalTrap }, name, value) => {
  if (name !== nodesKey) {
    base[name as string] = value
    return true
  }
  console.log('[ListControls] setter', base, name, value)

  if (!isProducer(value)) {
    const realNodes = base[NodesProducerReference]
    console.log('[ListControls] setter realNodes before', realNodes)

    // will assugn each item individualy
    // to proxyed array, which will trigger set hooks
    const result = assignArrayValues(realNodes, value)

    console.log('[ListControls] setter realNodes after', realNodes)
    return result
  }

  base[NodesProducerReference] = value

  const nodesStore = getStore<Array<any>>(value as any)!
  return setupNodes(base, nodesStore, extendTemporalTrap)
}

/** Will assign all values from source to target array */
function assignArrayValues(
  target?: Array<any>,
  source?: Array<any>
) {
  // TODO: put this validation outside
  // and move assign to direct function
  if (!target) {
    console.error('Target array not defined')
    return false
  }

  if (!Array.isArray(source)) {
    console.error('Source array not defined')
    return false
  }

  source.forEach((node: any, i) => target[i] = node)
  return true
}

function setupNodes(listSource: Producerable<any>, nodesStore: IProducerStore<Array<any>>, extendTemporalTrap?: ExtendTemporalTrap) {
  nodesStore.extendTemporalTrap = extendTemporalTrap
  nodesStore.dispatcher.getPropertyType = getListNodesPropertyType

  if (!isListSource(listSource)) {
    console.error('Base for list controls not is ListSource type')
    return false
  }

  nodesStore.getter = nodesGetter(listSource, nodesStore)
  nodesStore.setter = nodesSetter(listSource, nodesStore)

  // need extract temporal trap if it not was wrapped as producer
  const { base: nodes, proxy: producer } = nodesStore
  if (nodes.length === 1 && isTemporalTrap(nodes[0])) {
    // getter from nodes producer will get value and set as producer
    const trap = producer![0]
    console.log('[ListControls] setter was set temporal trap for nodes', producer, trap)
  }

  return true
}

const allDigits = /\d+/

export const getListNodesPropertyType = (name: ModelPropertyKey): AosFieldType => {
  // property names for array allways string, aka: "0", "1", ...
  // but possible some causes, to be sure all corect need cast to string and then check
  if (`${name}`.match(allDigits))
    return AosFieldType.OneToOne

  // all other array fields must be any, aka: `slice`, `find`, ...
  return AosFieldType.Any
}
