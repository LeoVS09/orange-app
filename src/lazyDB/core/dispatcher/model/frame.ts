import {ModelEventDispatcher} from "./base";
import {AsyncBeforeAnimationFrameDispatcher} from "../base/frame";

// js have different behavior to "new Promise" and "Promise.resolve"
// if you want to all event handlers and pipe will be executed before next frame
// use this dispatch handler
export class AsyncBeforeAnimationFrameModelEventDispatcher extends ModelEventDispatcher {

   constructor(){
      super(new AsyncBeforeAnimationFrameDispatcher())
   }
}


