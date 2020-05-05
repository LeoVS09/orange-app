import cons from '../utils/console.mock'
import { AosSchema, AosFieldType } from '@/abstractObjectSchema'
import { ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import { appendPropertyToSchema } from '@/lazyDB/database/readSchema'
import { IDatabaseModelProducerStore } from '@/lazyDB/database/types'

const simplePayload = (name: string, type = AosFieldType.Any): ModelEventGetPropertyPayload => ({
    name, type, store: {} as IDatabaseModelProducerStore
})

describe('AOS builder', () => {
    let schema: AosSchema

    beforeEach(() => {
        schema = {}
    })

    it('append simple string property', () => {
        const payload = simplePayload('simple')

        const isAppended = appendPropertyToSchema(schema, payload)

        expect({ isAppended, schema }).toMatchSnapshot()
    })

    it('append multiple string properties', () => {
        const first = simplePayload('first')
        const second = simplePayload('second')
        const third = simplePayload('third')

        let isAppended = appendPropertyToSchema(schema, first)
        expect({ isAppended, schema }).toMatchSnapshot()

        isAppended = appendPropertyToSchema(schema, second)
        expect({ isAppended, schema }).toMatchSnapshot()

        isAppended = appendPropertyToSchema(schema, third)
        expect({ isAppended, schema }).toMatchSnapshot()
    })
})