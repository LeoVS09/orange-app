import cons from '../utils/console.mock'
import { AosSchema, AosFieldType } from '@/abstractObjectSchema'
import { ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import { appendPropertyToSchema } from '@/lazyDB/database/readSchema'
import { IDatabaseModelProducerStore } from '@/lazyDB/database/types'

const simplePayload = (name: string | number, type = AosFieldType.Any): ModelEventGetPropertyPayload => ({
    name, type, store: {} as IDatabaseModelProducerStore
})

const complexPayload = (name: string | number, type: AosFieldType, inner: ModelEventGetPropertyPayload): ModelEventGetPropertyPayload => ({
    name, type, inner, store: {} as IDatabaseModelProducerStore
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


    it('append simple number property', () => {
        const payload = simplePayload(0)

        const isAppended = appendPropertyToSchema(schema, payload)

        expect({ isAppended, schema }).toMatchSnapshot()
    })

    it('append simple number property like string', () => {
        const payload = simplePayload('0')

        const isAppended = appendPropertyToSchema(schema, payload)

        expect({ isAppended, schema }).toMatchSnapshot()
    })

    it('append complex OneToOne string property', () => {
        const simple = simplePayload('simple')
        const complex = complexPayload('complex', AosFieldType.OneToOne, simple)

        const isAppended = appendPropertyToSchema(schema, complex)

        expect({ isAppended, schema}).toMatchSnapshot()
    })

    // Not working correctly, require 'nodes' field
    // TODO: make it work based on type
    it('append complex OneToMany property', () => {
        const simple = simplePayload('simple')
        const item = complexPayload('0', AosFieldType.Any, simple)
        const nodes = complexPayload('nodes', AosFieldType.OneToMany, item)
        const complex = complexPayload('complex', AosFieldType.OneToOne, nodes)

        const isAppended = appendPropertyToSchema(schema, complex)

        expect({ isAppended, schema}).toMatchSnapshot()
    })

})