export class WaitRequest {
    promise: Promise<any>
    resolve?: () => void
    isPending = true
    isWaiting = false

    constructor(){
        this.promise = new Promise(res => {
            this.resolve = () => {
                this.isPending = false
                res()
            }
        })
    }

    resolveWhenCan() {
        this.isPending = false

        if(this.resolve) {
            this.resolve()
            return
        }

        new Promise(resolve => {
            this.resolveWhenCan()
            resolve()
        })
    }
}

export class WaitStore {
    private waits: Array<WaitRequest>

    constructor(){
        this.waits = [
            new WaitRequest()
        ]
    }

    wait(): Promise<any> {
        const waitRequest = this.firstNotWaited
    
        waitRequest.isWaiting = true
    
        return waitRequest.promise
    }

    resolve() {
        const unresolved = this.firstUnresolved
    
        unresolved.resolveWhenCan()
    }

    private get firstNotWaited(): WaitRequest {
        const notWaited = this.waits.filter(w => !w.isWaiting)
        if(notWaited.length) {
            return notWaited[0]
        }

        const waitRequest = new WaitRequest()

        this.waits.push(waitRequest)
    
        return waitRequest
    }
    
    private get firstUnresolved(): WaitRequest {
        const unresolved = this.waits.filter(w => w.isPending)
        if(unresolved.length)
            return unresolved[0]
    
        const waitRequest = new WaitRequest()
    
        this.waits.push(waitRequest)
    
        return waitRequest
    }

}