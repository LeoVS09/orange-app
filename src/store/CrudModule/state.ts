import {Identical} from "./types";

export default class CrudState<T extends Identical> {
   // domr
   data: Array<T> = []
}
