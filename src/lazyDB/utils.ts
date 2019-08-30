import deepMap from 'deep-map'
import { ILazyReactiveDatabase } from '@/lazyDB/database/types'
import { ModelReadSchemaField } from '@/lazyDB/types'
import { ModelAttributeType } from '@/lazyDB/core/types'

const keysForMapDays: Array<string> = []
const keyMath = /.+(Date|At)$/gm

// Transform to date types fields with matched names
export function dateToStringFormatter <T>(t: T): T {
  return deepMap<T>(t, (value, key) => {
    if (typeof key === 'number')
      return value

    if (keysForMapDays.indexOf(key) === -1 && !key.match(keyMath))
      return value

    if (value === null || value === undefined)
      return value

    return new Date(value)
  })
}

export function extractEntityNameFromManyKey(key: string) {
  const last = key.slice(-1)
  if (last !== 's')
    return key

  const lastThree = key.slice(-3)
  if (lastThree === 'ies')
    return `${key.slice(0, -3)}y`

  return key.slice(0, -1)
}

export function addOrUpdate(db: ILazyReactiveDatabase, entity: string, node: { id: string}) {
  const success = db.update(entity, node.id, node)
  if (success)
    return

  db.add(entity, node.id, node)
}

export function isSchemaField(field: ModelReadSchemaField | ModelAttributeType): field is ModelReadSchemaField {
  return typeof field === 'object'
}

export function wait(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
