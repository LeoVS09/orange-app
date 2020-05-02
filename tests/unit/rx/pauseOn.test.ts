import { TestScheduler } from 'rxjs/testing';
import { pauseOn } from '@/lazyDB/intercepters/pauseOn';



// This tests will actually run *synchronously*
describe('PauseOn', () => {
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
            const sub = '       --^------------------------!';
            const expect = '    --a--a--a------------------';

            const result = source.pipe(pauseOn(pause))

            expectObservable(result, sub).toBe(expect);
        });
    });


    it('pause then replay all events on pause', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source = hot('--a--a--a--a--a--a-----a---');
            const pause = hot(' ----------t-------f--------', {t: true, f: false})
            const sub = '       --^------------------------!';
            const expect = '    --a--a--a---------(aaa)a--';

            const result = source.pipe(pauseOn(pause))

            expectObservable(result, sub).toBe(expect);
        });
    });

    
    it('pause and not spawn events if not was on pause', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source = hot('--a--a--a--------------a---');
            const pause = hot(' ----------t-------f--------', {t: true, f: false})
            const sub = '       --^------------------------!';
            const expect = '    --a--a--a--------------a--';

            const result = source.pipe(pauseOn(pause))

            expectObservable(result, sub).toBe(expect);
        });
    });

    it('pause and not spawn event in it frame', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const pause = hot(' ----------t-------f--------', {t: true, f: false})
            const source = hot('--a--a--a-a--a--a------a---');
            const sub = '       --^------------------------!';
            const expect = '    --a--a--a---------(aaa)a--';

            const result = source.pipe(pauseOn(pause))

            expectObservable(result, sub).toBe(expect);
        });
    });


    it('multiple times pause', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source = hot('--a--a--a--a--a--a-----a--a-a-a-----a--');
            const pause = hot(' ----------t-------f-------t----f--------', {t: true, f: false})
            const sub = '       --^-------------------------------------!';
            const expect = '    --a--a--a---------(aaa)a--a----(aa)-a---';

            const result = source.pipe(pauseOn(pause))

            expectObservable(result, sub).toBe(expect);
        });
    });
})
