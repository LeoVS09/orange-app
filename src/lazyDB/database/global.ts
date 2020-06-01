import { getStore } from '@/lazyDB/core/common'
import { Database } from './connected/Database'
import { appendToWindow } from './utils'

// Global default database
// Only for simplified usage of library

const db = new Database()

export default db

appendToWindow({ db })

// Connected to global db entity repository
// TODO: rewirite extending
const { Repository } = db

export {
  db,
  Repository
}

const store = getStore(db.storage)

store!.stream!.subscribe(event => console.log('global store debug', event))
