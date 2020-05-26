import { TestScheduler } from 'rxjs/testing';
import { pauseWhile } from '@/lazyDB/reactive/pauseWhile';
import { StateMemory } from '@/lazyDB/core/memory';
import { ModelEvent, Producerable } from '@/lazyDB/core/types';
import { ModelEventTypes, ModelEventReadPayload, ReadSuccessEventPayload, ReadFailureEventPayload } from '@/lazyDB/database/events';
import { spawnRead } from '@/lazyDB/lifeCycle/spawnRead';
import { tap, map } from 'rxjs/operators';
import { IDatabaseModelProducerStore } from '@/lazyDB/database/types';
import cons from '../utils/console.mock'

// used constant date to not break deep equality check
const date = Date.now();

const getEvent = (): ModelEvent<any> => ({
    type: ModelEventTypes.GetProperty,
    date,
    payload: { store: {readSchema: {}}}
})

const readEvent = (payload: ModelEventReadPayload): ModelEvent<ModelEventReadPayload> => ({
    type: ModelEventTypes.Read,
    date,
    payload
})

const readEventWithGets = (get: ModelEvent<any>, count: number, memory: StateMemory<any>): ModelEvent<any> => 
    readEvent({
        gets: new Array(count).fill(get),
        sets: [],
        store: { memory } as IDatabaseModelProducerStore
    })

const readSuccessEvent = (readPayload: ModelEventReadPayload): ModelEvent<ReadSuccessEventPayload> => ({
    type: ModelEventTypes.ReadSuccess,
    date,
    payload: { 
        readPayload,
        data: {} as Producerable,
        store: {} as IDatabaseModelProducerStore
    }
})

const readFailureEvent = (readPayload: ModelEventReadPayload): ModelEvent<ReadFailureEventPayload> => ({
    type: ModelEventTypes.ReadFailure,
    date,
    payload: { 
        readPayload,
        error: {},
        store: {} as IDatabaseModelProducerStore
    }
})

