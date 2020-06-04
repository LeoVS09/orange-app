import { ModelEvent } from "@/lazyDB/core/types"
import { ModelEventTypes } from '@/lazyDB/database/events'
import { byTime } from '@/lazyDB/core/optimisation/zipper'

const DEFAULT_START_DATE = 1500000000000

const event = (date: number): ModelEvent<any, any> => ({
    type: ModelEventTypes.GetProperty,
    payload: {},
    date
})

describe('Sort events by time', () => {
    const now = DEFAULT_START_DATE

    it('not change two sequental events', () => {
        const defined = [
            event(now),
            event(now + 1)
        ]

        const sorted = defined.sort(byTime)

        expect(sorted).toBe(defined)
    })


    it('not change multiple sequental events', () => {
        const defined = [
            event(now),
            event(now + 1),
            event(now + 2),
            event(now + 3),
            event(now + 4),
        ]

        const sorted = defined.sort(byTime)

        expect(sorted).toBe(defined)
    })

    it('sort multiple sequentially reversed events', () => {
        const defined = [
            event(now + 4),
            event(now + 3),
            event(now + 2),
            event(now + 1),
            event(now),
        ]

        const sorted = defined.sort(byTime)

        expect(sorted).toBe(defined.reverse())
    })

    it('sort two sequentially reversed events', () => {
        const defined = [
            event(now + 1),
            event(now)
        ]

        const sorted = defined.sort(byTime)

        expect(sorted).toBe(defined)
    })

    it('sort multiple not ordered events', () => {
        const defined = [
            event(now),
            event(now + 3),
            event(now + 1),
            event(now + 2),
            event(now + 4),
        ]

        const sorted = defined.sort(byTime)

        expect(sorted).toBe(defined.reverse())
    })



})