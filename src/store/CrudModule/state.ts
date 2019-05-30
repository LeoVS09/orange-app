import {Identical} from "./types";

export default class CrudState<T extends Identical> {
   data: Array<T> = []
}
