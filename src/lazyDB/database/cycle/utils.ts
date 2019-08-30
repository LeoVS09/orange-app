import { merge, Observable} from 'rxjs'
import { sample, skipWhile, takeWhile} from 'rxjs/operators'

// TODO: turn into operator
export function takeWhileThenContinue<T>(stream: Observable<T>, predicate: (v: T) => boolean, sampler: Observable<any>) {
   const whileTrue = stream.pipe(takeWhile(predicate))
   const lastWhenFalse = stream.pipe(
      skipWhile(predicate),
      sample(sampler),
   )

   return merge(
      whileTrue,
      lastWhenFalse,
   )
}
