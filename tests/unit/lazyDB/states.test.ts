import { StateMemory } from "@/lazyDB/core/memory"
import { ModelEvent } from "@/lazyDB/core/types"
import { ModelEventTypes } from '@/lazyDB/database/events'
import { isChanged, isReading, isUpdating, isPending, isDeleted, isHaveUpdatingError, isHaveError, isSynced } from '@/lazyDB/database/states'

const DEFAULT_START_DATE = 1500000000000

const event = (type: ModelEventTypes): ModelEvent<any, any> => ({
    type,
    payload: {},
    date: DEFAULT_START_DATE
})

const failure = (type: ModelEventTypes): ModelEvent<any, any> => ({
    type: ModelEventTypes.Failure,
    payload: {
        event: { type }
    },
    date: DEFAULT_START_DATE
})

const success = (type: ModelEventTypes): ModelEvent<any, any> => ({
    type: ModelEventTypes.Success,
    payload: {
        event: { type }
    },
    date: DEFAULT_START_DATE
})

const events = (...types: Array<ModelEventTypes>): Array<ModelEvent<any, any>> =>
    types.map(event)

describe('Model State Resolver', () => {

    let memory: StateMemory<ModelEvent<any>>

    beforeEach(() => {
        memory = new StateMemory()
    })

    it('isChanged should return true when memory have set event', () => {
        memory.push(event(ModelEventTypes.SetProperty))

        const result = isChanged(memory)

        expect(result).toBeTruthy()
    })

    it('isChanged should return false when memory not have set event', () => {
        memory.push(event(ModelEventTypes.GetProperty))

        const result = isChanged(memory)

        expect(result).toBeFalsy()
    })

    it('isChanged should return true when memory have delete property event', () => {
        memory.push(event(ModelEventTypes.DeleteProperty))

        const result = isChanged(memory)

        expect(result).toBeTruthy()
    })

    it('isChanged should return true when memory have not only set event', () => {
        memory.push(...events(
            ModelEventTypes.GetProperty,
            ModelEventTypes.SetProperty,
            ModelEventTypes.Read
        ))

        const result = isChanged(memory)

        expect(result).toBeTruthy()
    })


    it('isChanged should return true when memory have not only delete property event', () => {
        memory.push(...events(
            ModelEventTypes.GetProperty,
            ModelEventTypes.DeleteProperty,
            ModelEventTypes.Update
        ))

        const result = isChanged(memory)

        expect(result).toBeTruthy()
    })

    it('isReading should return true when memory have read event', () => {
        memory.push(event(ModelEventTypes.Read))

        const result = isReading(memory)

        expect(result).toBeTruthy()
    })

    it('isReading should return true when memory have not only read event', () => {
        memory.push(...events(
            ModelEventTypes.Create,
            ModelEventTypes.Update,
            ModelEventTypes.Read,
        ))

        const result = isReading(memory)

        expect(result).toBeTruthy()
    })

    it('isReading should return false when memory not have read event', () => {
        memory.push(event(ModelEventTypes.Update))

        const result = isReading(memory)

        expect(result).toBeFalsy()
    })

    it('isUpdating should return true when memory have update event', () => {
        memory.push(event(ModelEventTypes.Update))

        const result = isUpdating(memory)

        expect(result).toBeTruthy()
    })

    it('isUpdating should return true when memory have not only update event', () => {
        memory.push(...events(
            ModelEventTypes.Update,
            ModelEventTypes.Read,
            ModelEventTypes.GetProperty
        ))

        const result = isUpdating(memory)

        expect(result).toBeTruthy()
    })

    it('isUpdating should return true when memory not have update event', () => {
        memory.push(...events(
            ModelEventTypes.SetProperty,
            ModelEventTypes.Read,
            ModelEventTypes.GetProperty
        ))

        const result = isUpdating(memory)

        expect(result).toBeFalsy()
    })

    it('isPending should return true when memory have Read event', () => {
        memory.push(...events(
            ModelEventTypes.SetProperty,
            ModelEventTypes.Read,
            ModelEventTypes.GetProperty
        ))

        const result = isPending(memory)

        expect(result).toBeTruthy()
    })

    
    it('isPending should return true when memory have Update event', () => {
        memory.push(...events(
            ModelEventTypes.SetProperty,
            ModelEventTypes.GetProperty,
            ModelEventTypes.Update
        ))

        const result = isPending(memory)

        expect(result).toBeTruthy()
    })

    it('isPending should return true when memory have Creating event', () => {
        memory.push(...events(
            ModelEventTypes.Create,
            ModelEventTypes.GetProperty,
            ModelEventTypes.GetProperty
        ))

        const result = isPending(memory)

        expect(result).toBeTruthy()
    })

    it('isPending should return true when memory have Delete event', () => {
        memory.push(...events(
            ModelEventTypes.Success,
            ModelEventTypes.Delete,
            ModelEventTypes.GetProperty
        ))

        const result = isPending(memory)

        expect(result).toBeTruthy()
    })

    it('isPending should return false when memory if not have Read, Create, Update, Delete events', () => {
        memory.push(...events(
            ModelEventTypes.Success,
            ModelEventTypes.SetProperty,
            ModelEventTypes.GetProperty
        ))

        const result = isPending(memory)

        expect(result).toBeFalsy()
    })
    
    it('isDeleted should return true when memory have success Delete event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            success(ModelEventTypes.Delete),
            event(ModelEventTypes.SetProperty)
        )

        const result = isDeleted(memory)

        expect(result).toBeTruthy()
    })

    it('isDeleted should return false when memory not have success Delete event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            event(ModelEventTypes.Delete),
            event(ModelEventTypes.SetProperty)
        )

        const result = isDeleted(memory)

        expect(result).toBeFalsy()
    })

    it('isHaveUpdatingError should return true when memory have failure Update event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            failure(ModelEventTypes.Update),
            event(ModelEventTypes.SetProperty)
        )

        const result = isHaveUpdatingError(memory)

        expect(result).toBeTruthy()
    })

    it('isHaveUpdatingError should return false when memory not have failure Update event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            event(ModelEventTypes.Update),
            event(ModelEventTypes.SetProperty)
        )

        const result = isHaveUpdatingError(memory)

        expect(result).toBeFalsy()
    })

    it('isHaveError should return true when memory have failure event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            failure(ModelEventTypes.Create),
            event(ModelEventTypes.SetProperty)
        )

        const result = isHaveError(memory)

        expect(result).toBeTruthy()
    })

    it('isHaveError should return false when memory not have failure event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            success(ModelEventTypes.Create),
            event(ModelEventTypes.SetProperty)
        )

        const result = isHaveError(memory)

        expect(result).toBeFalsy()
    })

    it('isSynced should return true when memory not have and changing and pending events', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            event(ModelEventTypes.Success),
            event(ModelEventTypes.GetProperty)
        )

        const result = isSynced(memory)

        expect(result).toBeTruthy()
    })

    it('isSynced should return false when memory have Rade event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            event(ModelEventTypes.Read),
            event(ModelEventTypes.GetProperty)
        )

        const result = isSynced(memory)

        expect(result).toBeFalsy()
    })

    it('isSynced should return false when memory have Create event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            event(ModelEventTypes.Create),
            event(ModelEventTypes.GetProperty)
        )

        const result = isSynced(memory)

        expect(result).toBeFalsy()
    })

    it('isSynced should return false when memory have Update event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            event(ModelEventTypes.Update),
            event(ModelEventTypes.GetProperty)
        )

        const result = isSynced(memory)

        expect(result).toBeFalsy()
    })

    it('isSynced should return false when memory have Delete event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            event(ModelEventTypes.Delete),
            event(ModelEventTypes.GetProperty)
        )

        const result = isSynced(memory)

        expect(result).toBeFalsy()
    })

    it('isSynced should return false when memory have Set event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            event(ModelEventTypes.SetProperty),
            event(ModelEventTypes.GetProperty)
        )

        const result = isSynced(memory)

        expect(result).toBeFalsy()
    })

    it('isSynced should return false when memory have New event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            event(ModelEventTypes.New),
            event(ModelEventTypes.GetProperty)
        )

        const result = isSynced(memory)

        expect(result).toBeFalsy()
    })


    it('isSynced should return false when memory have Failure event', () => {
        memory.push(
            event(ModelEventTypes.GetProperty),
            event(ModelEventTypes.SetProperty),
            event(ModelEventTypes.GetProperty)
        )

        const result = isSynced(memory)

        expect(result).toBeFalsy()
    })




})