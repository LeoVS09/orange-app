import { ModelEventInnerPayload } from '@/lazyDB/core/types'

// TODO: this inner check describe more big problem with current not plain type system
// There only two ways to fix it, complitely rewrite all by using typescript hacks
// Or use other language with better type support (like Dart)

export function getInnerPayload<T>(payload: ModelEventInnerPayload<T>): T {
  // TODO: make guard
  if (!payload.inner)
    throw new Error('Not have inner payload')

  return payload.inner as T
}

export function getInnerInnerPayload<T>(payload: ModelEventInnerPayload<ModelEventInnerPayload<T>>): T {

  const inner = getInnerPayload(payload)

  return getInnerPayload(inner)
}

export function getInitialPayload<T>(payload: ModelEventInnerPayload<T>): T {
  if (!payload.inner)
    return payload as unknown as T

  return getInitialPayload(payload.inner as ModelEventInnerPayload<T>)
}
