import { IProducerStore } from '@/lazyDB/core/types'
import { deleteProperty, get, set } from './controls'

export const objectTraps: ProxyHandler<IProducerStore> = {
  get,
  set,

  deleteProperty,

  has(store, prop) {
    return prop in store.base
  },

  ownKeys(store) {
    return Reflect.ownKeys(store.base)
  },

  getOwnPropertyDescriptor(store, prop) {
    return Reflect.getOwnPropertyDescriptor(store.base, prop)
  },
  defineProperty() {
    throw new Error('Object.defineProperty() cannot be used on an LazyDb event producer')
  },
  getPrototypeOf(store) {
    const proto = Object.getPrototypeOf(store.base)
    if (!proto) {
      console.error('Object.getPrototypeOf from', store, 'was return', proto)
      return proto
    }

    return proto
  },
  setPrototypeOf() {
    throw new Error('Object.defineProperty() cannot be used on an LazyDb event producer')
  }
}

export const arrayTraps: ProxyHandler<Array<IProducerStore>> = {
  ...Object.keys(objectTraps).reduce((traps, key) => {
    // @ts-ignore
    const handler = objectTraps[key]

    // @ts-ignore
    traps[key] = function () {
      // Map [storage] from first argument for array wrapped storage to real storage
      // eslint-disable-next-line prefer-rest-params,prefer-destructuring
      arguments[0] = arguments[0][0]

      // eslint-disable-next-line prefer-rest-params
      return handler.apply(this, arguments)
    }

    return traps
  }, { }),

  deleteProperty([store]: Array<IProducerStore>, prop: PropertyKey): boolean {
    // eslint-disable-next-line radix,no-restricted-globals
    if (typeof prop === 'symbol' || (typeof prop === 'string' && isNaN(parseInt(prop))))
      throw new Error('LazyDb cannot delete not number properties for arrays')

    // @ts-ignore
    return objectTraps.deleteProperty.call(this, store, prop)
  }
}
