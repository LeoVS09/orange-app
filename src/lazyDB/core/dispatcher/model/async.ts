import {AsyncEventDispatcher} from "../base/async";
import {ModelEventDispatcher} from "./base";

export class AsyncModelEventDispatcher extends ModelEventDispatcher {
   constructor(){
      super(new AsyncEventDispatcher())
   }
}
