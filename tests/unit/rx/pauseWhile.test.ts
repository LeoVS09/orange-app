import { TestScheduler } from 'rxjs/testing';
import { pauseWhile } from '@/lazyDB/reactive/pauseWhile';



// This tests will actually run *synchronously*
describe('PauseWhile', () => {
    let testScheduler: TestScheduler

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    })


    it('pause when asked', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source = hot('--a--a--a--a--a--a-----a---');
            const pause = hot(' ----------t----------------', {t: true, f: false})
            const expect = '    --a--a--a------------------';

            let isOnPause = false;
            pause.subscribe(v => isOnPause = v)

            const result = source.pipe(pauseWhile(() => isOnPause))

            expectObservable(result).toBe(expect);
        });
    });


    it('pause then replay all events on pause', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source = hot('--a--a--a--a--a---a----a---');
            const pause = hot(' ----------t------f---------', {t: true, f: false})
            const expect = '    --a--a--a---------(aaa)a--';

            let isOnPause = false;
            pause.subscribe(v => isOnPause = v)

            const result = source.pipe(pauseWhile(() => isOnPause))

            expectObservable(result).toBe(expect);
        });
    });

    
    it('pause and not spawn events if not was on pause', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source = hot('--a--a--a--------------a---');
            const pause = hot(' ----------t-------f--------', {t: true, f: false})
            const expect = '    --a--a--a--------------a--';

            let isOnPause = false;
            pause.subscribe(v => isOnPause = v)

            const result = source.pipe(pauseWhile(() => isOnPause))

            expectObservable(result).toBe(expect);
        });
    });

    it('pause and not spawn event in it frame', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const pause = hot(' ----------t-----f----------', {t: true, f: false})
            const source = hot('--a--a--a-a--a----a----a---');
            const expect = '    --a--a--a---------(aaa)a--';

            let isOnPause = false;
            pause.subscribe(v => isOnPause = v)

            const result = source.pipe(pauseWhile(() => isOnPause))

            expectObservable(result).toBe(expect);
        });
    });


    it('multiple times pause', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source = hot('--a--a--a--a--a---a----a--a-a--a----a--');
            const pause = hot(' ----------t------f--------t---f---------', {t: true, f: false})
            const expect = '    --a--a--a---------(aaa)a--a----(aa)-a---';

            let isOnPause = false;
            pause.subscribe(v => isOnPause = v)

            const result = source.pipe(pauseWhile(() => isOnPause))

            expectObservable(result).toBe(expect);
        });
    });
})
