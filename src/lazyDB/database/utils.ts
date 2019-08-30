import { ModelEventGetPropertyPayload, ModelEventSetPropertyPayload } from '../core/types'

export function lastObjectPropertyName({ name, inner }: ModelEventGetPropertyPayload | ModelEventSetPropertyPayload): string {
  if (!inner)
    return name as string

  return lastObjectPropertyName(inner)
}
