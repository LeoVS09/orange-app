import {
  IProducerStore,
  ProducerStoreGetter,
  ProducerStoreSetter,
  ModelPropertyKey
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
    if (!realNodes) {
      console.error('Nodes store must firstly define base data store')
      return false
    }

    console.log('[ListControls] setter realNodes before', realNodes)

    if (!Array.isArray(value)) {
      console.error('value for set nodes must be array')
      return false
    }

    value.forEach((node: any, i) => realNodes[i] = node)
    console.log('[ListControls] setter realNodes after', realNodes, base)
    return true
  }

  base[NodesProducerReference] = value

  const nodesStore = getStore(value) as unknown as IProducerStore<Array<any>>
  nodesStore.extendTemporalTrap = extendTemporalTrap
  nodesStore.dispatcher.getPropertyType = getListNodesPropertyType

  if (!isListSource(base)) {
    console.error('Base for list controls not is ListSource type')
    return false
  }

  nodesStore.getter = nodesGetter(base, nodesStore)
  nodesStore.setter = nodesSetter(base, nodesStore)

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
