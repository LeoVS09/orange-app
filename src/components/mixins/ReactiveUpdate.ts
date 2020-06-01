import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Subject } from 'rxjs'
import { debounceTime, tap } from 'rxjs/operators'

export interface ReactiveUpdateOptions {
  force?: boolean
  debounce?: number | null
}

const UPDATE_SUBJECT = '_REACTIVE_UPDATE_SUBJECT'
const UPDATE_OBSERVABLE = '_REACTIVE_UPDATE_OBSERVABLE'

@Component
export default class ReactiveUpdate extends Vue {

  reactive = 0

  reactiveUpdateOptions: ReactiveUpdateOptions = {
    force: false,
    debounce: null
  }

  updateInstance() {
    if (this.reactiveUpdateOptions.force) {
      this.$forceUpdate()
      return
    }

    this.reactive++

    console.log('[ReactiveUpdate] update reactive field result', this.reactive)
  }

  onReactiveUpdateEvent() {

    // Must be in runtime for disallow vue track this property
    // @ts-ignore
    if (!this[UPDATE_SUBJECT])
      // @ts-ignore
      this[UPDATE_SUBJECT] = new Subject()

    // @ts-ignore
    const subject: Subject<any> = this[UPDATE_SUBJECT]

    // Must be in runtime for disallow vue track this property
    // @ts-ignore
    if (!this[UPDATE_OBSERVABLE]) {
      let observable = subject.pipe(tap(() => console.log('[ReactiveUpdate] received update event')))

      if (this.reactiveUpdateOptions.debounce)
        observable = observable.pipe(debounceTime(this.reactiveUpdateOptions.debounce))

      observable.subscribe(() => this.updateInstance())

      // @ts-ignore
      this[UPDATE_OBSERVABLE] = observable
    }

    subject.next()
  }

}

export function reactiveUpdate(vm: ReactiveUpdate) {
  return () => {
    vm.onReactiveUpdateEvent()
  }
}
