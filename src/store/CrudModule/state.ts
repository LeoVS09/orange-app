import { Identical} from './types'

export default class CrudState<T extends Identical> {
   // domr
   public data: Array<T> = []
}
