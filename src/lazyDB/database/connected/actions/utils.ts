import { IDatabaseModelProducerStore } from '../../types'
import { ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import { lastObjectPropertyName } from '../../utils'

export function isExcludeProperty({ excludeProperties }: IDatabaseModelProducerStore, payload: ModelEventGetPropertyPayload) {
    if (!excludeProperties)
        return false

    const prop = lastObjectPropertyName(payload)

    return excludeProperties.includes(prop)
}