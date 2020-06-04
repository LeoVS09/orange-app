import cons from '../../utils/console.mock'
import { StateMemory } from '@/lazyDB/core/memory'
import { ModelEventSetPropertyPayload, ModelEvent, IProducerStore } from '@/lazyDB/core/types'
import { ModelEventTypes } from '@/lazyDB/database/events'
import { AosFieldType } from '@/abstractObjectSchema'
import { zipSetEvents } from '@/lazyDB/core/optimisation/zipper'

const DEFAULT_START_DATE = 1500000000000

const setEvent = (name: string, oldValue: any, newValue: any, date: number): ModelEvent<ModelEventSetPropertyPayload> => ({
    type: ModelEventTypes.SetProperty,
    date,
    payload: {
        store: {} as IProducerStore,
        type: AosFieldType.Any,
        name,
        oldValue, 
        newValue
    }
})

const event = (type: ModelEventTypes, date: number): ModelEvent<any> => ({
    type,
    date,
    payload: {}
})

describe('Zipper', () => {

    let memory: StateMemory<ModelEvent<any, any>>
    const now = DEFAULT_START_DATE

    beforeAll(() => {
        cons.mockConsole()
    })

    afterAll(() => {
        cons.restoreConsole()
    })

    beforeEach(() => {
        memory = new StateMemory()
    })

    it('should colapse two sequental set events into one', () => {
        const name = 'prop'
        memory.push(setEvent(name, 'a', 'ab', now))
        memory.push(setEvent(name, 'ab', 'abc', now + 1))

        zipSetEvents(memory)

        expect(memory.length).toBe(1)
        expect(memory.get(0)).toStrictEqual(setEvent(name, 'a', 'abc', now))
    })

    it('should colapse multiple sequental set events into one', () => {
        const name = 'prop'
        memory.push(setEvent(name, 'a', 'ab', now))
        memory.push(setEvent(name, 'ab', 'abc', now + 1))
        memory.push(setEvent(name, 'abc', 'abcd', now + 2))
        memory.push(setEvent(name, 'abcd', 'abcde', now + 3))
        memory.push(setEvent(name, 'abcde', 'abcdef', now + 4))

        zipSetEvents(memory)

        expect(memory.length).toBe(1)
        expect(memory.get(0)).toStrictEqual(setEvent(name, 'a', 'abcdef', now))
    })

    it('should colapse multiple sequental set events into two by property names', () => {
        memory.push(setEvent('prop1', 'a', 'ab', now))
        memory.push(setEvent('prop2', 'ab', 'abc', now + 1))
        memory.push(setEvent('prop1', 'ab', 'abc', now + 2))
        memory.push(setEvent('prop1', 'abc', 'abcde', now + 3))
        memory.push(setEvent('prop2', 'abc', 'abcdef', now + 4))

        zipSetEvents(memory)

        expect(memory.length).toBe(2)
        expect(memory.memory).toStrictEqual([
            setEvent('prop1', 'a', 'abcde', now),
            setEvent('prop2', 'ab', 'abcdef', now + 1)
        ])
    })


    it('should colapse multiple sequental set events into one and not change other events', () => {
        const name = 'prop'
        memory.push(setEvent(name, 'a', 'abcd', now))
        memory.push(event(ModelEventTypes.GetProperty, now + 1))
        memory.push(event(ModelEventTypes.GetProperty, now + 2))
        memory.push(setEvent(name, 'abcd', 'abcde', now + 3))
        memory.push(event(ModelEventTypes.Read, now + 4))

        zipSetEvents(memory)

        expect(memory.length).toBe(4)
        expect(memory.memory).toStrictEqual([
            setEvent(name, 'a', 'abcde', now),
            event(ModelEventTypes.GetProperty, now + 1),
            event(ModelEventTypes.GetProperty, now + 2),
            event(ModelEventTypes.Read, now + 4)
        ])
    })

    it('should colapse multiple sequental set events into one, when they not in correct order', () => {
        const name = 'prop'
        memory.push(setEvent(name, 'a', 'ab', now))
        memory.push(setEvent(name, 'abc', 'abcd', now + 2))
        memory.push(setEvent(name, 'abcde', 'abcdef', now + 4))
        memory.push(setEvent(name, 'ab', 'abc', now + 1))
        memory.push(setEvent(name, 'abcd', 'abcde', now + 3))

        zipSetEvents(memory)

        expect(memory.length).toBe(1)
        expect(memory.get(0)).toStrictEqual(setEvent(name, 'a', 'abcdef', now))
    })

    it('should not collapse events when values not ordered', () => {
        const name = 'prop'
        const defined = [
            setEvent(name, 'a', 'ab', now),
            setEvent(name, 'abc', 'abcd', now + 1),
            setEvent(name, 'abcde', 'abcdef', now + 2),
            setEvent(name, 'ab', 'abc', now + 3),
            setEvent(name, 'abcd', 'abcde', now + 4)
        ]
        memory.push(...defined)

        zipSetEvents(memory)

        expect(memory.length).toBe(5)
        expect(memory.memory).toStrictEqual(defined)
    })


})