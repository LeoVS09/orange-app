export default function<T extends {[key: string]: unknown}, P extends string, R>(object: T, propertyName: P, fn: () => Promise<R>): T & {[K in P]: P} {
   const define = (value: R) =>
      Object.defineProperty(object, propertyName, {value: Promise.resolve(value), enumerable: true, writable: true});

   Object.defineProperty(object, propertyName, {
      configurable: true,
      enumerable: true,
      async get() {
         const result = await fn();
         define(result);
         return result;
      },
      set(value) {
         define(value);
      }
   });

   return object as T & {[K in P]: P};
};
