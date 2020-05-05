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

    it('append id before simple string property', () => {
        const idField = simplePayload('id')
        const payload = simplePayload('simple')

        let isAppended = appendPropertyToSchema(schema, idField)
        expect({ isAppended, schema }).toMatchSnapshot()

        isAppended = appendPropertyToSchema(schema, payload)
        expect({ isAppended, schema }).toMatchSnapshot()
    })

    it('append id after simple string property', () => {
        const payload = simplePayload('simple')
        const idField = simplePayload('id')

        let isAppended = appendPropertyToSchema(schema, payload)
        expect({ isAppended, schema }).toMatchSnapshot()

        isAppended = appendPropertyToSchema(schema, idField)
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

    it('append multiple string properties and id', () => {
        const first = simplePayload('first')
        const idField = simplePayload('id')
        const second = simplePayload('second')
        const nodeId = simplePayload('nodeId')
        const third = simplePayload('third')

        let isAppended = appendPropertyToSchema(schema, first)
        expect({ isAppended, schema }).toMatchSnapshot()

        isAppended = appendPropertyToSchema(schema, idField)
        expect({ isAppended, schema }).toMatchSnapshot()

        isAppended = appendPropertyToSchema(schema, second)
        expect({ isAppended, schema }).toMatchSnapshot()

        isAppended = appendPropertyToSchema(schema, nodeId)
        expect({ isAppended, schema }).toMatchSnapshot()

        isAppended = appendPropertyToSchema(schema, third)
        expect({ isAppended, schema }).toMatchSnapshot()
    })

    it('append existed simple string property', () => {
        const payload = simplePayload('simple')

        let isAppended = appendPropertyToSchema(schema, payload)
        expect({ isAppended, schema }).toMatchSnapshot()

        isAppended = appendPropertyToSchema(schema, payload)
        expect({ isAppended, schema }).toMatchSnapshot()
    })

    it('append existed simple string property after not existing', () => {
        const first = simplePayload('first')
        const second = simplePayload('second')

        let isAppended = appendPropertyToSchema(schema, first)
        expect({ isAppended, schema }).toMatchSnapshot()

        isAppended = appendPropertyToSchema(schema, second)
        expect({ isAppended, schema }).toMatchSnapshot()
        
        isAppended = appendPropertyToSchema(schema, first)
        expect({ isAppended, schema }).toMatchSnapshot()
    })


})