// This tests will actually run *synchronously*
describe('Spawn Read', () => {
    let testScheduler: TestScheduler
    let memory: StateMemory<ModelEvent<any>>

    const pushInMemory = () => tap((e: ModelEvent<any>) => memory.push(e))

    const removeReadFromMemoryOnSuccess = () => tap(({type}: ModelEvent<any>) => {
        if(type !== ModelEventTypes.ReadSuccess) 
            return
        
        memory.exclude(event => event.type === ModelEventTypes.Read)
    })

    const removeReadFromMemoryOnFail = () => tap(({type}: ModelEvent<any>) => {
        if(type !== ModelEventTypes.ReadFailure) 
            return
        
        memory.exclude(event => event.type === ModelEventTypes.Read)
    })

    beforeAll(() => {
        cons.mockConsole()
    })

    afterAll(() => {
        cons.restoreConsole()
    })

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });

        memory = new StateMemory()
    })


    it('when get events on pause', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const get = getEvent()
            const source = hot('--a--a--a--a--a--a 20ms ', {a: get});
            const expect = '    -----------------  20ms r ';
            
            const withRead = source.pipe(
                pushInMemory(),
                spawnRead({ memory } as any, {
                    waitTimeWhenGetsStopSpawn: 20,
                    scheduler: testScheduler
                }),
                map(readEvent),
                pushInMemory()
            )

            const read = readEventWithGets(get, 6, memory)
            expectObservable(withRead).toBe(expect, {r: read});
        });
    });


    it('not spawn when reading in process', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const get = getEvent()
            const source = hot('--a--a--a--a--a--a 30ms a 10ms a 20ms ', {a: get});
            const expect = '    -----------------  20ms r';
            
            const withRead = source.pipe(
                pushInMemory(),
                spawnRead({ memory } as any, {
                    waitTimeWhenGetsStopSpawn: 20,
                    scheduler: testScheduler
                }),
                map(readEvent),
                pushInMemory()
            )

            const read = readEventWithGets(get, 6, memory)
            expectObservable(withRead).toBe(expect, {r: read});
        });
    });

    it('two times sequentially', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const get = getEvent()
            const read = readEventWithGets(get, 2, memory)
            const success = readSuccessEvent(read.payload)
            const source = hot('--a--a 20ms - 30ms s--a--a--a 20ms ', {a: get, s: success});
            const expect = '    -----  20ms 1 30ms ---------- 20ms 2 ';
            
            const withRead = source.pipe(
                pushInMemory(),
                removeReadFromMemoryOnSuccess(),
                spawnRead({ memory } as any, {
                    waitTimeWhenGetsStopSpawn: 20,
                    scheduler: testScheduler
                }),
                map(readEvent),
                pushInMemory()
            )

            expectObservable(withRead).toBe(expect, {
                1: read, 
                2: readEventWithGets(get, 5, memory)
            });
        });
    });

    it('second time after success', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const get = getEvent()
            const read = readEventWithGets(get, 2, memory)
            const success = readSuccessEvent(read.payload)
            const source = hot('--a--a 20ms --a-a 30ms s 20ms ', {a: get, s: success});
            const expect = '    -----  20ms 1---- 30ms - 20ms 2 ';
            
            const withRead = source.pipe(
                pushInMemory(),
                removeReadFromMemoryOnSuccess(),
                spawnRead({ memory } as any, {
                    waitTimeWhenGetsStopSpawn: 20,
                    scheduler: testScheduler
                }),
                map(readEvent),
                pushInMemory()
            )

            expectObservable(withRead).toBe(expect, {
                1: read, 
                2: readEventWithGets(get, 4, memory)
            });
        });
    });

    it('second time after success and event', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const get = getEvent()
            const read = readEventWithGets(get, 2, memory)
            const success = readSuccessEvent(read.payload)
            const source = hot('--a--a 20ms --a-a 30ms s 10ms a--a 20ms ', {a: get, s: success});
            const expect = '    -----  20ms 1---- 30ms - 10ms ---- 20ms 2 ';
            
            const withRead = source.pipe(
                pushInMemory(),
                removeReadFromMemoryOnSuccess(),
                spawnRead({ memory } as any, {
                    waitTimeWhenGetsStopSpawn: 20,
                    scheduler: testScheduler
                }),
                map(readEvent),
                pushInMemory()
            )

            expectObservable(withRead).toBe(expect, {
                1: read, 
                2: readEventWithGets(get, 6, memory)
            });
        });
    });

    it('second time after failure', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const get = getEvent()
            const read = readEventWithGets(get, 2, memory)
            const failure = readFailureEvent(read.payload)
            const source = hot('--a--a 20ms --a-a 30ms f 20ms ', {a: get, f: failure});
            const expect = '    -----  20ms 1---- 30ms - 20ms 2 ';
            
            const withRead = source.pipe(
                pushInMemory(),
                removeReadFromMemoryOnFail(),
                spawnRead({ memory } as any, {
                    waitTimeWhenGetsStopSpawn: 20,
                    scheduler: testScheduler
                }),
                map(readEvent),
                pushInMemory()
            )

            expectObservable(withRead).toBe(expect, {
                1: read, 
                2: readEventWithGets(get, 4, memory)
            });
        });
    });

    it('second time after failure and event', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const get = getEvent()
            const read = readEventWithGets(get, 2, memory)
            const failure = readFailureEvent(read.payload)
            const source = hot('--a--a 20ms --a-a 30ms f 10ms a--a 20ms ', {a: get, f: failure});
            const expect = '    -----  20ms 1---- 30ms - 10ms ---- 20ms 2 ';
            
            const withRead = source.pipe(
                pushInMemory(),
                removeReadFromMemoryOnFail(),
                spawnRead({ memory } as any, {
                    waitTimeWhenGetsStopSpawn: 20,
                    scheduler: testScheduler
                }),
                map(readEvent),
                pushInMemory()
            )

            expectObservable(withRead).toBe(expect, {
                1: read, 
                2: readEventWithGets(get, 6, memory)
            });
        });
    });
})
