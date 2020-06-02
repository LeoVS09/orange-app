import { isWasChaged } from "@/lazyDB/receipes/trackChanges"
import cons from '../utils/console.mock'

export interface Model {
    [key: string]: any
}

describe('Track changes', () => {

    beforeAll(() => {
        cons.mockConsole()
    })

    afterAll(() => {
        cons.restoreConsole()
    })

    it('return true when one property added', () => {
        const base: Model = {}

        const isChanged = isWasChaged(base, model => {
            model.property = 1
        })

        expect(isChanged).toBeTruthy()
        expect(base).toMatchObject({property: 1})
    })

    it('return true when one property changed', () => {
        const base: Model = {}

        base.property = 1

        const isChanged = isWasChaged(base, model => {
            model.property = 2
        })

        expect(isChanged).toBeTruthy()
        expect(base).toMatchObject({property: 2})
    })

    it('return false when one property setted, but not changed', () => {
        const base: Model = {}

        base.property = 1

        const isChanged = isWasChaged(base, model => {
            model.property = 1
        })

        expect(isChanged).toBeFalsy()
        expect(base).toMatchObject({property: 1})
    })

    it('return false when one property get', () => {
        const base: Model = {}

        base.property = 1

        const isChanged = isWasChaged(base, model => {
            const _ = model.property
        })

        expect(isChanged).toBeFalsy()
        expect(base).toMatchObject({property: 1})
    })

    it('return false when new one property get', () => {
        const base: Model = {}

        const isChanged = isWasChaged(base, model => {
            const _ = model.property
        })

        expect(isChanged).toBeFalsy()
        expect(base).toMatchObject({})
    })

    it('return true when inner property setted', () => {
        const base: Model = {}

        base.property = {
            a: 1
        }

        const isChanged = isWasChaged(base, model => {
            model.property.b = 2
        })

        expect(isChanged).toBeTruthy()
        expect(base).toMatchObject({property: { a: 1, b: 2 }})
    })

    it('return true when inner property changed', () => {
        const base: Model = {}

        base.property = {
            a: 1
        }

        const isChanged = isWasChaged(base, model => {
            model.property.a = 2
        })

        expect(isChanged).toBeTruthy()
        expect(base).toMatchObject({property: { a: 2 }})
    })

    it('return true when inner property set inner', () => {
        const base: Model = {}

        base.property = {
            a: 1
        }

        const isChanged = isWasChaged(base, model => {
            model.property.b = {
                c: 2
            }
        })

        expect(isChanged).toBeTruthy()
        expect(base).toMatchObject({property: { a: 1, b: { c: 2 }}})
    })

    it('return false when inner property setted, but not changed', () => {
        const base: Model = {}

        base.property = {
            a: 1
        }

        const isChanged = isWasChaged(base, model => {
            model.property.a = 1
        })

        expect(isChanged).toBeFalsy()
        expect(base).toMatchObject({property: { a: 1 }})
    })
})