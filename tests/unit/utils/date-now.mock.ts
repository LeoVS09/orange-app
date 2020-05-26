
// Static random date as start for snapshot testing
const DEFAULT_START_DATE = 1500000000000

const realDateNow = Date.now

export const mock = (now = DEFAULT_START_DATE) => {
    Date.now = () => now
}

export const tick = (tickTime = 1) => {
    const start = Date.now()
    const now = start + tickTime
    Date.now = () => now
}

export const restore = () => {
    Date.now = realDateNow
}