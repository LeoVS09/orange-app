const memoizeFs = require('memoize-fs')
import path from 'path'

const cachePath = path.resolve(__dirname, '../__query-records__')

const memoizer = memoizeFs({ cachePath })

export interface WrapableFunction<T, R> {
    (...args: Array<T>): Promise<R>
}

export const wrapForCache = async <T, R>(name: string, fn: WrapableFunction<T, R>): Promise<WrapableFunction<T, R>> => {
    const memoized = await memoizer.fn(fn, {
        cacheId: name
    })

    return memoized
}

export default wrapForCache