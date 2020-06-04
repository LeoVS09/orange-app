import { onSet } from "@/lazyDB/recipes/trackChanges/onSet"
import cons from '../../utils/console.mock'
import { ProducerStoreSetter, IProducerStore } from '@/lazyDB/core/types'
import { isMutated } from '@/lazyDB/recipes/trackChanges/isMutated'

export interface Model {
    [key: string]: any
}

const baseHook: ProducerStoreSetter<IProducerStore<any, any>> = (store, prop, value) => {
    store.base[prop] = value
    return true
}

describe('onSet', () => {

    beforeAll(() => {
        cons.mockConsole()
    })

    afterAll(() => {
        cons.restoreConsole()
    })

    it('call hook when property added', () => {
        const base: Model = {}
        const hook = jest.fn(baseHook)

        const trackable = onSet(base, hook)
        trackable.property = 2

        expect(hook.mock.calls.length).toBe(1)
        expect(hook.mock.calls[0][1]).toBe('property')
        expect(hook.mock.calls[0][2]).toBe(2)
    })

    it('call hook when property changed', () => {
        const base: Model = {}
        const hook = jest.fn(baseHook)

        base.property = 1
        const trackable = onSet(base, hook)
        trackable.property = 3

        expect(hook.mock.calls.length).toBe(1)
        expect(hook.mock.calls[0][1]).toBe('property')
        expect(hook.mock.calls[0][2]).toBe(3)
    })

    it('call hook when property setted, but not changed', () => {
        const base: Model = {}
        const hook = jest.fn(baseHook)

        base.property = 1
        const trackable = onSet(base, hook)
        trackable.property = 1

        expect(hook.mock.calls.length).toBe(1)
        expect(hook.mock.calls[0][1]).toBe('property')
        expect(hook.mock.calls[0][2]).toBe(1)
    })

    it('not call hook when one property get', () => {
        const base: Model = {}
        const hook = jest.fn(baseHook)

        base.property = 1
        const trackable = onSet(base, hook)
        const _ = trackable.property

        expect(hook.mock.calls.length).toBe(0)
    })

    it('not call hook when new one property get', () => {
        const base: Model = {}
        const hook = jest.fn(baseHook)

        const trackable = onSet(base, hook)
        const _ = trackable.property

        expect(hook.mock.calls.length).toBe(0)
    })

    it('call hook when inner property setted', () => {
        const base: Model = {}
        const hook = jest.fn(baseHook)

        base.property = {
            a: 1
        }

        const trackable = onSet(base, hook)
        trackable.property.b = 2

        expect(hook.mock.calls.length).toBe(1)
        expect(hook.mock.calls[0][0].base).toStrictEqual({ a: 1, b: 2 })
        expect(hook.mock.calls[0][1]).toBe('b')
        expect(hook.mock.calls[0][2]).toBe(2)

        expect(base).toStrictEqual({ property: { a: 1, b: 2 } })
    })

    it('call hook when inner property changed', () => {
        const base: Model = {}
        const hook = jest.fn(baseHook)

        base.property = {
            a: 1
        }

        const trackable = onSet(base, hook)
        trackable.property.a = 2

        expect(hook.mock.calls.length).toBe(1)
        expect(hook.mock.calls[0][0].base).toStrictEqual({ a: 2 })
        expect(hook.mock.calls[0][1]).toBe('a')
        expect(hook.mock.calls[0][2]).toBe(2)

        expect(base).toStrictEqual({ property: { a: 2 } })
    })

    it('call hook when inner property set inner', () => {
        const base: Model = {}
        const hook = jest.fn(baseHook)

        base.property = {
            a: 1
        }

        const trackable = onSet(base, hook)
        trackable.property.b = {
            c: 2
        }

        expect(hook.mock.calls.length).toBe(1)
        expect(hook.mock.calls[0][0].base).toStrictEqual({ a: 1, b: { c: 2 }})
        expect(hook.mock.calls[0][1]).toBe('b')
        expect(hook.mock.calls[0][2]).toStrictEqual({ c: 2 })

        expect(base).toMatchObject({property: { a: 1, b: { c: 2 }}})
    })

    it('call hook when inner property setted, but not changed', () => {
        const base: Model = {}
        const hook = jest.fn(baseHook)

        base.property = {
            a: 1
        }

        const trackable = onSet(base, hook)
        trackable.property.a = 1

        expect(hook.mock.calls.length).toBe(1)
        expect(hook.mock.calls[0][0].base).toStrictEqual({ a: 1 })
        expect(hook.mock.calls[0][1]).toBe('a')
        expect(hook.mock.calls[0][2]).toBe(1)
        expect(base).toMatchObject({property: { a: 1 }})
    })
})