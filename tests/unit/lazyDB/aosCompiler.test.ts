import cons from '../utils/console.mock'
import { AosSchema, AosFieldType } from '@/abstractObjectSchema'
import {
    ProducerStoreGetter,
    ModelEventPropertyPayload,
    IProducerStore,
    ProducerStoreSetter,
    IModelEventDispatcher,
    ModelPropertyKey
} from '@/lazyDB/core/types'
import { appendEventToSchema } from '@/lazyDB/core/aos/compiler'
import { wrapInProducer } from '@/lazyDB/core/wrap'
import { AtomicModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/atomic'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { receive } from '@/lazyDB/core/receiver'
import { toNumberIfCan } from '@/lazyDB/core/aos/utils'


const ENTITY_FIELD_PREFIX = 'entity'
const ENTITIES_FIELD_PREFIX = 'entities'

const mockGetter: ProducerStoreGetter = (store, name) => {
    if (typeof toNumberIfCan(name) === 'number')
        return {}

    if (typeof name !== 'string')
        return undefined

    if (name.startsWith(ENTITY_FIELD_PREFIX))
        return {}

    if (name.startsWith(ENTITIES_FIELD_PREFIX))
        return []

    return undefined
}

const mockSetter: ProducerStoreSetter = ({ base }, property, value) => {
    base[property as string] = value

    if (!isProducer(value))
        return true

    const store = getStore(value)!
    store.getter = mockGetter
    store.setter = mockSetter
    store.dispatcher = new MockDispatcher() as IModelEventDispatcher<IProducerStore<any, any>, ModelPropertyKey, any>

    return true
}

class MockDispatcher extends AtomicModelEventDispatcher<IProducerStore<any, any>> {
    getPropertyType(name: PropertyKey, store: IProducerStore): AosFieldType {
        if (typeof name !== 'string')
            return AosFieldType.Any

        if (name.startsWith(ENTITY_FIELD_PREFIX))
            return AosFieldType.OneToOne

        if (name.startsWith(ENTITIES_FIELD_PREFIX))
            return AosFieldType.OneToMany

        return AosFieldType.Any
    }
}

const makeProvider = (schema: AosSchema, additionalFields: Array<string> = []): any => {
    const producer = wrapInProducer({}, new MockDispatcher())

    const store = getStore(producer)!
    store.getter = mockGetter
    store.setter = mockSetter

    receive(store, event =>
        appendEventToSchema({
            schema,
            event: event.payload! as ModelEventPropertyPayload,
            transformTokens: list => [
                ...list, 
                ...additionalFields.map(field => ({ name: field, type: AosFieldType.Any }))
            ]
        })
    )

    return producer
}


describe('AOS Compiler', () => {
    let schema: AosSchema

    beforeAll(() => {
        cons.mockConsole()
    })

    beforeEach(() => {
        schema = {}
    })

    afterAll(() => {
        cons.restoreConsole()
    })

    it('append simple string property', () => {
        const model = makeProvider(schema)

        model.simple

        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()
    })

    it('append resolved simple string property', () => {
        const model = makeProvider(schema)

        model.simple = 1

        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()
    })

    it('resolve existing simple string property', () => {
        const model = makeProvider(schema)

        model.simple
        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()

        model.simple = 1
        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()
    })

    it('try resolve resolved simple string property', () => {
        const model = makeProvider(schema)

        model.simple = 1
        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()

        model.simple = 1
        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()
    })

    it('append id before simple string property', () => {
        const model = makeProvider(schema)

        model.id
        expect(schema).toHaveProperty('id')
        expect(schema).not.toHaveProperty('simple')
        expect(schema).toMatchSnapshot()

        model.simple
        expect(schema).toHaveProperty('id')
        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()
    })

    it('append id after simple string property', () => {
        const model = makeProvider(schema)

        model.simple
        expect(schema).not.toHaveProperty('id')
        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()

        model.id
        expect(schema).toHaveProperty('id')
        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()
    })


    it('append multiple string properties', () => {
        const model = makeProvider(schema)

        model.first
        expect(schema).toHaveProperty('first')
        expect(schema).toMatchSnapshot()

        model.second
        expect(schema).toHaveProperty('second')
        expect(schema).toMatchSnapshot()

        model.third
        expect(schema).toHaveProperty('third')
        expect(schema).toMatchSnapshot()
    })

    it('append required id field before propery', () => {
        const model = makeProvider(schema, ['id'])

        model.simple
        expect(schema).toHaveProperty('id')
        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()
    })

    it('don\'t append required id field second time', () => {
        const model = makeProvider(schema, ['id'])

        model.first
        expect(schema).toHaveProperty('id')
        expect(schema).toHaveProperty('first')
        expect(schema).toMatchSnapshot()

        model.second
        expect(schema).toHaveProperty('id')
        expect(schema).toHaveProperty('first')
        expect(schema).toHaveProperty('second')
        expect(schema).toMatchSnapshot()
    })

    it('append multiple required fields before propery', () => {
        const model = makeProvider(schema, ['id', 'nodeId', 'anotherId'])

        model.simple
        expect(schema).toHaveProperty('id')
        expect(schema).toHaveProperty('nodeId')
        expect(schema).toHaveProperty('anotherId')
        expect(schema).toHaveProperty('simple')
        expect(schema).toMatchSnapshot()
    })

    it('don\'t change schema if same propeprty asked', () => {
        const model = makeProvider(schema)

        model.simple
        expect(schema).toHaveProperty('simple')
        const schemaWithSimpleField = Object.assign(schema)

        model.simple
        expect(schema).toHaveProperty('simple')
        expect(schema).toEqual(schemaWithSimpleField)
    })

    it('append simple number property', () => {
        const model = makeProvider(schema)

        model[0]

        expect(schema).toMatchSnapshot()
    })

    it('resolve simple number property', () => {
        const model = makeProvider(schema)

        model[0] = 1

        expect(schema).toMatchSnapshot()
    })

    // Possible not what execting
    it('append simple number property like string', () => {
        const model = makeProvider(schema)

        model['0']

        expect(schema).toMatchSnapshot()
    })

    it('append complex OneToOne string property', () => {
        const model = makeProvider(schema)

        model.entity.simple

        expect(schema).toHaveProperty('entity.schema.simple')
        expect(schema.entity.type).toBe(AosFieldType.OneToOne)
        expect(schema).toMatchSnapshot()
    })

    it('resolve complex OneToOne string property', () => {
        const model = makeProvider(schema)

        model.entity.simple = 1

        expect(schema).toHaveProperty('entity.schema.simple')
        expect(schema.entity.type).toBe(AosFieldType.OneToOne)
        expect(schema).toMatchSnapshot()
    })

    it('append simple property to complex OneToOne', () => {
        const model = makeProvider(schema)

        const entity = model.entity
        expect(schema).toHaveProperty('entity.schema')
        expect(schema.entity.type).toBe(AosFieldType.OneToOne)
        expect(schema).toMatchSnapshot()

        entity.first
        expect(schema).toHaveProperty('entity.schema.first')
        expect(schema).toMatchSnapshot()

        entity.second
        expect(schema).toHaveProperty('entity.schema.second')
        expect(schema).toMatchSnapshot()
    })

    it('resolve simple property to complex OneToOne', () => {
        const model = makeProvider(schema)

        const entity = model.entity
        expect(schema).toHaveProperty('entity.schema')
        expect(schema.entity.type).toBe(AosFieldType.OneToOne)
        expect(schema).toMatchSnapshot()

        entity.simple
        expect(schema).toHaveProperty('entity.schema.simple')
        expect(schema).toMatchSnapshot()

        entity.simple = 1
        expect(schema).toHaveProperty('entity.schema.simple')
        expect(schema).toMatchSnapshot()
    })


    it('append simple property to complex OneToOne with required fields', () => {
        const model = makeProvider(schema, ['id', 'nodeId', 'anotherId'])

        const entity = model.entity
        expect(schema).not.toHaveProperty('id')
        expect(schema).not.toHaveProperty('nodeId')
        expect(schema).not.toHaveProperty('anotherId')
        expect(schema).toHaveProperty('entity.schema.id')
        expect(schema).toHaveProperty('entity.schema.nodeId')
        expect(schema).toHaveProperty('entity.schema.anotherId')
        expect(schema.entity.type).toBe(AosFieldType.OneToOne)
        expect(schema).toMatchSnapshot()

        entity.first
        expect(schema).not.toHaveProperty('id')
        expect(schema).not.toHaveProperty('nodeId')
        expect(schema).not.toHaveProperty('anotherId')
        expect(schema).toHaveProperty('entity.schema.first')
        expect(schema).toHaveProperty('entity.schema.id')
        expect(schema).toHaveProperty('entity.schema.nodeId')
        expect(schema).toHaveProperty('entity.schema.anotherId')
        expect(schema).toMatchSnapshot()

        entity.second
        expect(schema).not.toHaveProperty('id')
        expect(schema).not.toHaveProperty('nodeId')
        expect(schema).not.toHaveProperty('anotherId')
        expect(schema).toHaveProperty('entity.schema.second')
        expect(schema).toHaveProperty('entity.schema.id')
        expect(schema).toHaveProperty('entity.schema.nodeId')
        expect(schema).toHaveProperty('entity.schema.anotherId')
        expect(schema).toMatchSnapshot()
    })

    it('append simple property before and after complex OneToOne', () => {
        const model = makeProvider(schema)

        model.first
        expect(schema).toHaveProperty('first')
        expect(schema).toMatchSnapshot()

        const entity = model.entity
        expect(schema).toHaveProperty('entity.schema')
        expect(schema.entity.type).toBe(AosFieldType.OneToOne)
        expect(schema).toMatchSnapshot()

        entity.second
        expect(schema).toHaveProperty('entity.schema.second')
        expect(schema).toMatchSnapshot()

        entity.third
        expect(schema).toHaveProperty('entity.schema.third')
        expect(schema).toMatchSnapshot()

        model.fourth
        expect(schema).toHaveProperty('fourth')
        expect(schema).toMatchSnapshot()
    })

    it('append OneToOne complex property after another complex OneToOne', () => {
        const model = makeProvider(schema)

        model.entity1.first
        expect(schema).toHaveProperty('entity1.schema.first')
        expect(schema.entity1.type).toBe(AosFieldType.OneToOne)
        expect(schema).toMatchSnapshot()

        model.entity1.second
        expect(schema).toHaveProperty('entity1.schema.second')
        expect(schema.entity1.type).toBe(AosFieldType.OneToOne)
        expect(schema).toMatchSnapshot()

        model.entity2.third
        expect(schema).toHaveProperty('entity2.schema.third')
        expect(schema.entity2.type).toBe(AosFieldType.OneToOne)
        expect(schema).toMatchSnapshot()
    })

    it('append complex OneToMany property', () => {
        const model = makeProvider(schema)

        model.entities[0].simple
        expect(schema).toHaveProperty('entities.schema.simple')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()
    })

    it('append complex OneToMany property by steps', () => {
        const model = makeProvider(schema)

        const { entities } = model
        expect(schema).toHaveProperty('entities.schema')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()

        const entity = entities[0]
        expect(schema).toHaveProperty('entities.schema')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).not.toHaveProperty('entities.schema.0')
        // must be not changed from previous
        expect(schema).toMatchSnapshot()

        entity.simple
        expect(schema).toHaveProperty('entities.schema.simple')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()
    })

    it('append complex OneToMany property with required fields', () => {
        const model = makeProvider(schema, ['id', 'nodeId', 'anotherId'])

        expect(schema).not.toHaveProperty('id')
        expect(schema).not.toHaveProperty('nodeId')
        expect(schema).not.toHaveProperty('anotherId')

        const { entities } = model
        expect(schema).toHaveProperty('entities.schema')
        expect(schema).not.toHaveProperty('id')
        expect(schema).not.toHaveProperty('nodeId')
        expect(schema).not.toHaveProperty('anotherId')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toHaveProperty('entities.schema.id')
        expect(schema).toHaveProperty('entities.schema.nodeId')
        expect(schema).toHaveProperty('entities.schema.anotherId')
        expect(schema).toMatchSnapshot()

        const entity = entities[0]
        expect(schema).toHaveProperty('entities.schema')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toHaveProperty('entities.schema.id')
        expect(schema).toHaveProperty('entities.schema.nodeId')
        expect(schema).toHaveProperty('entities.schema.anotherId')
        // must be not changed from previous
        expect(schema).toMatchSnapshot()

        entity.simple
        expect(schema).toHaveProperty('entities.schema.simple')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toHaveProperty('entities.schema.id')
        expect(schema).toHaveProperty('entities.schema.nodeId')
        expect(schema).toHaveProperty('entities.schema.anotherId')
        expect(schema).toMatchSnapshot()
    })

    it('append multiple simple properties to OneToMany', () => {
        const model = makeProvider(schema)

        model.first
        expect(schema).toHaveProperty('first')
        expect(schema).toMatchSnapshot()

        const entity = model.entities[0]

        entity.second
        expect(schema).toHaveProperty('entities.schema.second')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()

        entity.third
        expect(schema).toHaveProperty('entities.schema.third')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()

        model.fourth
        expect(schema).toHaveProperty('fourth')
        expect(schema).toMatchSnapshot()
    })

    it('resolve multiple simple properties to OneToMany', () => {
        const model = makeProvider(schema)

        model.first
        expect(schema).toHaveProperty('first')
        expect(schema).toMatchSnapshot()

        const entity = model.entities[0]

        entity.second
        expect(schema).toHaveProperty('entities.schema.second')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()

        entity.second = 1
        expect(schema).toHaveProperty('entities.schema.second')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()

        entity.third
        expect(schema).toHaveProperty('entities.schema.third')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()

        model.fourth = 1
        expect(schema).toHaveProperty('fourth')
        expect(schema).toMatchSnapshot()
    })

    it('append complex OneToMany to different items', () => {
        const model = makeProvider(schema)

        model.first
        expect(schema).toHaveProperty('first')
        expect(schema).toMatchSnapshot()

        model.entities[0].second
        expect(schema).toHaveProperty('entities.schema.second')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()

        model.entities[1].third
        expect(schema).toHaveProperty('entities.schema.third')
        expect(schema.entities.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()

        model.fourth
        expect(schema).toHaveProperty('fourth')
        expect(schema).toMatchSnapshot()
    })

    it('append complex OneToMany to different properties', () => {
        const model = makeProvider(schema)

        model.first
        expect(schema).toHaveProperty('first')
        expect(schema).toMatchSnapshot()

        model.entities1[0].second
        expect(schema).toHaveProperty('entities1.schema.second')
        expect(schema.entities1.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()

        model.entities2[0].third
        expect(schema).toHaveProperty('entities2.schema.third')
        expect(schema.entities2.type).toBe(AosFieldType.OneToMany)
        expect(schema).toMatchSnapshot()

        model.fourth
        expect(schema).toHaveProperty('fourth')
        expect(schema).toMatchSnapshot()
    })

    it('multiple nesting levels of properties', () => {
        const model = makeProvider(schema)

        model.entity1.entities1[0].entity2.entity3.entities2[0].simple
        expect(schema).toHaveProperty('entity1.schema.entities1.schema.entity2.schema.entity3.schema.entities2.schema.simple')
        expect(schema).toMatchSnapshot()
    })

})